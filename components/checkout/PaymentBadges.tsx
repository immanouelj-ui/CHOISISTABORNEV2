export default function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fog ${className}`}>
      <span className="text-paper">Paiement en 3x sans frais avec Klarna</span>
      <span aria-hidden>·</span>
      <span>Apple Pay</span>
      <span aria-hidden>·</span>
      <span>Paiement sécurisé Stripe</span>
    </p>
  );
}
