import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

export default function ProductGrid({ products }: { products: ProductDTO[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-paper/60">
        Aucune borne ne correspond à ces critères pour le moment.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
