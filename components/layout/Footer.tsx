"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Produits", href: "/produits" },
      { label: "Simulateur", href: "/simulateur" },
      { label: "Comparateur", href: "/#comparateur" },
    ],
  },
  {
    title: "Accompagnement",
    links: [
      { label: "Installation", href: "/#installation" },
      { label: "Conseils", href: "/#conseils" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGV", href: "/#cgv" },
      { label: "Confidentialité", href: "/#confidentialite" },
    ],
  },
];

export default function Footer() {
  const ref = useGsapContext<HTMLElement>(({ reduced }) => {
    gsap.fromTo(
      "[data-footer-reveal]",
      { y: reduced ? 0 : 60, opacity: reduced ? 1 : 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      },
    );
  }, []);

  return (
    <footer ref={ref} className="border-t border-line bg-ink px-6 pt-20 pb-10 md:px-12">
      <div className="mx-auto max-w-content">
        <p data-footer-reveal className="mb-10 max-w-xl text-lg text-paper/80">
          Votre prochaine recharge commence ici.
        </p>

        <div data-footer-reveal className="mb-16">
          <h2 className="font-display text-[13vw] leading-[0.85] tracking-tight text-paper md:text-[9rem]">
            choisis<span className="text-fog">ta</span>
            <span className="font-extrabold">borne</span>
          </h2>
        </div>

        <div data-footer-reveal className="grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm text-fog">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-paper/80 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-sm text-fog">Suivez-nous</h3>
            <ul className="space-y-3 text-sm text-paper/80">
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>

        <div
          data-footer-reveal
          className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-fog md:flex-row md:items-center md:justify-between"
        >
          <p>© {new Date().getFullYear()} CHOISISTABORNE. Tous droits réservés.</p>
          <p>Conçu pour la mobilité électrique.</p>
        </div>
      </div>
    </footer>
  );
}
