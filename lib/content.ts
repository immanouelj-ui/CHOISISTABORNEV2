import { prisma } from "@/lib/prisma";

export async function getAllDepartments() {
  return prisma.department.findMany({
    include: { cities: { include: { localPage: true }, orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function getDepartmentBySlug(slug: string) {
  return prisma.department.findUnique({
    where: { slug },
    include: { cities: { include: { localPage: true }, orderBy: { name: "asc" } } },
  });
}

export async function getLocalPage(departmentSlug: string, citySlug: string) {
  const city = await prisma.city.findFirst({
    where: { slug: citySlug, department: { slug: departmentSlug } },
    include: { department: true, localPage: true },
  });
  if (!city || !city.localPage || !city.localPage.isPublished) return null;

  const siblingCities = await prisma.city.findMany({
    where: { departmentId: city.departmentId, id: { not: city.id }, localPage: { isPublished: true } },
    orderBy: { name: "asc" },
    take: 6,
  });

  return { city, localPage: city.localPage, siblingCities };
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Sélectionne un sous-ensemble déterministe de guides pertinents pour une ville
 * donnée, afin de varier le maillage interne d'une page locale à l'autre
 * plutôt que d'afficher toujours les 3 mêmes guides partout.
 */
export async function getGuidesForCity(citySlug: string, count = 3) {
  const posts = await getPublishedBlogPosts();
  if (posts.length <= count) return posts;
  const offset = hashString(citySlug) % posts.length;
  const rotated = [...posts.slice(offset), ...posts.slice(0, offset)];
  return rotated.slice(0, count);
}

/**
 * Sélectionne un sous-ensemble déterministe de villes (avec leur département)
 * pour le maillage interne depuis un guide vers les pages locales.
 */
export async function getCitiesForGuide(guideSlug: string, count = 4) {
  const cities = await prisma.city.findMany({
    where: { localPage: { isPublished: true } },
    include: { department: true },
    orderBy: { name: "asc" },
  });
  if (cities.length <= count) return cities;
  const offset = hashString(guideSlug) % cities.length;
  const rotated = [...cities.slice(offset), ...cities.slice(0, offset)];
  return rotated.slice(0, count);
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getFaqItems(category?: string) {
  return prisma.faqItem.findMany({
    where: category ? { category } : undefined,
    orderBy: { order: "asc" },
  });
}
