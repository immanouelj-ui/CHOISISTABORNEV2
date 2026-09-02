import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court").max(100),
  email: z.string().trim().email("Adresse e-mail invalide").max(160),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(128),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const cookieStore = cookies();
    const cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

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

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.toLowerCase(),
      password: data.password,
      options: { data: { full_name: data.name } },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!authData.user) return NextResponse.json({ error: "Impossible de créer le compte." }, { status: 500 });

    await prisma.user.upsert({
      where: { id: authData.user.id },
      create: {
        id: authData.user.id,
        email: authData.user.email ?? data.email.toLowerCase(),
        name: data.name,
        role: "CUSTOMER",
        updatedAt: new Date(),
      },
      update: {
        email: authData.user.email ?? data.email.toLowerCase(),
        name: data.name,
        updatedAt: new Date(),
      },
    });

    const response = NextResponse.json({
      user: { id: authData.user.id, email: authData.user.email, name: data.name },
      session: authData.session,
      emailConfirmationRequired: !authData.session,
    });
    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options as any));
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ error: "Impossible de créer le compte pour le moment." }, { status: 500 });
  }
}
