import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const ADMIN_EMAIL = "immanouelj@gmail.com";

async function getAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte");
  const email = (user.email ?? "").trim().toLowerCase();
  if (email === ADMIN_EMAIL) return { name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "", email: user.email ?? ADMIN_EMAIL };
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true, name: true, email: true } });
  if (dbUser?.role !== "ADMIN") redirect("/");
  return { name: dbUser.name ?? "", email: dbUser.email };
}

export default async function AdminPage() {
  const admin = await getAdmin();
  const users = await prisma.user.count();
  const orders = await prisma.order.count();
  const paidOrders = await prisma.order.count({ where: { paymentStatus: "PAID" } });
  const products = await prisma.product.count({ where: { isActive: true } });

  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-content">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="mb-3 text-sm uppercase tracking-[0.2em] text-charge">Administration</p><h1 className="font-display text-display-3 font-light">Tableau de bord</h1><p className="mt-3 text-paper/60">Connecté en tant que {admin.name || admin.email}</p></div>
          <Link href="/admin/profil" className="rounded-xl border border-line px-5 py-3 text-sm text-paper transition hover:bg-paper/5">Mon profil admin</Link>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Clients", users], ["Commandes", orders], ["Commandes payées", paidOrders], ["Produits actifs", products]].map(([label, value]) => <div key={label} className="rounded-2xl border border-line bg-ink-soft p-6"><p className="text-sm text-paper/50">{label}</p><p className="mt-3 font-display text-4xl">{value}</p></div>)}
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/admin/catalogue" className="rounded-2xl border border-line bg-ink-soft p-6 transition hover:border-charge/50"><p className="text-lg font-semibold">Catalogue</p><p className="mt-2 text-sm text-paper/50">Gérer et consulter les produits.</p><span className="mt-5 inline-block text-sm text-charge">Ouvrir →</span></Link>
          <Link href="/admin/commandes" className="rounded-2xl border border-line bg-ink-soft p-6 transition hover:border-charge/50"><p className="text-lg font-semibold">Commandes</p><p className="mt-2 text-sm text-paper/50">Consulter les commandes et paiements.</p><span className="mt-5 inline-block text-sm text-charge">Ouvrir →</span></Link>
          <Link href="/admin/profil" className="rounded-2xl border border-line bg-ink-soft p-6 transition hover:border-charge/50"><p className="text-lg font-semibold">Profil admin</p><p className="mt-2 text-sm text-paper/50">Voir les informations du compte administrateur.</p><span className="mt-5 inline-block text-sm text-charge">Ouvrir →</span></Link>
        </section>
      </div>
    </main>
  );
}
