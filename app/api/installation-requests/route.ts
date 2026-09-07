import { NextResponse } from "next/server";
import { createInstallationRequest } from "@/lib/leads";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const PHONE_REGEX = /^[0-9+()\s.-]{6,20}$/;
const URL_REGEX = /^https:\/\//i;

function cleanPhotoUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => URL_REGEX.test(item))
    .slice(0, 8);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Merci d'indiquer votre nom et prénom." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }
    if (!phone || !PHONE_REGEX.test(phone)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    const rawProductId = clean(body.productId) || undefined;
    const product = rawProductId
      ? await prisma.product.findUnique({ where: { id: rawProductId }, select: { id: true, name: true } })
      : null;

    const lead = await createInstallationRequest({
      firstName,
      lastName,
      email,
      phone,
      address: clean(body.address) || undefined,
      postalCode: clean(body.postalCode) || undefined,
      city: clean(body.city) || undefined,
      housingType: clean(body.housingType) || undefined,
      vehicleBrand: clean(body.vehicleBrand) || undefined,
      productId: product?.id,
      productName: product?.name ?? (clean(body.productName) || undefined),
      powerWanted: clean(body.powerWanted) || undefined,
      hasBornAlready: Boolean(body.hasBornAlready),
      propertyStatus: clean(body.propertyStatus) || undefined,
      meterType: clean(body.meterType) || undefined,
      meterDistance: clean(body.meterDistance) || undefined,
      timeline: clean(body.timeline) || undefined,
      hasElectricVehicle: body.hasElectricVehicle === undefined ? undefined : Boolean(body.hasElectricVehicle),
      photoUrls: cleanPhotoUrls(body.photos),
      comment: clean(body.comment) || undefined,
      source: clean(body.source) || "SITE",
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("Installation request error:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre demande pour le moment." },
      { status: 500 },
    );
  }
}
