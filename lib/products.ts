import { prisma } from "@/lib/prisma";
import type { ProductDTO } from "@/lib/types";

const include = {
  brand: true,
  category: true,
  images: { orderBy: { position: "asc" as const } },
};

export async function getAllProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({ include, orderBy: { createdAt: "asc" } });
  return products as unknown as ProductDTO[];
}

export async function getFeaturedProducts(limit = 5): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include,
    take: limit,
    orderBy: { createdAt: "asc" },
  });
  if (products.length >= limit) return products as unknown as ProductDTO[];
  const rest = await prisma.product.findMany({
    where: { featured: false },
    include,
    take: limit - products.length,
  });
  return [...products, ...rest] as unknown as ProductDTO[];
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include });
  return product as unknown as ProductDTO | null;
}

export async function getRelatedProducts(product: ProductDTO, limit = 4): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { categoryId: product.category.id, NOT: { id: product.id } },
    include,
    take: limit,
  });
  return products as unknown as ProductDTO[];
}

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  minPower?: number;
  maxPrice?: number;
  connectivity?: string;
  sort?: "price-asc" | "price-desc" | "power-desc" | "featured";
};

export async function getFilteredProducts(filters: ProductFilters): Promise<ProductDTO[]> {
  const where: Record<string, unknown> = {};
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { tagline: { contains: filters.q } },
      { description: { contains: filters.q } },
    ];
  }
  if (filters.category) where.category = { slug: filters.category };
  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.connectivity) where.connectivity = filters.connectivity;
  if (filters.minPower) where.powerKw = { gte: filters.minPower };
  if (filters.maxPrice) where.price = { lte: filters.maxPrice };

  const orderBy =
    filters.sort === "price-asc"
      ? { price: "asc" as const }
      : filters.sort === "price-desc"
        ? { price: "desc" as const }
        : filters.sort === "power-desc"
          ? { powerKw: "desc" as const }
          : { featured: "desc" as const };

  const products = await prisma.product.findMany({ where, include, orderBy });
  return products as unknown as ProductDTO[];
}

export async function getBrandsAndCategories() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { brands, categories };
}
