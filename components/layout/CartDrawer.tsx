"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
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

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set([overlayRef.current, panelRef.current], { display: "block" });
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.01 : 0.35 });
        gsap.fromTo(
          panelRef.current,
          { xPercent: 100 },
          { xPercent: 0, duration: reduced ? 0.01 : 0.55, ease: "power3.out" },
        );
        if (rowsRef.current) {
          gsap.fromTo(
            rowsRef.current.children,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, duration: reduced ? 0.01 : 0.45, stagger: reduced ? 0 : 0.07, delay: reduced ? 0 : 0.15 },
          );
        }
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: reduced ? 0.01 : 0.3,
          onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
        });
        gsap.to(panelRef.current, {
          xPercent: 100,
          duration: reduced ? 0.01 : 0.4,
          ease: "power3.in",
          onComplete: () => gsap.set(panelRef.current, { display: "none" }),
        });
      }
    });
    return () => ctx.revert();
  }, [isOpen, lines.length]);

  const total = cartTotal(lines);

  return (
    <>
      <div
        ref={overlayRef}
        onClick={close}
        className="fixed inset-0 z-[80] hidden bg-ink/70 backdrop-blur-sm"
        style={{ opacity: 0 }}
        aria-hidden={!isOpen}
      />
      <aside
        ref={panelRef}
        className="fixed right-0 top-0 z-[90] hidden h-full w-full max-w-md flex-col bg-ink-soft border-l border-line"
        style={{ transform: "translateX(100%)" }}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-6">
          <h2 className="font-display text-xl text-paper">Votre panier</h2>
          <button onClick={close} aria-label="Fermer le panier" className="text-paper/70 hover:text-paper">
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
            <div ref={rowsRef} className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                    <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-fog">{line.brand}</p>
                        <p className="font-medium text-paper">{line.name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(line.productId)}
                        aria-label="Retirer l'article"
                        className="text-fog hover:text-paper"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
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
                      <p className="text-sm text-paper">{formatPrice(line.price * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-6 py-6">
              <div className="mb-4 flex items-center justify-between text-paper">
                <span className="text-sm text-fog">Total</span>
                <span className="font-display text-xl">{formatPrice(total)}</span>
              </div>
              <ButtonLinkToCheckout onNavigate={close} />
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function ButtonLinkToCheckout({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link href="/panier" onClick={onNavigate}>
      <Button className="w-full">Voir le panier</Button>
    </Link>
  );
}
