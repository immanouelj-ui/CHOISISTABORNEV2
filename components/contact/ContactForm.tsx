"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge";
const labelClass = "mb-2 block text-sm text-paper/70";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-charge/30 bg-charge/10 p-8 text-center">
        <p className="font-display text-xl text-paper">Message envoyé.</p>
        <p className="mt-3 text-paper/70">Nous vous répondons dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-line bg-ink-soft p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Prénom</span>
          <input name="firstName" required autoComplete="given-name" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Nom</span>
          <input name="lastName" required autoComplete="family-name" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>E-mail</span>
          <input type="email" name="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Téléphone</span>
          <input type="tel" name="phone" autoComplete="tel" className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Sujet</span>
        <input name="subject" className={inputClass} placeholder="Commande, produit, installation…" />
      </label>
      <label className="block">
        <span className={labelClass}>Message</span>
        <textarea name="message" rows={5} required className={inputClass} />
      </label>
      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Envoi en cours…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
