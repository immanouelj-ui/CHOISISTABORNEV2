"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, Search, User, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import AnimatedMenu from "./AnimatedMenu";

type SessionUser = { name: string | null; email: string; role: string };

export default function AnimatedHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const lines = useCartStore((s) => s.lines);
  const toggleCart = useCartStore((s) => s.toggle);
  const lastAddedId = useCartStore((s) => s.lastAddedId);
  const count = cartCount(lines);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let compact = false;
    const onScroll = () => {
      const shouldCompact = window.scrollY > 80;
      if (shouldCompact !== compact) {
        compact = shouldCompact;
        gsap.to(header, {
          paddingTop: compact ? "0.85rem" : "1.5rem",
          paddingBottom: compact ? "0.85rem" : "1.5rem",
          backgroundColor: compact ? "rgba(11,13,16,0.86)" : "rgba(11,13,16,0)",
          backdropFilter: compact ? "blur(14px)" : "blur(0px)",
          borderColor: compact ? "rgba(244,243,239,0.08)" : "rgba(244,243,239,0)",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lastAddedId || !badgeRef.current) return;
    gsap.fromTo(badgeRef.current, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
  }, [lastAddedId]);

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-transparent px-6 py-6 md:px-12" style={{ backgroundColor: "rgba(11,13,16,0)" }}>
        <div className="mx-auto flex max-w-content items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight text-paper">
            <span className="font-light">choisis</span><span className="font-normal text-fog">ta</span><span className="font-extrabold">borne</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-paper/80 md:flex">
            <Link href="/produits" className="transition-colors hover:text-paper">Produits</Link>
            <Link href="/#solutions" className="transition-colors hover:text-paper">Solutions</Link>
            <Link href="/simulateur" className="transition-colors hover:text-paper">Simulateur</Link>
            <Link href="/#conseils" className="transition-colors hover:text-paper">Conseils</Link>
          </nav>

          <div className="flex items-center gap-4 text-paper">
            <button aria-label="Rechercher" className="hidden transition-opacity hover:opacity-70 md:block"><Search size={20} strokeWidth={1.5} /></button>
            {isAdmin && (
              <Link href="/admin" aria-label="Administration" title="Administration" className="hidden items-center gap-1.5 text-xs font-semibold text-charge transition-opacity hover:opacity-70 lg:flex">
                <ShieldCheck size={18} strokeWidth={1.7} /> Admin
              </Link>
            )}
            <Link href="/compte" aria-label={user ? `Compte de ${user.name || user.email}` : "Compte"} className="transition-opacity hover:opacity-70">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button aria-label="Ouvrir le panier" onClick={toggleCart} className="relative transition-opacity hover:opacity-70">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && <span ref={badgeRef} className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-charge text-[10px] font-semibold text-paper">{count}</span>}
            </button>
            <button aria-label="Ouvrir le menu" onClick={() => setMenuOpen(true)} className="md:hidden"><Menu size={22} strokeWidth={1.5} /></button>
          </div>
        </div>
      </header>
      <AnimatedMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
