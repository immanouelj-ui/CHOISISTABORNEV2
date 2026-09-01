import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authCookie, createSessionValue, verifyPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(160),
  password: z.string().min(1, "Mot de passe requis").max(128),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash || !verifyPassword(data.password, user.passwordHash)) {
      return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set(authCookie.name, createSessionValue(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: authCookie.maxAge,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ error: "Impossible de se connecter pour le moment." }, { status: 500 });
  }
}
