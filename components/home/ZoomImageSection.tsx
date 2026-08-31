"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

export default function ZoomImageSection() {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    if (reduced) return;
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
