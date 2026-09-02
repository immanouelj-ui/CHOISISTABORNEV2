import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStripeWebhookSignature } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  try {
    if (!verifyStripeWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
    }

    const event = JSON.parse(payload) as { type: string; data?: { object?: any } };
    const session = event.data?.object;
    const orderId = session?.metadata?.orderId as string | undefined;

    if (!orderId) return NextResponse.json({ received: true });

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await prisma.$transaction(async (tx) => {
        // Atomic claim prevents two Stripe deliveries from decrementing stock twice.
        const paymentClaim = await tx.payment.updateMany({
          where: {
            orderId,
            transactionId: session?.id,
            status: "PENDING",
          },
          data: { status: "PROCESSING", updatedAt: new Date() },
        });

        if (paymentClaim.count !== 1) return;

        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order || order.paymentStatus === "PAID") return;

        for (const item of order.items) {
          const result = await tx.product.updateMany({
            where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count !== 1) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }
        }

        const now = new Date();
        await tx.order.update({
          where: { id: order.id },
          data: { status: "PAID", paymentStatus: "PAID", updatedAt: now },
        });
        await tx.payment.updateMany({
          where: { orderId: order.id, transactionId: session.id },
          data: {
            status: "PAID",
            paymentMethod: session.payment_method_types?.[0] || "CARD",
            updatedAt: now,
          },
        });
      });
    }

    if (
      event.type === "checkout.session.expired" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const now = new Date();
      await prisma.$transaction([
        prisma.order.updateMany({
          where: { id: orderId, paymentStatus: { not: "PAID" } },
          data: { status: "CANCELLED", paymentStatus: "FAILED", updatedAt: now },
        }),
        prisma.payment.updateMany({
          where: { orderId, status: { not: "PAID" } },
          data: { status: "FAILED", updatedAt: now },
        }),
      ]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
