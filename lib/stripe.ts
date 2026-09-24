const STRIPE_API = "https://api.stripe.com/v1";

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return key;
}

export async function createStripePaymentIntent(input: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  amountCents: number;
  shipping: {
    name: string;
    phone?: string;
    address: { line1: string; postalCode: string; city: string; country: string };
  };
}) {
  const params = new URLSearchParams();
  params.set("amount", String(input.amountCents));
  params.set("currency", "eur");
  params.set("receipt_email", input.customerEmail);
  params.set("automatic_payment_methods[enabled]", "true");
  params.set("metadata[orderId]", input.orderId);
  params.set("metadata[orderNumber]", input.orderNumber);
  // Requis par Klarna (et recommandé pour les autres moyens de paiement) pour
  // déterminer le pays du client et maximiser le taux d'acceptation.
  params.set("shipping[name]", input.shipping.name);
  params.set("shipping[address][line1]", input.shipping.address.line1);
  params.set("shipping[address][postal_code]", input.shipping.address.postalCode);
  params.set("shipping[address][city]", input.shipping.address.city);
  params.set("shipping[address][country]", input.shipping.address.country);
  if (input.shipping.phone) params.set("shipping[phone]", input.shipping.phone);

  const response = await fetch(`${STRIPE_API}/payment_intents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe payment intent creation failed");
  }

  return data as { id: string; client_secret: string };
}

export async function retrieveStripePaymentIntent(paymentIntentId: string) {
  const response = await fetch(`${STRIPE_API}/payment_intents/${encodeURIComponent(paymentIntentId)}`, {
    headers: { Authorization: `Bearer ${getStripeSecretKey()}` },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Stripe payment intent retrieval failed");
  return data;
}

export function verifyStripeWebhookSignature(payload: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured");

  const parts = signature.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const crypto = require("node:crypto") as typeof import("node:crypto");
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some((candidate) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(candidate, "utf8"));
    } catch {
      return false;
    }
  });
}
