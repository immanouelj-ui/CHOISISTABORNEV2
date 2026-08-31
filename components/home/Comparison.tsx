"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";
import type { ProductDTO } from "@/lib/types";
import { connectivityLabel, phaseLabel } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function Comparison({ a, b }: { a: ProductDTO; b: ProductDTO }) {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    gsap.fromTo(
      "[data-compare-card]",
      { opacity: reduced ? 1 : 0, y: reduced ? 0 : 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      },
    );
    gsap.fromTo(
      "[data-compare-row]",
      { opacity: reduced ? 1 : 0, x: reduced ? 0 : -16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      },
    );
  }, []);

  const rows = (p: ProductDTO) => [
    `${p.powerKw} kW`,
    phaseLabel[p.phase] ?? p.phase,
    connectivityLabel[p.connectivity] ?? p.connectivity,
  ];

  return (
    <section id="comparateur" ref={ref} className="bg-ink px-6 py-28 md:px-12">
      <div className="mx-auto max-w-content">
        <h2 className="mb-14 max-w-xl font-display text-display-2 font-light text-paper">
          Comparez avant de choisir.
        </h2>
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {[a, b].map((p, i) => (
            <div key={p.id} data-compare-card className={i === 1 ? "md:order-3" : ""}>
              <p className="text-xs uppercase tracking-wide text-fog">{p.brand.name}</p>
              <h3 className="mb-6 font-display text-2xl text-paper">{p.name}</h3>
              <ul className="space-y-3">
                {rows(p).map((row) => (
                  <li
                    key={row}
                    data-compare-row
                    className="rounded-xl border border-line px-4 py-3 text-sm text-paper/85"
                  >
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="hidden justify-self-center font-display text-sm text-fog md:block md:order-2">vs</div>
        </div>
      </div>
    </section>
  );
}
