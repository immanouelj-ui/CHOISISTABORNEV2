"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "ctb-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value: "accepted" | "refused") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // navigation privée ou stockage bloqué : on masque simplement le bandeau
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl rounded-2xl border border-line bg-ink-soft p-6 shadow-2xl md:inset-x-auto md:right-6"
    >
      <p className="text-sm text-paper/80">
        Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies de mesure
        d&apos;audience. Consultez notre{" "}
        <Link href="/cookies" className="underline underline-offset-4 hover:text-paper">
          politique de cookies
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="md" onClick={() => choose("accepted")}>Accepter</Button>
        <button
          onClick={() => choose("refused")}
          className="rounded-full border border-line px-6 py-3 text-sm text-paper/80 transition hover:text-paper"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
