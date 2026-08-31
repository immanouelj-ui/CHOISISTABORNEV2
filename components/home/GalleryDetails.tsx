"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { src: "/images/gallery/detail-screen.webp", alt: "Écran tactile de la borne", label: "Écran", span: "md:col-span-3 md:row-span-2", x: -40, rotate: -2 },
  { src: "/images/gallery/detail-connector.webp", alt: "Connecteur Type 2", label: "Connecteur", span: "md:col-span-2", x: 30, rotate: 2 },
  { src: "/images/gallery/detail-led.webp", alt: "Bandeau LED de statut", label: "LED de statut", span: "md:col-span-2", x: -20, rotate: 1.5 },
  { src: "/images/gallery/detail-texture.webp", alt: "Texture du boîtier", label: "Texture", span: "md:col-span-3", x: 40, rotate: -1.5 },
  { src: "/images/gallery/detail-install.webp", alt: "Borne installée sur une maison", label: "Installation", span: "md:col-span-5 md:row-span-2", x: 0, rotate: 0 },
];

export default function GalleryDetails() {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-item]");
    cards.forEach((card) => {
      const x = Number(card.dataset.x ?? 0);
      const rotate = Number(card.dataset.rotate ?? 0);
      gsap.fromTo(
        card,
        { opacity: reduced ? 1 : 0, x: reduced ? 0 : x, rotate: reduced ? 0 : rotate, filter: reduced ? "blur(0px)" : "blur(8px)" },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        },
      );
    });
  }, []);

  return (
    <section ref={ref} className="bg-ink px-6 py-28 md:px-12">
      <div className="mx-auto max-w-content">
        <h2 className="mb-14 max-w-xl font-display text-display-2 font-light text-paper">
          Chaque détail compte.
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
          {ITEMS.map((item) => (
            <div
              key={item.src}
              data-gallery-item
              data-x={item.x}
              data-rotate={item.rotate}
              className={`relative aspect-square overflow-hidden rounded-2xl bg-ink-raised ${item.span}`}
            >
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 30vw, 45vw" className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <p className="text-sm text-paper/85">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
