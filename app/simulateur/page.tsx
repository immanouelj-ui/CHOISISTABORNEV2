import type { Metadata } from "next";
import Simulator from "@/components/simulator/Simulator";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Simulateur — Trouvez votre borne idéale",
  description: "Répondez à quelques questions pour trouver la borne de recharge adaptée à votre véhicule et votre logement.",
};

export default async function SimulateurPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-ink px-6 pb-32 pt-40 md:px-12">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h1 className="font-display text-display-2 font-light text-paper">Trouvez votre borne idéale.</h1>
      </div>
      <Simulator products={products} />
    </div>
  );
}
