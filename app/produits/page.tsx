import type { Metadata } from "next";
import Filters from "@/components/products/Filters";
import ProductGrid from "@/components/products/ProductGrid";
import { getBrandsAndCategories, getFilteredProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Toutes les bornes de recharge",
  description: "Comparez les bornes de recharge électrique par puissance, connectivité, marque et prix.",
};

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  minPower?: string;
  maxPrice?: string;
  connectivity?: string;
  sort?: "price-asc" | "price-desc" | "power-desc" | "featured";
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ brands, categories }, products] = await Promise.all([
    getBrandsAndCategories(),
    getFilteredProducts({
      q: searchParams.q,
      category: searchParams.category,
      brand: searchParams.brand,
      minPower: searchParams.minPower ? parseFloat(searchParams.minPower) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
      connectivity: searchParams.connectivity,
      sort: searchParams.sort,
    }),
  ]);

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <h1 className="mb-3 font-display text-display-2 font-light text-paper">
          Des bornes pensées pour votre quotidien.
        </h1>
        <p className="mb-10 max-w-xl text-paper/70">
          {products.length} borne{products.length > 1 ? "s" : ""} sélectionnée{products.length > 1 ? "s" : ""} pour vous.
        </p>
        <Filters brands={brands} categories={categories} />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
