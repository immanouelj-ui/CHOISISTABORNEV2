import type { Metadata } from "next";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { getFaqItems } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur les bornes de recharge",
  description: "Achat, livraison, installation, garantie : retrouvez les réponses aux questions les plus fréquentes.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const items = await getFaqItems();
  const crumbs = [{ label: "Accueil", href: "/" }, { label: "FAQ" }];

  const categories = Array.from(new Set(items.map((item) => item.category)));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        {items.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        )}
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Aide</p>
        <h1 className="font-display text-display-2 font-light text-paper">Questions fréquentes</h1>

        {categories.map((category) => (
          <div key={category} className="mt-14">
            <h2 className="mb-6 font-display text-xl text-paper">{category}</h2>
            <div className="space-y-4">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <details key={item.id} className="group rounded-2xl border border-line p-6">
                    <summary className="cursor-pointer list-none font-display text-paper marker:content-none">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-paper/70">{item.answer}</p>
                  </details>
                ))}
            </div>
          </div>
        ))}

        {items.length === 0 && <p className="mt-10 text-paper/60">La FAQ est en cours de mise à jour.</p>}
      </div>
    </div>
  );
}
