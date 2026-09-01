import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authCookie, createSessionValue, hashPassword } from "@/lib/auth";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court").max(100),
  email: z.string().trim().email("Adresse e-mail invalide").max(160),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(128),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cette adresse e-mail." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: data.name,
        email,
        passwordHash: hashPassword(data.password),
        updatedAt: new Date(),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const response = NextResponse.json({ user });
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
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ error: "Impossible de créer le compte pour le moment." }, { status: 500 });
  }
}
