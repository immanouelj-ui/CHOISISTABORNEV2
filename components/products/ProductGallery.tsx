"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";
import type { ProductDTO } from "@/lib/types";
import { connectivityLabel, installationLabel, phaseLabel } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProductGallery({ product }: { product: ProductDTO }) {
  const detail = product.images.find((i) => i.kind === "detail");
  const closeup = product.images.find((i) => i.kind === "closeup");
  const installation = product.images.find((i) => i.kind === "installation");

  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    gsap.utils.toArray<HTMLElement>("[data-pg-panel]").forEach((panel) => {
      gsap.fromTo(
        panel.querySelector("[data-pg-img]"),
        { scale: reduced ? 1 : 1.15, opacity: reduced ? 1 : 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 80%" },
        },
      );
      gsap.fromTo(
        panel.querySelector("[data-pg-text]"),
        { y: reduced ? 0 : 24, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 75%" },
        },
      );
    });
  }, [product.id]);

  const specs = [
    { label: "Puissance", value: `${product.powerKw} kW` },
    { label: "Phase", value: phaseLabel[product.phase] ?? product.phase },
    { label: "Connectivité", value: connectivityLabel[product.connectivity] ?? product.connectivity },
    { label: "Installation", value: installationLabel[product.installation] ?? product.installation },
  ];

  return (
    <div ref={ref}>
      {detail && (
        <section data-pg-panel className="grid gap-8 bg-ink px-6 py-24 md:grid-cols-2 md:items-center md:px-12">
          <div data-pg-img className="relative aspect-square overflow-hidden rounded-3xl">
            <Image src={detail.url} alt={detail.alt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
          <div data-pg-text>
            <p className="mb-3 text-sm text-fog">Design</p>
            <h2 className="mb-4 font-display text-display-3 font-light text-paper">
              Un objet pensé pour votre intérieur.
            </h2>
            <p className="max-w-md text-paper/70">{product.description}</p>
          </div>
        </section>
      )}

      {closeup && (
        <section data-pg-panel className="relative h-[90vh] w-full overflow-hidden bg-ink">
          <div data-pg-img className="absolute inset-0">
            <Image src={closeup.url} alt={closeup.alt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          </div>
          <div data-pg-text className="container-content relative z-10 flex h-full items-end pb-16">
            <p className="max-w-md font-display text-display-3 text-paper">Le détail qui change tout.</p>
          </div>
        </section>
      )}

      <section data-pg-panel className="bg-ink-soft px-6 py-24 md:px-12">
        <div data-pg-text className="mx-auto max-w-content">
          <p className="mb-3 text-sm text-fog">Caractéristiques</p>
          <h2 className="mb-10 font-display text-display-3 font-light text-paper">Détails techniques</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line px-5 py-6">
                <p className="text-xs uppercase tracking-wide text-fog">{s.label}</p>
                <p className="mt-2 text-lg text-paper">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {installation && (
        <section data-pg-panel className="grid gap-8 bg-ink px-6 py-24 md:grid-cols-2 md:items-center md:px-12">
          <div data-pg-text className="order-2 md:order-1">
            <p className="mb-3 text-sm text-fog">Installation</p>
            <h2 className="mb-4 font-display text-display-3 font-light text-paper">
              Posée par des professionnels certifiés.
            </h2>
            <p className="max-w-md text-paper/70">
              Nos installateurs partenaires interviennent partout en France et s&apos;occupent de la mise
              en conformité complète de votre installation électrique.
            </p>
          </div>
          <div data-pg-img className="order-1 relative aspect-[4/3] overflow-hidden rounded-3xl md:order-2">
            <Image src={installation.url} alt={installation.alt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
        </section>
      )}
    </div>
  );
}
