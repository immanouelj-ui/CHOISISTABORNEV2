import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createStripeCheckoutSession } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = clean(body.email).toLowerCase();
    const name = clean(body.name);
    const phone = clean(body.phone) || null;
    const shippingAddress = clean(body.shippingAddress);
    const billingAddress = clean(body.billingAddress) || shippingAddress;
    const requestedUserId = clean(body.userId) || null;
    const items = Array.isArray(body.items) ? body.items : [];

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }
    if (!name || !shippingAddress || items.length === 0) {
      return NextResponse.json({ error: "Informations client ou panier incomplets." }, { status: 400 });
    }

    let authenticatedUserId: string | null = null;
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => undefined,
        },
      }
    );
    const { data: { user: authUser } } = await supabase.auth.getUser();
    authenticatedUserId = authUser?.id ?? null;

    if (requestedUserId && requestedUserId !== authenticatedUserId) {
      return NextResponse.json({ error: "Utilisateur non autorisé." }, { status: 403 });
    }
    const userId = authenticatedUserId;

    const requested = new Map<string, number>();
    for (const item of items) {
      const productId = clean(item?.productId);
      const quantity = Number(item?.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json({ error: "Panier invalide." }, { status: 400 });
      }
      const totalQuantity = (requested.get(productId) || 0) + quantity;
      if (totalQuantity > 99) {
        return NextResponse.json({ error: "Quantité maximale dépassée." }, { status: 400 });
      }
      requested.set(productId, totalQuantity);
    }

    const products = await prisma.product.findMany({
      where: { id: { in: [...requested.keys()] }, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1, orderBy: { order: "asc" } } },
    });

    if (products.length !== requested.size) {
      return NextResponse.json({ error: "Un ou plusieurs produits ne sont plus disponibles." }, { status: 409 });
    }

    const orderItems = products.map((product) => {
      const quantity = requested.get(product.id)!;
      if (!product.inStock || product.stock < quantity) {
        throw new Error(`STOCK:${product.name}`);
      }
      return {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        unitPriceHT: product.priceHT,
        unitPriceTTC: product.priceTTC,
        vatRate: product.vatRate,
        quantity,
        totalHT: product.priceHT * quantity,
        totalTTC: product.priceTTC * quantity,
        image: product.images[0]?.url,
      };
    });

    const subtotalTTC = Number(orderItems.reduce((sum, item) => sum + item.totalTTC, 0).toFixed(2));
    const subtotalHT = Number(orderItems.reduce((sum, item) => sum + item.totalHT, 0).toFixed(2));
    const taxAmount = Number((subtotalTTC - subtotalHT).toFixed(2));
    const orderNumber = `CT-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const orderId = crypto.randomUUID();
    const now = new Date();

    const order = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber,
        userId,
        status: "PENDING",
        paymentStatus: "UNPAID",
        subtotalHT,
        taxAmount,
        shippingCost: 0,
        discountAmount: 0,
        totalTTC: subtotalTTC,
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        shippingAddress,
        billingAddress,
        createdAt: now,
        updatedAt: now,
        items: { create: orderItems.map(({ image: _image, ...item }) => item) },
      },
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      const session = await createStripeCheckoutSession({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: email,
        totalCents: Math.round(subtotalTTC * 100),
        successUrl: `${baseUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/paiement/annule?order=${encodeURIComponent(order.orderNumber)}`,
        items: orderItems.map((item) => ({
          name: item.productName,
          unitAmount: Math.round(item.unitPriceTTC * 100),
          quantity: item.quantity,
          image: item.image,
        })),
      });

      await prisma.payment.create({
        data: {
          id: crypto.randomUUID(),
          orderId: order.id,
          provider: "STRIPE",
          transactionId: session.id,
          amount: subtotalTTC,
          currency: "EUR",
          status: "PENDING",
          paymentMethod: "CHECKOUT",
          createdAt: now,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ checkoutUrl: session.url, orderNumber: order.orderNumber });
    } catch (stripeError) {
      await prisma.order.delete({ where: { id: order.id } }).catch(() => undefined);
      throw stripeError;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création de la commande.";
    if (message.startsWith("STOCK:")) {
      return NextResponse.json({ error: `${message.slice(6)} n'est plus disponible en quantité suffisante.` }, { status: 409 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Impossible de démarrer le paiement." }, { status: 500 });
  }
}
