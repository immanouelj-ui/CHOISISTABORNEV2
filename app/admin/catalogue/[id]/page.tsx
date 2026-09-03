import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_EMAIL = "immanouelj@gmail.com";

async function requireAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte");
  if ((user.email ?? "").trim().toLowerCase() === ADMIN_EMAIL) return user;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (dbUser?.role !== "ADMIN") redirect("/");
  return user;
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/catalogue" className="text-sm text-paper/50 hover:text-paper">← Catalogue</Link>
        <div className="mt-6 mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-charge">Administration</p>
          <h1 className="font-display text-display-3 font-light">Modifier le produit</h1>
          <p className="mt-2 text-paper/50">{product.name} · {product.sku}</p>
        </div>

        <form action="/api/admin/products/update" method="POST" className="space-y-8">
          <input type="hidden" name="id" value={product.id} />
          <section className="rounded-2xl border border-line bg-ink-soft p-6">
            <h2 className="mb-5 text-xl font-semibold">Informations générales</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="name" label="Nom" value={product.name} />
              <Field name="reference" label="Référence" value={product.reference} />
              <Field name="sku" label="SKU" value={product.sku} />
              <Field name="slug" label="Slug URL" value={product.slug} />
              <Select name="brandId" label="Marque" value={product.brandId} options={brands.map(x => [x.id, x.name])} />
              <Select name="categoryId" label="Catégorie" value={product.categoryId} options={categories.map(x => [x.id, x.name])} />
            </div>
            <div className="mt-5 grid gap-5">
              <TextArea name="shortDescription" label="Description courte" value={product.shortDescription ?? ""} />
              <TextArea name="description" label="Description complète" value={product.description} rows={8} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-ink-soft p-6">
            <h2 className="mb-5 text-xl font-semibold">Prix, stock et livraison</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField name="priceHT" label="Prix HT (€)" value={product.priceHT} step="0.01" />
              <NumberField name="priceTTC" label="Prix TTC (€)" value={product.priceTTC} step="0.01" />
              <NumberField name="vatRate" label="TVA (%)" value={product.vatRate} step="0.01" />
              <NumberField name="compareAtPrice" label="Ancien prix (€)" value={product.compareAtPrice ?? ""} step="0.01" />
              <NumberField name="stock" label="Stock" value={product.stock} step="1" />
              <NumberField name="leadTimeDays" label="Délai (jours)" value={product.leadTimeDays} step="1" />
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field name="carrier" label="Transporteur / livraison" value="" placeholder="Chronopost / Geodis IRVE" />
              <Field name="shippingInfo" label="Informations livraison" value="" placeholder="Livraison 2 à 5 jours ouvrés" />
            </div>
            <div className="mt-5 flex flex-wrap gap-6">
              <Check name="inStock" label="Disponible" checked={product.inStock} />
              <Check name="isActive" label="Produit actif" checked={product.isActive} />
              <Check name="isFeatured" label="Mis en avant" checked={product.isFeatured} />
              <Check name="isBestSeller" label="Best-seller" checked={product.isBestSeller} />
              <Check name="isAdvenirEligible" label="Éligible Advenir" checked={product.isAdvenirEligible} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-ink-soft p-6">
            <h2 className="mb-5 text-xl font-semibold">Caractéristiques techniques</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <NumberField name="powerKw" label="Puissance (kW)" value={product.powerKw} step="0.1" />
              <Field name="phaseType" label="Phase" value={product.phaseType} />
              <Field name="connectorType" label="Connecteur" value={product.connectorType} />
              <NumberField name="cableLengthMeters" label="Câble (m)" value={product.cableLengthMeters ?? ""} step="0.1" />
              <Field name="ipRating" label="Indice IP" value={product.ipRating ?? ""} />
              <Field name="ikRating" label="Indice IK" value={product.ikRating ?? ""} />
              <Field name="ocppVersion" label="OCPP" value={product.ocppVersion ?? ""} />
            </div>
            <div className="mt-5 flex flex-wrap gap-6">
              <Check name="hasDynamicLoad" label="Gestion dynamique" checked={product.hasDynamicLoad} />
              <Check name="hasSolarMode" label="Mode solaire" checked={product.hasSolarMode} />
              <Check name="hasWifi" label="Wi-Fi" checked={product.hasWifi} />
              <Check name="hasRfid" label="RFID" checked={product.hasRfid} />
              <Check name="has4G" label="4G" checked={product.has4G} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-ink-soft p-6">
            <h2 className="mb-2 text-xl font-semibold">Images du produit</h2>
            <p className="mb-5 text-sm text-paper/50">Tu peux maintenant choisir une image depuis ton PC. Elle sera envoyée dans ton bucket Supabase « image » et son URL sera enregistrée avec le produit.</p>
            <div className="space-y-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <ImageUploadField
                  key={i}
                  name={`image${i}`}
                  label={`Image ${i + 1}${i === 0 ? " — principale" : ""}`}
                  initialUrl={product.images[i]?.url ?? ""}
                />
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pb-10">
            <button className="rounded-xl bg-charge px-6 py-3 font-semibold text-ink hover:opacity-90">Enregistrer les modifications</button>
            <Link href="/admin/catalogue" className="rounded-xl border border-line px-6 py-3 hover:bg-paper/5">Annuler</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ name, label, value, placeholder }: { name: string; label: string; value: string | number; placeholder?: string }) {
  return <label className="block"><span className="mb-2 block text-sm text-paper/60">{label}</span><input name={name} defaultValue={value} placeholder={placeholder} className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none focus:border-charge" /></label>;
}
function NumberField({ name, label, value, step }: { name: string; label: string; value: string | number; step: string }) {
  return <label className="block"><span className="mb-2 block text-sm text-paper/60">{label}</span><input type="number" name={name} defaultValue={value} step={step} className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none focus:border-charge" /></label>;
}
function TextArea({ name, label, value, rows = 4 }: { name: string; label: string; value: string; rows?: number }) {
  return <label className="block"><span className="mb-2 block text-sm text-paper/60">{label}</span><textarea name={name} defaultValue={value} rows={rows} className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none focus:border-charge" /></label>;
}
function Select({ name, label, value, options }: { name: string; label: string; value: string; options: string[][] }) {
  return <label className="block"><span className="mb-2 block text-sm text-paper/60">{label}</span><select name={name} defaultValue={value} className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none focus:border-charge">{options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>;
}
function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={name} value="true" defaultChecked={checked} className="h-4 w-4" />{label}</label>;
}
