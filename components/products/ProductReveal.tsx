"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useGsapContext } from "@/components/animations/useGsapContext";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";

export default function ProductReveal({ product }: { product: ProductDTO }) {
  const main = product.images.find((i) => i.kind === "main") ?? product.images[0];
  const addItem = useCartStore((s) => s.addItem);

  const ref = useGsapContext<HTMLDivElement>(({ reduced }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      "[data-reveal-img]",
      { scale: reduced ? 1 : 1.4, opacity: reduced ? 1 : 0 },
      { scale: 1, opacity: 1, duration: reduced ? 0.01 : 1.4 },
    )
      .fromTo(
        "[data-reveal-title]",
        { y: reduced ? 0 : 40, opacity: reduced ? 1 : 0 },
        { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.8 },
        "-=0.8",
      )
      .fromTo(
        "[data-reveal-meta]",
        { y: reduced ? 0 : 20, opacity: reduced ? 1 : 0 },
        { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.6 },
        "-=0.5",
      );
  }, [product.id]);

  const addToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: product.price,
      image: main?.url ?? "",
    });
  };

  return (
    <section ref={ref} className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink">
      <div className="absolute inset-0 overflow-hidden">
        {main && (
          <Image
            data-reveal-img
            src={main.url}
            alt={main.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/30" />
      </div>

      <div className="container-content relative z-10 w-full pb-16">
        <p className="mb-3 text-sm uppercase tracking-wide text-fog">{product.brand.name}</p>
        <h1 data-reveal-title className="font-display text-display-2 font-light text-paper">
          {product.name}
        </h1>
        {product.tagline && <p className="mt-3 max-w-lg text-paper/75">{product.tagline}</p>}

        <div data-reveal-meta className="mt-8 flex flex-wrap items-center gap-6">
          <span className="font-display text-2xl text-paper">{formatPrice(product.price)}</span>
          <span className="text-sm text-paper/60">{product.powerKw} kW</span>
          <Button onClick={addToCart} size="lg">Choisir cette borne</Button>
        </div>
      </div>
    </section>
  );
}
