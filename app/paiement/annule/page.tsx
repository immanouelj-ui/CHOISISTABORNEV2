import Link from "next/link";

export default function PaiementAnnulePage() {
  return (
    <main className="min-h-screen bg-ink px-6 pb-32 pt-40 text-paper md:px-12">
      <div className="mx-auto max-w-2xl rounded-3xl border border-line p-8 md:p-12">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-fog">Paiement annulé</p>
        <h1 className="font-display text-4xl font-light">Votre commande n&apos;a pas été payée.</h1>
        <p className="mt-5 text-paper/70">Aucun prélèvement n&apos;est effectué si le paiement n&apos;a pas été validé. Vous pouvez retourner au panier et réessayer.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/panier" className="rounded-full bg-paper px-6 py-3 text-ink">Retour au panier</Link>
          <Link href="/produits" className="rounded-full border border-line px-6 py-3">Voir les produits</Link>
        </div>
      </div>
    </main>
  );
}
