"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { clsx } from "clsx";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";

type Answers = {
  car: string;
  kmPerDay: string;
  location: string;
  power: string;
  connected: string;
};

const STEPS: { key: keyof Answers; title: string; options: string[] }[] = [
  { key: "car", title: "Quelle voiture conduisez-vous ?", options: ["Citadine électrique", "Berline / SUV électrique", "Hybride rechargeable"] },
  { key: "kmPerDay", title: "Combien de kilomètres par jour ?", options: ["Moins de 30 km", "30 à 80 km", "Plus de 80 km"] },
  { key: "location", title: "Où installez-vous votre borne ?", options: ["Garage intérieur", "Extérieur / façade", "Copropriété"] },
  { key: "power", title: "Quelle puissance souhaitez-vous ?", options: ["7,4 kW", "11 kW", "22 kW"] },
  { key: "connected", title: "Souhaitez-vous une borne connectée ?", options: ["Oui, avec application", "Peu importe", "Non, le plus simple possible"] },
];

function recommend(answers: Answers, products: ProductDTO[]): ProductDTO | null {
  const powerTarget = parseFloat(answers.power.replace(",", "."));
  const wantsConnected = answers.connected === "Oui, avec application";

  const scored = products.map((p) => {
    let score = 0;
    score -= Math.abs(p.powerKw - powerTarget);
    if (wantsConnected && p.connectivity !== "none") score += 2;
    if (!wantsConnected && p.connectivity === "none") score += 1;
    if (answers.location === "Copropriété" && p.category.slug === "copropriete") score += 2;
    if (answers.location === "Extérieur / façade" && p.installation !== "interieur") score += 1;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.p ?? null;
}

export default function Simulator({ products }: { products: ProductDTO[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const animateOut = (onComplete: () => void) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(panelRef.current, {
      opacity: 0,
      x: reduced ? 0 : -30,
      duration: reduced ? 0.01 : 0.35,
      ease: "power2.in",
      onComplete: () => {
        onComplete();
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, x: reduced ? 0 : 30 },
          { opacity: 1, x: 0, duration: reduced ? 0.01 : 0.45, ease: "power2.out" },
        );
      },
    });
  };

  const selectOption = (key: keyof Answers, value: string) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    animateOut(() => {
      if (stepIndex < STEPS.length - 1) {
        setStepIndex((i) => i + 1);
      } else {
        setDone(true);
      }
    });
  };

  const recommendation = done ? recommend(nextAnswersWithDefaults(answers), products) : null;

  if (done) {
    return (
      <div ref={resultRef} className="mx-auto max-w-2xl text-center">
        <RevealResult product={recommendation} />
      </div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={clsx("h-1 flex-1 rounded-full", i <= stepIndex ? "bg-charge" : "bg-line")}
          />
        ))}
      </div>
      <div ref={panelRef}>
        <h2 className="mb-8 font-display text-display-3 font-light text-paper">{step.title}</h2>
        <div className="space-y-3">
          {step.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectOption(step.key, opt)}
              className="w-full rounded-2xl border border-line px-6 py-4 text-left text-paper/85 transition-colors duration-300 hover:border-charge hover:text-paper"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function nextAnswersWithDefaults(a: Partial<Answers>): Answers {
  return {
    car: a.car ?? "Berline / SUV électrique",
    kmPerDay: a.kmPerDay ?? "30 à 80 km",
    location: a.location ?? "Garage intérieur",
    power: a.power ?? "11 kW",
    connected: a.connected ?? "Peu importe",
  };
}

function RevealResult({ product }: { product: ProductDTO | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: reduced ? 0.01 : 0.9, ease: "power3.out" },
    );
  }, []);

  if (!product) {
    return <p className="text-paper/70">Aucune recommandation disponible pour le moment.</p>;
  }

  const main = product.images.find((i) => i.kind === "main") ?? product.images[0];

  return (
    <div ref={ref}>
      <p className="mb-3 text-sm uppercase tracking-wide text-fog">Notre recommandation</p>
      {main && (
        <div className="relative mx-auto mb-8 aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl">
          <Image src={main.url} alt={main.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
        </div>
      )}
      <h2 className="mb-2 font-display text-display-3 font-light text-paper">{product.name}</h2>
      <p className="mb-6 text-paper/70">{product.tagline}</p>
      <p className="mb-8 font-display text-2xl text-paper">{formatPrice(product.price)}</p>
      <div className="flex justify-center gap-4">
        <ButtonLink href={`/produits/${product.slug}`}>Voir la fiche</ButtonLink>
        <Link href="/produits" className="text-sm text-paper/70 underline-offset-4 hover:text-paper hover:underline">
          Comparer d&apos;autres bornes
        </Link>
      </div>
    </div>
  );
}
