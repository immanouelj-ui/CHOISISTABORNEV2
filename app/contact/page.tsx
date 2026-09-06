import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur nos bornes de recharge ou sur l'installation ? Contactez l'équipe CHOISISTABORNE.",
  alternates: { canonical: "/contact" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "Contact" }];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Contact</p>
          <h1 className="font-display text-display-2 font-light text-paper">Une question ? Parlons-en.</h1>
          <p className="mt-6 max-w-md text-paper/70">
            Notre équipe vous répond pour toute question sur nos bornes, une commande en cours ou votre projet
            d&apos;installation.
          </p>
          <p className="mt-10 text-sm text-fog">
            Les coordonnées de l&apos;entreprise (adresse, téléphone, SIRET) seront affichées ici dès leur
            communication par CHOISISTABORNE.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
