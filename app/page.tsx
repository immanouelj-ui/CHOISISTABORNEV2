import Hero from "@/components/home/Hero";
import ZoomImageSection from "@/components/home/ZoomImageSection";
import ConfiguratorSection from "@/components/home/ConfiguratorSection";
import PinnedProduct from "@/components/home/PinnedProduct";
import GalleryDetails from "@/components/home/GalleryDetails";
import HorizontalProducts from "@/components/home/HorizontalProducts";
import Comparison from "@/components/home/Comparison";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";
import { ButtonLink } from "@/components/ui/Button";

// Les produits viennent de Prisma/Supabase : ne pas pré-rendre cette page
// pendant le build Vercel, sinon le build peut épuiser le pool PostgreSQL.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProducts(6), getAllProducts()]);
  const [a, b] = all;

  return (
    <>
      <Hero />
      <ZoomImageSection />
      <ConfiguratorSection />
      <PinnedProduct />
      <GalleryDetails />
      <HorizontalProducts products={featured} />
      {a && b && <Comparison a={a} b={b} />}

      <section id="conseils" className="bg-ink px-6 py-24 md:px-12">
        <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-lg font-display text-display-3 font-light text-paper">
            Pas encore sûr de votre choix ? Laissez-nous vous guider.
          </h2>
          <ButtonLink href="/simulateur" size="lg">Lancer le simulateur</ButtonLink>
        </div>
      </section>
    </>
  );
}
