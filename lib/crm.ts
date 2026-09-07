const CRM_LEADS_ENDPOINT =
  process.env.CRM_LEADS_WEBHOOK_URL ?? "https://crm-zeta-two-60.vercel.app/api/public/leads";

export type CrmLeadPayload = Record<string, string | undefined>;

/**
 * Transmet un lead au CRM externe (endpoint public à clé API, voir immanouelj-ui/crm).
 * N'échoue jamais : une panne du CRM ne doit pas empêcher l'enregistrement local du devis.
 */
export async function pushLeadToCrm(data: CrmLeadPayload): Promise<void> {
  const apiKey = process.env.CRM_API_KEY;
  if (!apiKey) return;

  try {
    const response = await fetch(CRM_LEADS_ENDPOINT, {
      method: "POST",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Échec de l'envoi du lead au CRM:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Erreur réseau lors de l'envoi du lead au CRM:", error);
  }
}
