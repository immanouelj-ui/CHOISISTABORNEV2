"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  const total = cartTotal(lines);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className={`fixed right-0 top-0 z-[90] flex h-[100dvh] w-full max-w-md flex-col border-l border-line bg-ink-soft shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-6">
          <h2 className="font-display text-xl text-paper">Votre panier</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer le panier"
            className="rounded-full p-2 text-paper/70 transition hover:bg-paper/10 hover:text-paper"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-paper/70">Votre panier est vide pour l&apos;instant.</p>
            <Link href="/produits" onClick={close} className="text-sm text-charge-bright underline underline-offset-4">
              Découvrir les bornes
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                    <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-fog">{line.brand}</p>
                        <p className="truncate font-medium text-paper">{line.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        aria-label="Retirer l'article"
                        className="shrink-0 text-fog transition hover:text-paper"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="text-paper/70 hover:text-paper"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="text-paper/70 hover:text-paper"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="shrink-0 text-sm text-paper">{formatPrice(line.price * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 border-t border-line bg-ink-soft px-6 py-6">
              <div className="mb-4 flex items-center justify-between text-paper">
                <span className="text-sm text-fog">Total</span>
                <span className="font-display text-xl">{formatPrice(total)}</span>
              </div>
              <Link href="/panier" onClick={close} className="block">
                <Button className="w-full">Voir le panier</Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
