import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authCookie, verifySessionValue } from "@/lib/auth";

export async function GET() {
  const session = cookies().get(authCookie.name)?.value;
  const userId = verifySessionValue(session);

  if (!userId) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user: user ?? null });
}
