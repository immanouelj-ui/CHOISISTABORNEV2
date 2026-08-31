"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "7,4 kW", body: "Idéale pour une recharge quotidienne stable, compatible avec toute installation standard.", img: "/images/gallery/pinned-1.webp" },
  { title: "11 kW", body: "Un compromis parfait entre rapidité de charge et simplicité d'installation triphasée.", img: "/images/gallery/pinned-2.webp" },
  { title: "22 kW", body: "La puissance maximale autorisée en résidentiel, pour une pleine charge en quelques heures.", img: "/images/gallery/pinned-3.webp" },
  { title: "Connectée", body: "Suivi de consommation, programmation à distance et mises à jour automatiques.", img: "/images/gallery/pinned-4.webp" },
  { title: "Intelligente", body: "Priorise votre production solaire et s'adapte à votre tarif d'électricité en temps réel.", img: "/images/gallery/pinned-5.webp" },
];

export default function PinnedProduct() {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    if (reduced) return;
    const panels = gsap.utils.toArray<HTMLElement>("[data-pinned-step]");
    const images = gsap.utils.toArray<HTMLElement>("[data-pinned-image]");
    gsap.set(images, { opacity: 0 });
    gsap.set(images[0], { opacity: 1 });

    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top center",
        end: "bottom center",
        onEnter: () => gsap.to(images, { opacity: (idx) => (idx === i ? 1 : 0), duration: 0.5 }),
        onEnterBack: () => gsap.to(images, { opacity: (idx) => (idx === i ? 1 : 0), duration: 0.5 }),
      });
    });
  }, []);

  return (
    <section ref={ref} className="relative bg-ink px-6 md:px-12">
      <div className="mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:py-0">
        <div className="relative order-2 h-[70vh] md:sticky md:top-0 md:order-1 md:flex md:h-screen md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            {STEPS.map((step, i) => (
              <div key={step.title} data-pinned-image className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image src={step.img} alt={step.title} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 space-y-[40vh] py-[20vh] md:order-2">
          {STEPS.map((step) => (
            <div key={step.title} data-pinned-step className="flex min-h-[30vh] flex-col justify-center">
              <p className="mb-4 text-sm text-charge-bright">Puissance &amp; intelligence</p>
              <h3 className="mb-4 font-display text-display-2 font-light text-paper">{step.title}</h3>
              <p className="max-w-sm text-paper/70">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
