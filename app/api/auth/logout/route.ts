import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const cookieStore = cookies();
  const cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => cookiesToSet.push(...cookies),
        },
      }
    );

    await supabase.auth.signOut();

    const response = NextResponse.json({ ok: true });
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options as any);
    });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json({ error: "Impossible de se déconnecter." }, { status: 500 });
  }
}
