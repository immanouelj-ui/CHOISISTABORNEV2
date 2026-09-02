import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Compte administrateur principal.
// La vérification est faite côté serveur à partir de l'e-mail de la session Supabase.
const ADMIN_EMAIL = "immanouelj@gmail.com";

export async function GET() {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Les cookies peuvent être en lecture seule dans certains contextes.
            }
          },
        },
      }
    );

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ user: null });
    }

    const email = (supabaseUser.email ?? "").trim().toLowerCase();
    const isAdminEmail = email === ADMIN_EMAIL;

    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // L'e-mail administrateur reste ADMIN même si la ligne Prisma n'existe
    // pas encore ou si son rôle n'a pas encore été synchronisé.
    const role = isAdminEmail ? "ADMIN" : user?.role ?? "CUSTOMER";

    return NextResponse.json({
      user: user
        ? { ...user, role }
        : {
            id: supabaseUser.id,
            name:
              supabaseUser.user_metadata?.full_name ??
              supabaseUser.user_metadata?.name ??
              "",
            email: supabaseUser.email ?? "",
            role,
          },
    });
  } catch (error) {
    console.error("ME_ERROR", error);

    return NextResponse.json(
      { error: "Impossible de récupérer la session." },
      { status: 500 }
    );
  }
}
