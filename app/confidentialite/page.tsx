import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "Confidentialité" }];

const SECTIONS = [
  { title: "Données collectées", text: "CHOISISTABORNE collecte les données nécessaires à la gestion des commandes (identité, coordonnées, adresse), à la création d'un compte client et au traitement des demandes d'installation (véhicule, logement, adresse d'intervention)." },
  { title: "Finalités", text: "Ces données sont utilisées pour traiter vos commandes, assurer le suivi de vos demandes d'installation, vous contacter et améliorer nos services. Elles ne sont jamais vendues à des tiers." },
  { title: "Base légale", text: "Le traitement repose sur l'exécution du contrat de vente, votre consentement pour les communications commerciales, et l'intérêt légitime de CHOISISTABORNE pour l'amélioration de ses services." },
  { title: "Durée de conservation", text: "Les données sont conservées pendant la durée nécessaire aux finalités poursuivies et dans le respect des obligations légales et comptables." },
  { title: "Vos droits", text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données, ainsi que d'un droit d'opposition. Vous pouvez exercer ces droits via la page Contact." },
  { title: "Sous-traitants", text: "Certaines opérations (paiement, hébergement, envoi d'emails) sont confiées à des prestataires tiers soumis à des obligations contractuelles de confidentialité et de sécurité." },
];

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <h1 className="font-display text-display-3 font-light text-paper">Politique de confidentialité</h1>
        <p className="mt-6 text-paper/60">
          Cette page présente la structure générale de notre politique de confidentialité. Elle doit être complétée
          et validée par CHOISISTABORNE ou un professionnel du droit avant mise en production.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((section, index) => (
            <div key={section.title}>
              <h2 className="mb-2 font-display text-lg text-paper">{index + 1}. {section.title}</h2>
              <p className="text-paper/75">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
