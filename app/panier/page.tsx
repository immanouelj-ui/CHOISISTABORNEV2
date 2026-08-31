"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function PanierPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(lines);

  return (
    <div className="min-h-screen bg-ink px-6 pb-32 pt-40 md:px-12">
      <div className="mx-auto max-w-content">
        <h1 className="mb-12 font-display text-display-2 font-light text-paper">Votre panier</h1>

        {lines.length === 0 ? (
          <div className="flex flex-col items-start gap-6">
            <p className="text-paper/70">Votre panier est vide pour l&apos;instant.</p>
            <ButtonLink href="/produits">Découvrir les bornes</ButtonLink>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-6 border-b border-line pb-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-ink-raised">
                    <Image src={line.image} alt={line.name} fill sizes="128px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-fog">{line.brand}</p>
                        <Link href={`/produits/${line.slug}`} className="font-display text-lg text-paper hover:underline">
                          {line.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(line.productId)}
                        aria-label="Retirer l'article"
                        className="text-fog hover:text-paper"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1.5">
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="text-paper/70 hover:text-paper"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="text-paper/70 hover:text-paper"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-paper">{formatPrice(line.price * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-3xl border border-line p-8">
              <h2 className="mb-6 font-display text-xl text-paper">Récapitulatif</h2>
              <div className="mb-2 flex justify-between text-sm text-paper/70">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="mb-6 flex justify-between text-sm text-paper/70">
                <span>Installation</span>
                <span>Sur devis</span>
              </div>
              <div className="mb-8 flex justify-between border-t border-line pt-4 font-display text-lg text-paper">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" size="lg">Passer au paiement</Button>
              <p className="mt-4 text-center text-xs text-fog">Paiement sécurisé via Stripe (mode test)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
