export const LEAD_STATUSES = [
  "NOUVEAU",
  "A_CONTACTER",
  "CONTACTE",
  "QUALIFICATION",
  "DEVIS_A_PREPARER",
  "DEVIS_ENVOYE",
  "RELANCE",
  "ACCEPTE",
  "INSTALLATION_PLANIFIEE",
  "INSTALLATION_TERMINEE",
  "PERDU",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NOUVEAU: "Nouveau",
  A_CONTACTER: "À contacter",
  CONTACTE: "Contacté",
  QUALIFICATION: "Qualification",
  DEVIS_A_PREPARER: "Devis à préparer",
  DEVIS_ENVOYE: "Devis envoyé",
  RELANCE: "Relance",
  ACCEPTE: "Accepté",
  INSTALLATION_PLANIFIEE: "Installation planifiée",
  INSTALLATION_TERMINEE: "Installation terminée",
  PERDU: "Perdu",
};
