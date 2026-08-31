"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/animations/useGsapContext";
import { formatPrice } from "@/lib/types";
import type { ProductDTO } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProducts({ products }: { products: ProductDTO[] }) {
  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    if (reduced) return;
    const track = ref.current?.querySelector("[data-h-track]") as HTMLElement | null;
    if (!track) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      scrub: 1,
      animation: tween,
      invalidateOnRefresh: true,
    });
  }, [products.length]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-soft">
      <div className="container-content pt-20">
        <h2 className="max-w-xl font-display text-display-2 font-light text-paper">
          Des bornes pensées pour votre quotidien.
        </h2>
      </div>
      <div className="flex h-[80vh] items-center overflow-hidden">
        <div data-h-track className="flex gap-8 px-6 md:px-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produits/${product.slug}`}
              className="group relative h-[56vh] w-[74vw] shrink-0 overflow-hidden rounded-3xl bg-ink sm:w-[46vw] md:w-[30vw]"
            >
              <Image
                src={product.images[0]?.url ?? "/images/misc/og-cover.webp"}
                alt={product.images[0]?.alt ?? product.name}
                fill
                sizes="(min-width: 768px) 30vw, 74vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-wide text-fog">{product.brand.name}</p>
                <p className="mt-1 font-display text-xl text-paper">{product.name}</p>
                <p className="mt-1 text-sm text-paper/70">{product.powerKw} kW · {formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
