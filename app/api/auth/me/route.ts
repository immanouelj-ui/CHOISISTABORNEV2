import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
              // Certains contextes Next.js rendent les cookies en lecture seule.
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
    const role = email === ADMIN_EMAIL ? "ADMIN" : "CUSTOMER";

    return NextResponse.json({
      user: {
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
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
