import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { listLeads, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/leads";
import LeadStatusControl from "@/components/admin/LeadStatusControl";

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

export default async function AdminProspectsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();
  const activeStatus = searchParams.status ?? "ALL";
  const leads = await listLeads(activeStatus);

  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-32 text-paper">
      <div className="mx-auto max-w-content">
        <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">← Tableau de bord</Link>
        <div className="mt-6 mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-charge">Administration</p>
          <h1 className="font-display text-display-3 font-light">Prospects installation</h1>
          <p className="mt-3 text-paper/50">
            {leads.length} demande{leads.length > 1 ? "s" : ""} {activeStatus !== "ALL" ? `— ${LEAD_STATUS_LABELS[activeStatus as keyof typeof LEAD_STATUS_LABELS]}` : ""}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/admin/prospects"
            className={`rounded-full border px-4 py-2 text-xs ${activeStatus === "ALL" ? "border-charge bg-charge/10 text-charge" : "border-line text-paper/60 hover:text-paper"}`}
          >
            Tous
          </Link>
          {LEAD_STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin/prospects?status=${status}`}
              className={`rounded-full border px-4 py-2 text-xs ${activeStatus === status ? "border-charge bg-charge/10 text-charge" : "border-line text-paper/60 hover:text-paper"}`}
            >
              {LEAD_STATUS_LABELS[status]}
            </Link>
          ))}
        </div>

        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="grid gap-6 rounded-2xl border border-line bg-ink-soft p-6 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="font-semibold">{lead.firstName} {lead.lastName}</p>
                <p className="mt-1 text-sm text-paper/60">{lead.email} · {lead.phone}</p>
                {(lead.address || lead.city) && (
                  <p className="mt-1 text-sm text-paper/50">{[lead.address, lead.postalCode, lead.city].filter(Boolean).join(", ")}</p>
                )}
                <p className="mt-2 text-xs text-fog">
                  {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · Origine : {lead.source}
                </p>
              </div>

              <div className="text-sm text-paper/70">
                {lead.housingType && <p>Logement : {lead.housingType}</p>}
                {lead.vehicleBrand && <p>Véhicule : {lead.vehicleBrand}</p>}
                {lead.powerWanted && <p>Puissance : {lead.powerWanted}</p>}
                {lead.product && <p>Borne : {lead.product.name}</p>}
                {lead.comment && <p className="mt-2 italic text-paper/50">« {lead.comment} »</p>}
                {lead.notes.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-line pt-3">
                    {lead.notes.map((note) => (
                      <p key={note.id} className="text-xs text-paper/50">
                        <span className="text-paper/70">{note.author ?? "Admin"}</span> — {note.content}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <LeadStatusControl leadId={lead.id} status={lead.status} />
            </div>
          ))}

          {leads.length === 0 && (
            <div className="rounded-2xl border border-line p-8 text-center text-paper/50">
              Aucun prospect pour ce filtre.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
