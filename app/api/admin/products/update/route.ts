import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "immanouelj@gmail.com";

async function isAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if ((user.email ?? "").trim().toLowerCase() === ADMIN_EMAIL) return true;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  return dbUser?.role === "ADMIN";
}

const text = (value: FormDataEntryValue | null) => String(value ?? "").trim();
const num = (value: FormDataEntryValue | null, fallback = 0) => {
  const n = Number(String(value ?? ""));
  return Number.isFinite(n) ? n : fallback;
};
const bool = (form: FormData, name: string) => form.get(name) === "true";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/compte", request.url));

  const form = await request.formData();
  const id = text(form.get("id"));
  if (!id) return NextResponse.redirect(new URL("/admin/catalogue", request.url));

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: text(form.get("name")),
        reference: text(form.get("reference")),
        sku: text(form.get("sku")),
        slug: text(form.get("slug")),
        brandId: text(form.get("brandId")),
        categoryId: text(form.get("categoryId")),
        shortDescription: text(form.get("shortDescription")) || null,
        description: text(form.get("description")),
        priceHT: num(form.get("priceHT")),
        priceTTC: num(form.get("priceTTC")),
        vatRate: num(form.get("vatRate"), 20),
        compareAtPrice: form.get("compareAtPrice") ? num(form.get("compareAtPrice")) : null,
        stock: Math.max(0, Math.round(num(form.get("stock")))),
        inStock: bool(form, "inStock"),
        leadTimeDays: Math.max(0, Math.round(num(form.get("leadTimeDays"), 2))),
        powerKw: num(form.get("powerKw")),
        phaseType: text(form.get("phaseType")) || "MONO",
        connectorType: text(form.get("connectorType")) || "T2S",
        cableLengthMeters: form.get("cableLengthMeters") ? num(form.get("cableLengthMeters")) : null,
        ipRating: text(form.get("ipRating")) || null,
        ikRating: text(form.get("ikRating")) || null,
        ocppVersion: text(form.get("ocppVersion")) || null,
        hasDynamicLoad: bool(form, "hasDynamicLoad"),
        hasSolarMode: bool(form, "hasSolarMode"),
        hasWifi: bool(form, "hasWifi"),
        hasRfid: bool(form, "hasRfid"),
        has4G: bool(form, "has4G"),
        isFeatured: bool(form, "isFeatured"),
        isBestSeller: bool(form, "isBestSeller"),
        isActive: bool(form, "isActive"),
        isAdvenirEligible: bool(form, "isAdvenirEligible"),
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: id } });
    const imageValues = [0, 1, 2, 3, 4]
      .map(i => text(form.get(`image${i}`)))
      .filter(Boolean);

    if (imageValues.length) {
      await prisma.productImage.createMany({
        data: imageValues.map((url, order) => ({
          id: crypto.randomUUID(),
          productId: id,
          url,
          alt: text(form.get("name")) || null,
          isPrimary: order === 0,
          order,
        })),
      });
    }

    return NextResponse.redirect(new URL(`/admin/catalogue/${id}?saved=1`, request.url));
  } catch (error) {
    console.error("ADMIN_PRODUCT_UPDATE", error);
    return NextResponse.redirect(new URL(`/admin/catalogue/${id}?error=1`, request.url));
  }
}
