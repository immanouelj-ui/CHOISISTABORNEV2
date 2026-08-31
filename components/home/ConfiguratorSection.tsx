"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { clsx } from "clsx";

const QUESTIONS = [
  {
    key: "car",
    label: "Pour quelle voiture ?",
    options: ["Citadine", "Berline / SUV", "Utilitaire"],
  },
  {
    key: "usage",
    label: "Pour quelle utilisation ?",
    options: ["Usage quotidien", "Copropriété", "Flotte professionnelle"],
  },
  {
    key: "power",
    label: "Quelle puissance ?",
    options: ["7,4 kW", "11 kW", "22 kW"],
  },
] as const;

const IMAGE_BY_POWER: Record<string, string> = {
  "7,4 kW": "/images/misc/configurator-3.webp",
  "11 kW": "/images/misc/configurator-2.webp",
  "22 kW": "/images/misc/configurator-1.webp",
};

export default function ConfiguratorSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const currentImage = IMAGE_BY_POWER[answers.power] ?? "/images/misc/configurator-1.webp";

  const select = (key: string, value: string) => {
    if (answers[key] === value) return;
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (key === "power" && imgWrapRef.current) {
      const img = imgWrapRef.current.querySelector("[data-config-img]");
      if (img) {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        );
      }
    }
  };

  return (
    <section className="bg-ink-soft px-6 py-28 md:px-12">
      <div className="mx-auto max-w-content">
        <h2 className="mb-14 max-w-xl font-display text-display-2 font-light text-paper">
          Quelle borne est faite pour vous ?
        </h2>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div ref={imgWrapRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-ink">
            <Image
              key={currentImage}
              data-config-img
              src={currentImage}
              alt="Borne correspondant à votre sélection"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-10">
            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <p className="mb-4 text-sm text-fog">{q.label}</p>
                <div className="flex flex-wrap gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => select(q.key, opt)}
                      className={clsx(
                        "rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
                        answers[q.key] === opt
                          ? "border-charge bg-charge text-paper"
                          : "border-line text-paper/80 hover:border-paper",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
