"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ShoppingBag } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const main = product.images.find((i) => i.kind === "main") ?? product.images[0];
  const secondary = product.images.find((i) => i.kind === "detail") ?? product.images[1];

  const onEnter = () => {
    gsap.to(cardRef.current?.querySelector("[data-card-img-main]") ?? [], { scale: 1.05, duration: 0.6, ease: "power2.out" });
    gsap.to(cardRef.current?.querySelector("[data-card-content]") ?? [], { y: -6, duration: 0.4, ease: "power2.out" });
    if (secondary) gsap.to(cardRef.current?.querySelector("[data-card-img-secondary]") ?? [], { opacity: 1, duration: 0.4 });
  };
  const onLeave = () => {
    gsap.to(cardRef.current?.querySelector("[data-card-img-main]") ?? [], { scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(cardRef.current?.querySelector("[data-card-content]") ?? [], { y: 0, duration: 0.4, ease: "power2.out" });
    if (secondary) gsap.to(cardRef.current?.querySelector("[data-card-img-secondary]") ?? [], { opacity: 0, duration: 0.4 });
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Link
      href={`/produits/${product.slug}`}
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-raised">
        {main && (
          <Image
            data-card-img-main
            src={main.url}
            alt={main.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        )}
        {secondary && (
          <Image
            data-card-img-secondary
            src={secondary.url}
            alt={secondary.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover opacity-0"
          />
        )}
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs text-paper backdrop-blur">
            {product.badge}
          </span>
        )}
        <button
          onClick={quickAdd}
          aria-label="Ajouter au panier"
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
      <div data-card-content className="mt-4">
        <p className="text-xs uppercase tracking-wide text-fog">{product.brand.name}</p>
        <p className="mt-1 font-medium text-paper">{product.name}</p>
        <p className="mt-1 text-sm text-paper/70">
          {product.powerKw} kW · {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
