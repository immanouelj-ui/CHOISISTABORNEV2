import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${requestUrl.origin}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    console.error("GOOGLE_AUTH_ERROR", error?.message);
    return NextResponse.redirect(new URL("/compte?error=google_auth", request.url));
  }

  return NextResponse.redirect(data.url);
}
