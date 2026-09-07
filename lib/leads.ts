import { prisma } from "@/lib/prisma";
import { pushLeadToCrm } from "@/lib/crm";

export { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/lead-status";
export type { LeadStatus } from "@/lib/lead-status";

export type CreateLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  postalCode?: string;
  city?: string;
  housingType?: string;
  vehicleBrand?: string;
  productId?: string;
  productName?: string;
  powerWanted?: string;
  hasBornAlready?: boolean;
  comment?: string;
  source?: string;
};

export async function createInstallationRequest(input: CreateLeadInput) {
  const lead = await prisma.installationRequest.create({
    data: {
      id: crypto.randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      postalCode: input.postalCode,
      city: input.city,
      housingType: input.housingType,
      vehicleBrand: input.vehicleBrand,
      productId: input.productId || null,
      productName: input.productName,
      powerWanted: input.powerWanted,
      hasBornAlready: input.hasBornAlready ?? false,
      comment: input.comment,
      source: input.source ?? "SITE",
      status: "NOUVEAU",
      updatedAt: new Date(),
    },
  });

  await pushLeadToCrm({
    nom: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    phone: input.phone,
    adresse: input.address,
    code_postal: input.postalCode,
    ville: input.city,
    type_logement: input.housingType,
    marque_vehicule: input.vehicleBrand,
    produit: input.productName,
    puissance_souhaitee: input.powerWanted,
    possede_deja_borne: input.hasBornAlready ? "oui" : "non",
    commentaire: input.comment,
    source: `CHOISISTABORNE - ${input.source ?? "SITE"}`,
    statut: "Lead",
  });

  return lead;
}

export async function listLeads(status?: string) {
  return prisma.installationRequest.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" } }, product: true },
  });
}

export async function updateLeadStatus(id: string, status: string) {
  return prisma.installationRequest.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}

export async function addLeadNote(leadId: string, content: string, author?: string) {
  return prisma.leadNote.create({
    data: {
      id: crypto.randomUUID(),
      leadId,
      content,
      author,
      createdAt: new Date(),
    },
  });
}
