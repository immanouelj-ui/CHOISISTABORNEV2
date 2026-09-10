"use client";

import { useState, type FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { formatPrice } from "@/lib/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PayButton({ total, orderNumber }: { total: number; orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setLoading(true);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/paiement/succes?order=${encodeURIComponent(orderNumber)}`,
      },
    });

    if (submitError) {
      setError(submitError.message || "Le paiement a échoué. Vérifiez vos informations.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      window.location.href = `/paiement/succes?payment_intent=${paymentIntent.id}&order=${encodeURIComponent(orderNumber)}`;
      return;
    }

    setError("Le paiement n'a pas pu être confirmé. Veuillez réessayer.");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <PaymentElement />
      {error && <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-paper px-6 py-4 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Paiement en cours…" : `Payer ${formatPrice(total)}`}
      </button>
    </form>
  );
}

export default function PaymentForm({
  clientSecret,
  total,
  orderNumber,
}: {
  clientSecret: string;
  total: number;
  orderNumber: string;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#2F6BFF",
            colorBackground: "#121418",
            colorText: "#F4F3EF",
            colorDanger: "#F87171",
            borderRadius: "12px",
          },
        },
      }}
    >
      <PayButton total={total} orderNumber={orderNumber} />
    </Elements>
  );
}
