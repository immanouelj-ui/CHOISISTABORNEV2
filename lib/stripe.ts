const STRIPE_API = "https://api.stripe.com/v1";

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return key;
}

export type StripeCheckoutItem = {
  name: string;
  description?: string;
  image?: string;
  unitAmount: number;
  quantity: number;
};

export async function createStripeCheckoutSession(input: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  items: StripeCheckoutItem[];
  totalCents: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", input.customerEmail);
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("metadata[orderId]", input.orderId);
  params.set("metadata[orderNumber]", input.orderNumber);
  params.set("payment_intent_data[metadata][orderId]", input.orderId);
  params.set("payment_intent_data[metadata][orderNumber]", input.orderNumber);

  input.items.forEach((item, index) => {
    params.set(`line_items[${index}][price_data][currency]`, "eur");
    params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
    params.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    if (item.description) {
      params.set(`line_items[${index}][price_data][product_data][description]`, item.description.slice(0, 500));
    }
    if (item.image && /^https?:\/\//.test(item.image)) {
      params.set(`line_items[${index}][price_data][product_data][images][0]`, item.image);
    }
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
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
    throw new Error(data?.error?.message || "Stripe checkout session creation failed");
  }

  return data as { id: string; url: string };
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  const response = await fetch(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${getStripeSecretKey()}` },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Stripe session retrieval failed");
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
