import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Gestion des cookies",
  alternates: { canonical: "/cookies" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "Cookies" }];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <h1 className="font-display text-display-3 font-light text-paper">Politique de cookies</h1>
        <div className="mt-10 space-y-6 text-paper/75">
          <p>
            CHOISISTABORNE utilise des cookies strictement nécessaires au fonctionnement du site (panier, session de
            connexion) ainsi que, sous réserve de votre consentement, des cookies de mesure d&apos;audience et de
            suivi des conversions permettant d&apos;analyser l&apos;utilisation du site.
          </p>
          <p>
            Vous pouvez à tout moment modifier vos préférences via le bandeau de consentement affiché lors de votre
            première visite, ou en supprimant les cookies depuis les paramètres de votre navigateur.
          </p>
          <p>
            Cette page doit être complétée avec la liste précise des cookies déposés (nom, finalité, durée de
            conservation, éditeur) une fois les outils de mesure d&apos;audience effectivement configurés.
          </p>
        </div>
      </div>
    </div>
  );
}
