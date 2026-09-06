import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const subject = clean(body.subject);
    const message = clean(body.message);

    if (!firstName || !lastName || !email.includes("@") || !message) {
      return NextResponse.json({ error: "Merci de compléter tous les champs obligatoires." }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Impossible d'envoyer votre message pour le moment." }, { status: 500 });
  }
}
