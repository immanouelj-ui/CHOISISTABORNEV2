import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default function ComptePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <h1 className="font-display text-display-3 font-light text-paper">Votre espace client</h1>
      <p className="max-w-sm text-paper/70">
        La connexion et le suivi de commandes arrivent bientôt. En attendant, explorez notre catalogue.
      </p>
      <ButtonLink href="/produits">Voir les bornes</ButtonLink>
    </div>
  );
}
