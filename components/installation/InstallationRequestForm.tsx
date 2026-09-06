"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const HOUSING_TYPES = ["Maison", "Appartement", "Copropriété", "Entreprise", "Parking professionnel"];
const POWERS = ["3,7 kW", "7,4 kW", "11 kW", "22 kW", "Je ne sais pas"];

const inputClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge";
const labelClass = "mb-2 block text-sm text-paper/70";

export default function InstallationRequestForm({
  productId,
  productName,
  source = "SITE",
  compact = false,
}: {
  productId?: string;
  productName?: string;
  source?: string;
  compact?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [housingType, setHousingType] = useState("");
  const [powerWanted, setPowerWanted] = useState("");
  const [hasBornAlready, setHasBornAlready] = useState(Boolean(productId));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      postalCode: form.get("postalCode"),
      city: form.get("city"),
      housingType,
      vehicleBrand: form.get("vehicleBrand"),
      powerWanted,
      hasBornAlready,
      comment: form.get("comment"),
      productId,
      productName,
      source,
    };

    try {
      const response = await fetch("/api/installation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez dans quelques instants.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-charge/30 bg-charge/10 p-8 text-center">
        <p className="font-display text-xl text-paper">Votre demande a bien été reçue.</p>
        <p className="mt-3 text-paper/70">
          Un membre de notre équipe vous recontacte sous 48h ouvrées pour préparer votre devis d&apos;installation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`space-y-5 ${compact ? "" : "rounded-3xl border border-line bg-ink-soft p-8"}`}>
      {productName && (
        <p className="rounded-xl border border-line bg-ink px-4 py-3 text-sm text-paper/70">
          Borne concernée : <span className="text-paper">{productName}</span>
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Prénom</span>
          <input name="firstName" required autoComplete="given-name" className={inputClass} placeholder="Prénom" />
        </label>
        <label className="block">
          <span className={labelClass}>Nom</span>
          <input name="lastName" required autoComplete="family-name" className={inputClass} placeholder="Nom" />
        </label>
        <label className="block">
          <span className={labelClass}>E-mail</span>
          <input type="email" name="email" required autoComplete="email" className={inputClass} placeholder="vous@exemple.fr" />
        </label>
        <label className="block">
          <span className={labelClass}>Téléphone</span>
          <input type="tel" name="phone" required autoComplete="tel" className={inputClass} placeholder="06 00 00 00 00" />
        </label>
        <label className="block">
          <span className={labelClass}>Adresse</span>
          <input name="address" autoComplete="street-address" className={inputClass} placeholder="Numéro et rue" />
        </label>
        <label className="block">
          <span className={labelClass}>Code postal</span>
          <input name="postalCode" autoComplete="postal-code" className={inputClass} placeholder="69000" />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Ville</span>
          <input name="city" autoComplete="address-level2" className={inputClass} placeholder="Lyon" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Type de logement</span>
          <select value={housingType} onChange={(e) => setHousingType(e.target.value)} className={inputClass}>
            <option value="">Sélectionner…</option>
            {HOUSING_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Puissance souhaitée</span>
          <select value={powerWanted} onChange={(e) => setPowerWanted(e.target.value)} className={inputClass}>
            <option value="">Sélectionner…</option>
            {POWERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Marque de votre véhicule</span>
          <input name="vehicleBrand" className={inputClass} placeholder="Tesla, Renault, Peugeot…" />
        </label>
      </div>

      {!productId && (
        <label className="flex items-center gap-3 text-sm text-paper/70">
          <input
            type="checkbox"
            checked={hasBornAlready}
            onChange={(e) => setHasBornAlready(e.target.checked)}
            className="h-4 w-4 rounded border-line"
          />
          J&apos;ai déjà ma borne, je cherche uniquement l&apos;installation
        </label>
      )}

      <label className="block">
        <span className={labelClass}>Commentaire (optionnel)</span>
        <textarea name="comment" rows={3} className={inputClass} placeholder="Précisions sur votre projet…" />
      </label>

      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Envoi en cours…" : "Demander mon installation"}
      </Button>
      <p className="text-center text-xs text-fog">
        Vos informations sont utilisées uniquement pour traiter votre demande d&apos;installation.
      </p>
    </form>
  );
}
