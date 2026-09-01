import type { Metadata } from "next";
import AccountForm from "./AccountForm";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default function ComptePage() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto flex max-w-content flex-col items-center">
        <div className="mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-fog">CHOISISTABORNE</p>
          <h1 className="font-display text-display-3 font-light">Votre espace client</h1>
          <p className="mt-4 text-paper/60">
            Créez votre compte pour retrouver votre panier et faciliter vos prochaines commandes.
          </p>
        </div>
        <AccountForm />
      </div>
    </div>
  );
}
