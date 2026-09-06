import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "À propos de CHOISISTABORNE",
  description:
    "CHOISISTABORNE accompagne particuliers et professionnels dans le choix et l'installation de leur borne de recharge pour véhicule électrique.",
  alternates: { canonical: "/a-propos" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "À propos" }];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">À propos</p>
        <h1 className="font-display text-display-2 font-light text-paper">
          La mobilité électrique, simplement.
        </h1>

        <div className="mt-10 space-y-6 text-lg text-paper/75">
          <p>
            CHOISISTABORNE est né d&apos;un constat simple : choisir une borne de recharge pour véhicule électrique
            reste souvent complexe, entre les puissances, les connecteurs, les options de connectivité et la question
            de l&apos;installation. Nous avons construit une plateforme pensée pour lever ces obstacles, du premier
            clic jusqu&apos;à la mise en service de votre borne.
          </p>
          <p>
            Notre catalogue rassemble des bornes de marques reconnues, sélectionnées pour leur fiabilité et leur
            compatibilité avec les véhicules électriques et hybrides rechargeables du marché. Chaque fiche produit
            détaille les caractéristiques techniques essentielles pour un choix éclairé, que vous soyez un particulier
            équipant sa maison ou un professionnel équipant un parking d&apos;entreprise.
          </p>
          <p>
            Au-delà de la vente, nous mettons nos clients en relation avec un réseau d&apos;installateurs qualifiés
            IRVE (Infrastructures de Recharge pour Véhicules Électriques), seuls habilités à réaliser une installation
            conforme aux normes électriques en vigueur et à donner accès à certaines aides financières.
          </p>
          <p>
            Notre ambition : rendre l&apos;équipement en borne de recharge aussi simple qu&apos;un achat en ligne, tout
            en garantissant le sérieux et la sécurité d&apos;une installation réalisée par un professionnel.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <ButtonLink href="/produits" size="lg">Découvrir les bornes</ButtonLink>
          <ButtonLink href="/installation" variant="secondary" size="lg">En savoir plus sur l&apos;installation</ButtonLink>
        </div>
      </div>
    </div>
  );
}
