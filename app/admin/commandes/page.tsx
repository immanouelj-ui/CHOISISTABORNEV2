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
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte");
  if ((user.email ?? "").toLowerCase() === ADMIN_EMAIL) return;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (dbUser?.role !== "ADMIN") redirect("/");
}

export default async function AdminCommandesPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-content">
        <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">← Tableau de bord</Link>
        <div className="mt-6 mb-8"><p className="mb-2 text-sm uppercase tracking-[0.2em] text-charge">Administration</p><h1 className="font-display text-display-3 font-light">Commandes</h1><p className="mt-3 text-paper/50">Les 100 dernières commandes.</p></div>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-line bg-ink-soft p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div><p className="font-semibold">{order.orderNumber}</p><p className="mt-1 text-sm text-paper/50">{order.customerName} · {order.customerEmail}</p><p className="mt-1 text-xs text-paper/40">{order.items.length} article{order.items.length > 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("fr-FR")}</p></div>
                <div className="flex items-center gap-4"><span className="rounded-full border border-line px-3 py-1 text-xs">{order.status}</span><span className="rounded-full border border-line px-3 py-1 text-xs">{order.paymentStatus}</span><strong>{order.totalTTC.toFixed(2)} €</strong></div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="rounded-2xl border border-line p-8 text-center text-paper/50">Aucune commande pour le moment.</div>}
        </div>
      </div>
    </main>
  );
}
