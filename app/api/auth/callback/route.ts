import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const cookieStore = cookies();
  const response = NextResponse.redirect(new URL("/", request.url));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      console.error("Supabase auth callback error:", error?.message);
      return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
    }

    const name =
      data.user.user_metadata?.full_name ??
      data.user.user_metadata?.name ??
      "";
    const email = data.user.email ?? "";

    if (email) {
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: { id: data.user.id, email, name, role: "CUSTOMER", updatedAt: new Date() },
        update: { email, name, updatedAt: new Date() },
      });
    }

    return response;
  } catch (error) {
    console.error("AUTH_CALLBACK_ERROR", error);
    return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
  }
}
