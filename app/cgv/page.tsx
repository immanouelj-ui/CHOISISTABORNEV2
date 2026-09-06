import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  alternates: { canonical: "/cgv" },
};

const crumbs = [{ label: "Accueil", href: "/" }, { label: "CGV" }];

const SECTIONS = [
  { title: "Objet", text: "Les présentes conditions générales de vente régissent les ventes de bornes de recharge et accessoires réalisées sur le site CHOISISTABORNE ainsi que la mise en relation avec des installateurs professionnels." },
  { title: "Prix", text: "Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison précisés avant validation de la commande." },
  { title: "Commande et paiement", text: "Le paiement est réalisé en ligne de manière sécurisée via un prestataire de paiement tiers. Aucune donnée bancaire n'est stockée sur les serveurs de CHOISISTABORNE." },
  { title: "Livraison", text: "Les délais de livraison sont indiqués sur chaque fiche produit et confirmés lors de la commande." },
  { title: "Droit de rétractation", text: "Conformément au Code de la consommation, le client dispose d'un délai de rétractation applicable aux achats à distance, dans les conditions et limites prévues par la loi." },
  { title: "Garantie", text: "Les produits vendus bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, ainsi que, le cas échéant, d'une garantie constructeur." },
  { title: "Service d'installation", text: "L'installation, lorsqu'elle est demandée, est réalisée par un professionnel qualifié IRVE indépendant du fait d'un devis distinct de la vente de la borne." },
];

export default function CgvPage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <h1 className="font-display text-display-3 font-light text-paper">Conditions générales de vente</h1>
        <p className="mt-6 text-paper/60">
          Ce document présente la structure des CGV du site. Il doit être relu et validé par CHOISISTABORNE ou un
          professionnel du droit avant mise en production.
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
