import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { addLeadNote, LEAD_STATUSES, updateLeadStatus } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "immanouelj@gmail.com";

async function requireAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => undefined,
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const email = (user.email ?? "").trim().toLowerCase();
  if (email === ADMIN_EMAIL) return user;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  return dbUser?.role === "ADMIN" ? user : null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : undefined;
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (status && !LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    if (status) {
      await updateLeadStatus(params.id, status);
    }
    if (note) {
      await addLeadNote(params.id, note, admin.email ?? "Admin");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}
