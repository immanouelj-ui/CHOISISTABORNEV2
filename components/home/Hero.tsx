"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGsapContext } from "@/components/animations/useGsapContext";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.set("[data-hero-bg]", { opacity: 0, scale: 1.15 })
      .set("[data-hero-line]", { yPercent: 110 })
      .set(["[data-hero-sub]", "[data-hero-cta]"], { y: 20, opacity: 0 })
      .to("[data-hero-bg]", { opacity: 1, duration: reduced ? 0.01 : 1.1 }, 0.15)
      .to("[data-hero-bg]", { scale: 1, duration: reduced ? 0.01 : 3.2, ease: "power2.out" }, 0.15)
      .to("[data-hero-line]", { yPercent: 0, duration: reduced ? 0.01 : 0.9, stagger: 0.08 }, 0.5)
      .to("[data-hero-sub]", { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.7 }, "-=0.4")
      .to("[data-hero-cta]", { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.7 }, "-=0.5");
  }, []);

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink">
      <div data-hero-bg className="absolute inset-0">
        <Image
          src="/images/hero/hero-main.webp"
          alt="Voiture électrique en recharge devant une maison contemporaine"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
      </div>

      <div className="container-content relative z-10 w-full pb-16 md:pb-24">
        <h1 className="font-display text-display-1 font-light text-paper">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">CHOISIS</span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block font-extrabold">TA BORNE.</span>
          </span>
        </h1>

        <p data-hero-sub className="mt-6 max-w-md text-lg text-paper/75">
          Choisissez la borne qui vous correspond.
        </p>

        <div data-hero-cta className="mt-10 flex items-center gap-6">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 rounded-full bg-paper px-8 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-charge hover:text-paper"
          >
            Découvrir les bornes
          </Link>
          <Link href="/simulateur" className="text-sm text-paper/70 underline-offset-4 hover:text-paper hover:underline">
            Trouver la mienne
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden items-center gap-2 text-xs text-paper/50 md:flex">
        <ArrowDown size={14} className="animate-bounce" />
        <span>Faites défiler</span>
      </div>
    </section>
  );
}
