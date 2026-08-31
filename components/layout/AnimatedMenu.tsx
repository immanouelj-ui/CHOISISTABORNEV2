"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { X } from "lucide-react";

const LINKS = [
  { href: "/produits", label: "Produits" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/#conseils", label: "Conseils" },
];

export default function AnimatedMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(panelRef.current, { display: "flex" });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(panelRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.01 : 0.6 });
        tl.fromTo(
          linksRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.5, stagger: reduced ? 0 : 0.06 },
          "-=0.25",
        );
      } else if (panelRef.current) {
        gsap.to(panelRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: reduced ? 0.01 : 0.45,
          ease: "power3.in",
          onComplete: () => gsap.set(panelRef.current, { display: "none" }),
        });
      }
    });
    return () => ctx.revert();
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[70] hidden flex-col bg-ink px-6 pt-28 pb-10 md:hidden"
      style={{ clipPath: "inset(0 0 100% 0)" }}
    >
      <button
        onClick={onClose}
        aria-label="Fermer le menu"
        className="absolute right-6 top-8 text-paper"
      >
        <X size={28} strokeWidth={1.5} />
      </button>
      <nav className="flex flex-1 flex-col justify-center gap-6">
        {LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            ref={(el) => {
              if (el) linksRef.current[i] = el;
            }}
            className="font-display text-4xl font-light tracking-tight text-paper"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="text-sm text-fog">Choisissez la borne qui vous correspond.</p>
    </div>
  );
}
