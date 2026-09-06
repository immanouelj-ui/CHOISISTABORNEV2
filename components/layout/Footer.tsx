"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    title: "Acheter",
    links: [
      { label: "Toutes les bornes", href: "/produits" },
      { label: "Bornes 7,4 kW", href: "/produits?power=7.4" },
      { label: "Bornes 11 kW", href: "/produits?power=11" },
      { label: "Bornes 22 kW", href: "/produits?power=22" },
      { label: "Simulateur", href: "/simulateur" },
    ],
  },
  {
    title: "Installation",
    links: [
      { label: "Installation borne de recharge", href: "/installation" },
      { label: "Demander un devis", href: "/installation#devis" },
      { label: "Zones d'intervention", href: "/installation-borne-recharge" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { label: "Connexion", href: "/compte" },
      { label: "Créer un compte", href: "/compte" },
      { label: "Mes commandes", href: "/compte" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Gestion des cookies", href: "/cookies" },
  { label: "Contact", href: "/contact" },
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
        </div>

        <div
          data-footer-reveal
          className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-fog md:flex-row md:items-center md:justify-between"
        >
          <p>© {new Date().getFullYear()} CHOISISTABORNE. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
