import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { getDepartmentBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: { departement: string } }): Promise<Metadata> {
  const department = await getDepartmentBySlug(params.departement);
  if (!department) return {};
  return {
    title: `Installation borne de recharge ${department.name}`,
    description: `Installateur de borne de recharge qualifié IRVE dans le département ${department.name}. Devis gratuit et intervention rapide.`,
    alternates: { canonical: `/installation-borne-recharge/${department.slug}` },
  };
}

export default async function DepartmentPage({ params }: { params: { departement: string } }) {
  const department = await getDepartmentBySlug(params.departement);
  if (!department) notFound();

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Installation borne de recharge", href: "/installation-borne-recharge" },
    { label: department.name },
  ];

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Installation borne de recharge</p>
        <h1 className="font-display text-display-2 font-light text-paper">
          Installation de borne de recharge — {department.name}
        </h1>
        {department.intro && <p className="mt-6 max-w-2xl text-paper/70">{department.intro}</p>}

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/installation#devis" size="lg">Demander un devis</ButtonLink>
          <ButtonLink href="/produits" variant="secondary" size="lg">Voir les bornes</ButtonLink>
        </div>

        <h2 className="mt-16 mb-6 font-display text-xl text-paper">Villes couvertes dans le {department.name}</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {department.cities.map((city) => (
            <Link
              key={city.id}
              href={`/installation-borne-recharge/${department.slug}/${city.slug}`}
              className="rounded-2xl border border-line p-5 transition hover:border-charge"
            >
              <p className="font-display text-lg text-paper">{city.name}</p>
              {city.postalCode && <p className="mt-1 text-sm text-fog">{city.postalCode}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
