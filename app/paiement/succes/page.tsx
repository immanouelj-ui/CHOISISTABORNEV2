import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { retrieveStripeCheckoutSession } from "@/lib/stripe";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PaiementSuccesPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;
  let order: any = null;

  if (sessionId) {
    const payment = await prisma.payment.findFirst({
      where: { transactionId: sessionId },
      include: { order: { include: { items: true } } },
    });
    order = payment?.order || null;

    if (!order) {
      try {
        const session = await retrieveStripeCheckoutSession(sessionId);
        if (session.metadata?.orderId) {
          order = await prisma.order.findUnique({ where: { id: session.metadata.orderId }, include: { items: true } });
        }
      } catch {
        // The webhook remains the source of truth if Stripe cannot be reached here.
      }
    }
  }

  return (
    <main className="min-h-screen bg-ink px-6 pb-32 pt-40 text-paper md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-line p-8 md:p-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-fog">ChoisiTaBorne</p>
          <h1 className="font-display text-4xl font-light">Merci pour votre commande.</h1>
          {order ? (
            <>
              <p className="mt-5 text-paper/70">Commande <strong className="text-paper">{order.orderNumber}</strong></p>
              <div className="mt-8 space-y-3 border-y border-line py-6">
                {order.items.map((item: any) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="text-paper/70">{item.productName} × {item.quantity}</span><span>{formatPrice(item.totalTTC)}</span></div>)}
                <div className="flex justify-between pt-3 font-display text-lg"><span>Total</span><span>{formatPrice(order.totalTTC)}</span></div>
              </div>
              <p className="mt-6 text-sm text-paper/70">Un e-mail de confirmation sera envoyé à {order.customerEmail}. Vous pourrez ensuite suivre la préparation et la livraison de votre commande.</p>
            </>
          ) : (
            <p className="mt-6 text-paper/70">Votre paiement a été transmis. La confirmation de commande est en cours de traitement.</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/produits" className="rounded-full bg-paper px-6 py-3 text-ink">Continuer mes achats</Link>
            <Link href="/compte" className="rounded-full border border-line px-6 py-3">Mon compte</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
