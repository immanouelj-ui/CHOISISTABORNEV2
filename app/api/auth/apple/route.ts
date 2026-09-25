import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Avoid an opaque Vercel 500 when the Supabase variables are missing.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("APPLE_AUTH_CONFIG_ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.redirect(new URL("/compte?error=apple_config", request.url));
  }

  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${requestUrl.origin}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      console.error("APPLE_AUTH_ERROR", error?.message);
      return NextResponse.redirect(new URL("/compte?error=apple_auth", request.url));
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error("APPLE_AUTH_ROUTE_ERROR", error);
    return NextResponse.redirect(new URL("/compte?error=apple_auth", request.url));
  }
}
