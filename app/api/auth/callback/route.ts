import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code) {
    return NextResponse.redirect(new URL("/compte?error=missing_code", request.url));
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("AUTH_CALLBACK_CONFIG_ERROR: Missing Supabase environment variables");
    return NextResponse.redirect(new URL("/compte?error=google_config", request.url));
  }

  try {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(new URL("/", request.url));

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      console.error("Supabase auth callback error:", error?.message);
      return NextResponse.redirect(new URL("/compte?error=auth_callback", request.url));
    }

    const name =
      data.user.user_metadata?.full_name ??
      data.user.user_metadata?.name ??
      "";
    const email = data.user.email ?? "";

    if (email) {
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          email,
          name,
          role: "CUSTOMER",
          updatedAt: new Date(),
        },
        update: {
          email,
          name,
          updatedAt: new Date(),
        },
      });
    }

    return response;
  } catch (error) {
    console.error("AUTH_CALLBACK_ERROR", error);
    return NextResponse.redirect(new URL("/compte?error=auth_callback", request.url));
  }
}
