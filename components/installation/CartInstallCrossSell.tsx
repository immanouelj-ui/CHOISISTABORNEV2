"use client";

import { useState } from "react";
import InstallationRequestForm from "./InstallationRequestForm";

export default function CartInstallCrossSell({
  productId,
  productName,
}: {
  productId?: string;
  productName?: string;
}) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="mt-8">
        <InstallationRequestForm productId={productId} productName={productName} source="PANIER" />
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-charge/30 bg-charge/10 p-8">
      <p className="font-display text-lg text-paper">Vous avez votre borne. Et pour l&apos;installation ?</p>
      <p className="mt-2 text-sm text-paper/70">
        Faites poser votre borne par un professionnel qualifié IRVE. Devis gratuit, sans engagement.
      </p>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-charge hover:text-paper"
      >
        Demander un devis d&apos;installation
      </button>
    </div>
  );
}
