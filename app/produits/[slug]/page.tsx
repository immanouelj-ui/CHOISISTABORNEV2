import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductReveal from "@/components/products/ProductReveal";
import ProductGallery from "@/components/products/ProductGallery";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/types";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const main = product.images.find((i) => i.kind === "main") ?? product.images[0];
  return {
    title: `${product.name} — ${formatPrice(product.price)}`,
    description: product.tagline ?? product.description,
    openGraph: {
      title: `${product.name} — CHOISISTABORNE`,
      description: product.tagline ?? product.description,
      images: main ? [main.url] : undefined,
    },
    alternates: { canonical: `/produits/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand.name },
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/produits/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductReveal product={product} />
      <ProductGallery product={product} />

      {related.length > 0 && (
        <section className="bg-ink px-6 py-24 md:px-12">
          <div className="mx-auto max-w-content">
            <h2 className="mb-10 font-display text-display-3 font-light text-paper">
              D&apos;autres bornes qui pourraient vous plaire
            </h2>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
