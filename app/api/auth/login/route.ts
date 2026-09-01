import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(160),
  password: z.string().min(1, "Mot de passe requis").max(128),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());

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

    return NextResponse.json({
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