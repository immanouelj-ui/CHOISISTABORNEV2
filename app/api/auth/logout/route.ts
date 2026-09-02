import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function POST() {
  const cookieStore = cookies();
  const cookiesToSet: CookieToSet[] = [];

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSetFromSupabase) => {
            cookiesToSet.push(...cookiesToSetFromSupabase);
          },
        },
      }
    );

    await supabase.auth.signOut();

    const response = NextResponse.json({ ok: true });
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json(
      { error: "Impossible de se déconnecter." },
      { status: 500 }
    );
  }
}
