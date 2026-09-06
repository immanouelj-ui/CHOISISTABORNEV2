import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: true, follow: true },
  alternates: { canonical: "/mentions-legales" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "Mentions légales" }];

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <h1 className="font-display text-display-3 font-light text-paper">Mentions légales</h1>
        <div className="mt-10 space-y-6 text-paper/75">
          <p>
            Le présent site est édité par CHOISISTABORNE. Les informations légales de l&apos;entreprise (dénomination
            sociale, forme juridique, siège social, capital social, numéro SIRET, numéro de TVA intracommunautaire,
            responsable de publication) seront précisées ici dès leur communication par la société éditrice.
          </p>
          <p>
            Hébergement : les coordonnées de l&apos;hébergeur du site seront indiquées à cet emplacement.
          </p>
          <p>
            Directeur de la publication : à compléter par l&apos;entreprise.
          </p>
          <p>
            Cette page doit être validée et complétée par CHOISISTABORNE ou un professionnel du droit avant mise en
            production, conformément aux obligations légales applicables aux sites de commerce électronique en
            France (LCEN).
          </p>
        </div>
      </div>
    </div>
  );
}
