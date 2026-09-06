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
  return { city, localPage: city.localPage };
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
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
