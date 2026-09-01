import { prisma } from "@/lib/prisma";
import type { ProductDTO } from "@/lib/types";

const include = {
  brand: true,
  category: true,
  images: {
    orderBy: { order: "asc" as const },
  },
} as const;

type PrismaProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
    order: number;
  }>;
};

function toProductDTO(product: PrismaProduct): ProductDTO {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.shortDescription ?? null,
    description: product.description,
    price: product.priceTTC,
    compareAtPrice: product.compareAtPrice ?? null,
    powerKw: product.powerKw,
    phase: product.phaseType === "MONO" ? "monophase" : "triphase",
    connectivity: product.has4G
      ? "wifi_4g"
      : product.hasWifi
        ? "wifi"
        : "none",
    installation: "les_deux",
    badge: product.isBestSeller
      ? "Meilleure vente"
      : product.isFeatured
        ? "Nouveau"
        : null,
    featured: product.isFeatured,
    stock: product.stock,
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
    },
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt ?? product.name,
      kind: image.isPrimary ? "main" : "detail",
      position: image.order,
    })),
  };
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    include,
    orderBy: { createdAt: "asc" },
  });
  return products.map((product) => toProductDTO(product as PrismaProduct));
}

export async function getFeaturedProducts(limit = 5): Promise<ProductDTO[]> {
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    include,
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  if (featured.length >= limit) {
    return featured.map((product) => toProductDTO(product as PrismaProduct));
  }

  const rest = await prisma.product.findMany({
    where: {
      isFeatured: false,
      id: { notIn: featured.map((product) => product.id) },
    },
    include,
    take: limit - featured.length,
    orderBy: { createdAt: "asc" },
  });

  return [...featured, ...rest].map((product) =>
    toProductDTO(product as PrismaProduct),
  );
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include,
  });

  return product ? toProductDTO(product as PrismaProduct) : null;
}

export async function getRelatedProducts(
  product: ProductDTO,
  limit = 4,
): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: {
      categoryId: product.category.id,
      NOT: { id: product.id },
      isActive: true,
    },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products.map((item) => toProductDTO(item as PrismaProduct));
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

export async function getFilteredProducts(
  filters: ProductFilters,
): Promise<ProductDTO[]> {
  const where: Record<string, unknown> = { isActive: true };

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { shortDescription: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.brand) {
    where.brand = { slug: filters.brand };
  }

  if (filters.minPower) {
    where.powerKw = { gte: filters.minPower };
  }

  if (filters.maxPrice) {
    where.priceTTC = { lte: filters.maxPrice };
  }

  if (filters.connectivity === "none") {
    where.hasWifi = false;
    where.has4G = false;
  } else if (filters.connectivity === "wifi") {
    where.hasWifi = true;
    where.has4G = false;
  } else if (filters.connectivity === "wifi_4g") {
    where.has4G = true;
  }

  const orderBy =
    filters.sort === "price-asc"
      ? { priceTTC: "asc" as const }
      : filters.sort === "price-desc"
        ? { priceTTC: "desc" as const }
        : filters.sort === "power-desc"
          ? { powerKw: "desc" as const }
          : { isFeatured: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    include,
    orderBy,
  });

  return products.map((product) => toProductDTO(product as PrismaProduct));
}

export async function getBrandsAndCategories() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { brands, categories };
}
