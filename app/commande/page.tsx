"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";

export default function CommandePage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const [sameBilling, setSameBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", shippingAddress: "", billingAddress: "" });

  useEffect(() => {
    if (sameBilling) setForm((current) => ({ ...current, billingAddress: current.shippingAddress }));
  }, [sameBilling, form.shippingAddress]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de créer la commande.");
      clear();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <main className="min-h-screen bg-ink px-6 pb-32 pt-40 text-paper md:px-12">
        <div className="mx-auto max-w-content">
          <h1 className="font-display text-display-2 font-light">Votre panier est vide</h1>
          <Link href="/produits" className="mt-8 inline-block underline">Retour aux produits</Link>
        </div>
      </main>
    );
  }

  const total = cartTotal(lines);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-screen bg-ink px-6 pb-32 pt-40 text-paper md:px-12">
      <div className="mx-auto max-w-content">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-fog">Commande sécurisée</p>
          <h1 className="font-display text-display-2 font-light">Vos informations</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="space-y-8">
            <section className="rounded-3xl border border-line p-7 md:p-9">
              <h2 className="mb-6 font-display text-2xl">Coordonnées</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">Nom complet<input required value={form.name} onChange={(e) => update("name", e.target.value)} className="checkout-input" /></label>
                <label>E-mail<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="checkout-input" /></label>
                <label>Téléphone<input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="checkout-input" /></label>
              </div>
            </section>

            <section className="rounded-3xl border border-line p-7 md:p-9">
              <h2 className="mb-6 font-display text-2xl">Livraison</h2>
              <label>Adresse de livraison<textarea required rows={4} value={form.shippingAddress} onChange={(e) => update("shippingAddress", e.target.value)} className="checkout-input" /></label>
              <label className="mt-6 flex items-center gap-3 text-sm text-paper/80"><input type="checkbox" checked={sameBilling} onChange={(e) => setSameBilling(e.target.checked)} /> Adresse de facturation identique</label>
              {!sameBilling && <label className="mt-6 block">Adresse de facturation<textarea required rows={4} value={form.billingAddress} onChange={(e) => update("billingAddress", e.target.value)} className="checkout-input" /></label>}
            </section>

            {error && <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}

            <button disabled={loading} className="w-full rounded-full bg-paper px-6 py-4 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50">
              {loading ? "Redirection vers Stripe…" : `Payer ${formatPrice(total)}`}
            </button>
            <p className="text-center text-xs text-fog">Vous serez redirigé vers Stripe pour saisir vos informations de paiement.</p>
          </form>

          <aside className="h-fit rounded-3xl border border-line p-7 lg:sticky lg:top-32">
            <h2 className="mb-6 font-display text-xl">Récapitulatif</h2>
            <div className="space-y-4">
              {lines.map((line) => <div key={line.productId} className="flex justify-between gap-4 text-sm"><span className="text-paper/70">{line.name} × {line.quantity}</span><span>{formatPrice(line.price * line.quantity)}</span></div>)}
            </div>
            <div className="mt-6 flex justify-between border-t border-line pt-5 font-display text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
