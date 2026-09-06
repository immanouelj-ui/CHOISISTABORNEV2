import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getAllDepartments, getPublishedBlogPosts } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Le sitemap lit Prisma/Supabase : il doit être généré à la demande,
// pas pendant le build Vercel.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, departments, posts] = await Promise.all([
    getAllProducts(),
    getAllDepartments(),
    getPublishedBlogPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/produits`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/simulateur`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/installation`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/installation-borne-recharge`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produits/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const departmentRoutes: MetadataRoute.Sitemap = departments.map((d) => ({
    url: `${SITE_URL}/installation-borne-recharge/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const cityRoutes: MetadataRoute.Sitemap = departments.flatMap((d) =>
    d.cities
      .filter((c) => c.localPage?.isPublished)
      .map((c) => ({
        url: `${SITE_URL}/installation-borne-recharge/${d.slug}/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  const guideRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/guides/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...departmentRoutes, ...cityRoutes, ...guideRoutes];
}
