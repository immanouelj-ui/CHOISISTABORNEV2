import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
  if ((user.email ?? "").toLowerCase() === ADMIN_EMAIL) return user;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (dbUser?.role !== "ADMIN") redirect("/");
  return user;
}

export default async function AdminCataloguePage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-content">
        <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">← Tableau de bord</Link>
        <div className="mt-6 mb-8 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-sm uppercase tracking-[0.2em] text-charge">Administration</p><h1 className="font-display text-display-3 font-light">Catalogue</h1></div>
          <Link href="/produits" className="rounded-xl border border-line px-4 py-3 text-sm hover:bg-paper/5">Voir le site</Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-ink-soft">
          <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 border-b border-line p-4 text-xs uppercase tracking-wider text-paper/40"><span>Produit</span><span>Marque</span><span>Stock</span><span>Prix TTC</span></div>
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[1fr_120px_120px_120px] gap-4 border-b border-line p-4 last:border-0 items-center">
              <div><p className="font-medium">{product.name}</p><p className="text-xs text-paper/40">{product.sku} · {product.category.name}</p></div>
              <span className="text-sm text-paper/70">{product.brand.name}</span>
              <span className={product.stock > 0 ? "text-sm" : "text-sm text-red-400"}>{product.stock}</span>
              <span className="text-sm">{product.priceTTC.toFixed(2)} €</span>
            </div>
          ))}
        </div>
        {products.length === 0 && <p className="mt-6 text-paper/50">Aucun produit trouvé.</p>}
      </div>
    </main>
  );
}
