import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(160),
  password: z.string().min(1, "Mot de passe requis").max(128),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const cookieStore = cookies();
    const response = NextResponse.json({ ok: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email.toLowerCase(),
      password: data.password,
    });

    if (error || !authData.user) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    response.headers.set("Content-Type", "application/json");
    response.body;
    const body = JSON.stringify({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name:
          authData.user.user_metadata?.full_name ??
          authData.user.user_metadata?.name ??
          "",
      },
      session: authData.session,
    });
    return new NextResponse(body, { status: 200, headers: response.headers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Données invalides." },
        { status: 400 }
      );
    }
    console.error("LOGIN_ERROR", error);
    return NextResponse.json(
      { error: "Impossible de se connecter pour le moment." },
      { status: 500 }
    );
  }
}
