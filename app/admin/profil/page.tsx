import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const ADMIN_EMAIL = "immanouelj@gmail.com";

export default async function AdminProfilPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte");
  const email = (user.email ?? "").toLowerCase();
  if (email !== ADMIN_EMAIL) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
    if (dbUser?.role !== "ADMIN") redirect("/");
  }

  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Administrateur";
  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">← Tableau de bord</Link>
        <div className="mt-6 rounded-3xl border border-line bg-ink-soft p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-charge">Administration</p>
          <h1 className="mt-3 font-display text-display-3 font-light">Profil administrateur</h1>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-line p-5"><p className="text-xs uppercase tracking-wider text-paper/40">Nom</p><p className="mt-2 text-lg">{name}</p></div>
            <div className="rounded-2xl border border-line p-5"><p className="text-xs uppercase tracking-wider text-paper/40">Email</p><p className="mt-2 text-lg">{user.email}</p></div>
            <div className="rounded-2xl border border-line p-5"><p className="text-xs uppercase tracking-wider text-paper/40">Rôle</p><p className="mt-2 text-lg text-charge">ADMIN</p></div>
          </div>
          <p className="mt-6 text-sm text-paper/50">La gestion de la session et la déconnexion restent disponibles dans votre espace compte.</p>
          <Link href="/compte" className="mt-6 inline-block rounded-xl border border-line px-5 py-3 text-sm hover:bg-paper/5">Ouvrir mon compte</Link>
        </div>
      </div>
    </main>
  );
}
