"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import { uploadFilesToUploadcare } from "@/lib/uploadcare";

const MAX_PHOTOS = 8;

const HOUSING_TYPES = ["Maison", "Appartement", "Copropriété", "Entreprise", "Parking professionnel"];
const POWERS = ["3,7 kW", "7,4 kW", "11 kW", "22 kW", "Je ne sais pas"];
const PROPERTY_STATUSES = ["Propriétaire", "Locataire"];
const METER_TYPES = ["Monophasé", "Triphasé", "Je ne sais pas"];
const METER_DISTANCES = ["Moins de 5 m", "5 à 10 m", "10 à 20 m", "Plus de 20 m", "Je ne sais pas"];
const TIMELINES = ["Urgent (sous 2 semaines)", "Dans le mois", "Dans les 3 mois", "Pas pressé"];

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const PHONE_REGEX = /^[0-9+()\s.-]{6,20}$/;

const inputClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge";
const labelClass = "mb-2 block text-sm text-paper/70";

type FormState = {
  housingType: string;
  propertyStatus: string;
  powerWanted: string;
  meterType: string;
  meterDistance: string;
  timeline: string;
  hasElectricVehicle: boolean | null;
  hasBornAlready: boolean;
  vehicleBrand: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  comment: string;
};

function OptionButtons({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={`w-full rounded-2xl border px-6 py-4 text-left transition-colors duration-300 ${
            value === opt ? "border-charge bg-charge/10 text-paper" : "border-line text-paper/85 hover:border-charge hover:text-paper"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

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
  const [state, setState] = useState<FormState>({
    housingType: "",
    propertyStatus: "",
    powerWanted: "",
    meterType: "",
    meterDistance: "",
    timeline: "",
    hasElectricVehicle: null,
    hasBornAlready: Boolean(productId),
    vehicleBrand: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    comment: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  const STEP_IDS = [
    "housingType",
    "propertyStatus",
    "powerWanted",
    "meterType",
    "meterDistance",
    "timeline",
    "hasElectricVehicle",
    ...(productId ? [] : ["hasBornAlready"]),
    "vehicleBrand",
    "contact",
    "address",
    "photos",
    "comment",
  ] as const;

  function handlePhotos(files: FileList | null) {
    if (!files || !files.length) return;
    setPhotos((prev) => [...prev, ...Array.from(files)].slice(0, MAX_PHOTOS));
  }

  function animateTo(next: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(panelRef.current, {
      opacity: 0,
      x: reduced ? 0 : -24,
      duration: reduced ? 0.01 : 0.25,
      ease: "power2.in",
      onComplete: () => {
        setStepIndex(next);
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, x: reduced ? 0 : 24 },
          { opacity: 1, x: 0, duration: reduced ? 0.01 : 0.35, ease: "power2.out" },
        );
      },
    });
  }

  function goNext() {
    if (stepIndex < STEP_IDS.length - 1) {
      animateTo(stepIndex + 1);
    } else {
      void submit();
    }
  }

  function goBack() {
    if (stepIndex > 0) animateTo(stepIndex - 1);
  }

  function selectAndAdvance<K extends keyof FormState>(key: K, value: FormState[K]) {
    set(key, value);
    goNext();
  }

  async function submit() {
    setError("");
    setSubmitting(true);

    setUploadingPhotos(photos.length > 0);
    const photoUrls = photos.length ? await uploadFilesToUploadcare(photos) : [];
    setUploadingPhotos(false);

    const payload = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      address: state.address,
      postalCode: state.postalCode,
      city: state.city,
      housingType: state.housingType,
      vehicleBrand: state.vehicleBrand,
      powerWanted: state.powerWanted,
      hasBornAlready: state.hasBornAlready,
      propertyStatus: state.propertyStatus,
      meterType: state.meterType,
      meterDistance: state.meterDistance,
      timeline: state.timeline,
      hasElectricVehicle: state.hasElectricVehicle,
      photos: photoUrls,
      comment: state.comment,
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
      setSubmitting(false);
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

  const contactValid =
    state.firstName.trim() &&
    state.lastName.trim() &&
    EMAIL_REGEX.test(state.email) &&
    PHONE_REGEX.test(state.phone.trim());

  const currentId = STEP_IDS[stepIndex];

  function renderStep() {
    switch (currentId) {
      case "housingType":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quel type de logement ?</h3>
            <OptionButtons options={HOUSING_TYPES} value={state.housingType} onSelect={(v) => selectAndAdvance("housingType", v)} />
          </>
        );
      case "propertyStatus":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quel est le statut du bien ?</h3>
            <OptionButtons options={PROPERTY_STATUSES} value={state.propertyStatus} onSelect={(v) => selectAndAdvance("propertyStatus", v)} />
          </>
        );
      case "powerWanted":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quelle puissance souhaitez-vous ?</h3>
            <OptionButtons options={POWERS} value={state.powerWanted} onSelect={(v) => selectAndAdvance("powerWanted", v)} />
          </>
        );
      case "meterType":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quel type de compteur électrique avez-vous ?</h3>
            <OptionButtons options={METER_TYPES} value={state.meterType} onSelect={(v) => selectAndAdvance("meterType", v)} />
          </>
        );
      case "meterDistance":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">
              Distance entre le compteur et l&apos;emplacement de la borne ?
            </h3>
            <OptionButtons options={METER_DISTANCES} value={state.meterDistance} onSelect={(v) => selectAndAdvance("meterDistance", v)} />
          </>
        );
      case "timeline":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quel est votre délai souhaité ?</h3>
            <OptionButtons options={TIMELINES} value={state.timeline} onSelect={(v) => selectAndAdvance("timeline", v)} />
          </>
        );
      case "hasElectricVehicle":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">
              Possédez-vous déjà un véhicule électrique ?
            </h3>
            <OptionButtons
              options={["Oui", "Non"]}
              value={state.hasElectricVehicle === null ? "" : state.hasElectricVehicle ? "Oui" : "Non"}
              onSelect={(v) => selectAndAdvance("hasElectricVehicle", v === "Oui")}
            />
          </>
        );
      case "hasBornAlready":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Avez-vous déjà votre borne de recharge ?</h3>
            <OptionButtons
              options={["Oui, je l'ai déjà", "Non, j'ai besoin d'en acheter une"]}
              value={state.hasBornAlready ? "Oui, je l'ai déjà" : ""}
              onSelect={(v) => selectAndAdvance("hasBornAlready", v.startsWith("Oui"))}
            />
          </>
        );
      case "vehicleBrand":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Quelle est la marque de votre véhicule ?</h3>
            <input
              autoFocus
              value={state.vehicleBrand}
              onChange={(e) => set("vehicleBrand", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goNext()}
              className={inputClass}
              placeholder="Tesla, Renault, Peugeot…"
            />
            <div className="mt-6 flex gap-4">
              <Button type="button" onClick={goNext} size="lg">Continuer</Button>
              <button type="button" onClick={goNext} className="text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline">
                Passer
              </button>
            </div>
          </>
        );
      case "contact":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Vos coordonnées</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Prénom</span>
                <input
                  autoFocus
                  value={state.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  autoComplete="given-name"
                  className={inputClass}
                  placeholder="Prénom"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Nom</span>
                <input
                  value={state.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  autoComplete="family-name"
                  className={inputClass}
                  placeholder="Nom"
                />
              </label>
              <label className="block">
                <span className={labelClass}>E-mail</span>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                  placeholder="vous@exemple.fr"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Téléphone</span>
                <input
                  type="tel"
                  value={state.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && contactValid && goNext()}
                  autoComplete="tel"
                  className={inputClass}
                  placeholder="06 00 00 00 00"
                />
              </label>
            </div>
            <Button type="button" onClick={goNext} disabled={!contactValid} className="mt-6 w-full" size="lg">
              Continuer
            </Button>
          </>
        );
      case "address":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Où se trouve votre logement ?</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Adresse</span>
                <input
                  autoFocus
                  value={state.address}
                  onChange={(e) => set("address", e.target.value)}
                  autoComplete="street-address"
                  className={inputClass}
                  placeholder="Numéro et rue"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Code postal</span>
                <input
                  value={state.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  autoComplete="postal-code"
                  className={inputClass}
                  placeholder="69000"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>Ville</span>
                <input
                  value={state.city}
                  onChange={(e) => set("city", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goNext()}
                  autoComplete="address-level2"
                  className={inputClass}
                  placeholder="Lyon"
                />
              </label>
            </div>
            <div className="mt-6 flex gap-4">
              <Button type="button" onClick={goNext} size="lg">Continuer</Button>
              <button type="button" onClick={goNext} className="text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline">
                Passer
              </button>
            </div>
          </>
        );
      case "photos":
        return (
          <>
            <h3 className="mb-3 font-display text-display-3 font-light text-paper">
              Photos de votre tableau électrique
            </h3>
            <p className="mb-6 text-sm text-paper/60">
              Plus vos photos sont précises, plus le devis sera juste (optionnel, jusqu&apos;à {MAX_PHOTOS}).
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotos(e.target.files)}
              className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-charge file:px-3 file:py-2 file:text-ink`}
            />
            {photos.length > 0 && (
              <p className="mt-3 text-sm text-paper/70">
                {photos.length} photo{photos.length > 1 ? "s" : ""} ajoutée{photos.length > 1 ? "s" : ""}
              </p>
            )}
            <div className="mt-6 flex gap-4">
              <Button type="button" onClick={goNext} size="lg">Continuer</Button>
              {photos.length === 0 && (
                <button type="button" onClick={goNext} className="text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline">
                  Passer
                </button>
              )}
            </div>
          </>
        );
      case "comment":
        return (
          <>
            <h3 className="mb-8 font-display text-display-3 font-light text-paper">Un commentaire sur votre projet ?</h3>
            <textarea
              autoFocus
              value={state.comment}
              onChange={(e) => set("comment", e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Précisions sur votre projet… (optionnel)"
            />
            {error && (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>
            )}
            <Button type="button" onClick={goNext} disabled={submitting} className="mt-6 w-full" size="lg">
              {uploadingPhotos ? "Envoi des photos…" : submitting ? "Envoi en cours…" : "Envoyer ma demande"}
            </Button>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className={compact ? "" : "rounded-3xl border border-line bg-ink-soft p-8"}>
      {productName && (
        <p className="mb-6 rounded-xl border border-line bg-ink px-4 py-3 text-sm text-paper/70">
          Borne concernée : <span className="text-paper">{productName}</span>
        </p>
      )}

      <div className="mb-8 flex items-center gap-2">
        {STEP_IDS.map((id, i) => (
          <div key={id} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-charge" : "bg-line"}`} />
        ))}
      </div>

      <div ref={panelRef}>{renderStep()}</div>

      {stepIndex > 0 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-6 text-sm text-paper/50 underline-offset-4 hover:text-paper hover:underline"
        >
          ← Retour
        </button>
      )}

      <p className="mt-6 text-center text-xs text-fog">
        Vos informations sont utilisées uniquement pour traiter votre demande d&apos;installation.
      </p>
    </div>
  );
}
