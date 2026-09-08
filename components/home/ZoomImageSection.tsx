"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

export default function ZoomImageSection() {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    if (reduced) return;

    // Le "pin" GSAP (scroll-jacking, section figée pendant 1,6x sa hauteur)
    // est fragile sur mobile : la barre d'adresse de Safari/Chrome qui
    // apparaît/disparaît en scrollant modifie la hauteur de la fenêtre en
    // cours d'animation, ce qui provoque des sauts. On réserve donc cet
    // effet au desktop et on garde une simple apparition en fondu sur mobile.
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (isDesktop) {
      gsap.fromTo(
        "[data-zoom-img]",
        { scale: 0.55, borderRadius: "2.5rem" },
        {
          scale: 1.3,
          borderRadius: "0rem",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=160%",
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.fromTo(
        "[data-zoom-caption]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=40%",
            scrub: true,
          },
        },
      );
      gsap.to("[data-zoom-caption]", {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: ref.current,
          start: "+=100%",
          end: "+=160%",
          scrub: true,
        },
      });
    } else {
      gsap.fromTo(
        "[data-zoom-img]",
        { scale: 1.1 },
        {
          scale: 1,
          ease: "power2.out",
          duration: 1,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        },
      );
      gsap.fromTo(
        "[data-zoom-caption]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 60%" },
        },
      );
    }
  }, []);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div data-zoom-img className="absolute inset-0 mx-auto my-auto h-full w-full overflow-hidden">
        <Image
          src="/images/hero/zoom-3.webp"
          alt="Gros plan progressif sur une borne de recharge"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />
      </div>
      <div data-zoom-caption className="container-content relative z-10 flex h-full flex-col justify-center">
        <p className="max-w-lg font-display text-display-3 text-paper">
          Chaque courbe, chaque matière, pensée pour durer.
        </p>
      </div>
    </section>
  );
}
