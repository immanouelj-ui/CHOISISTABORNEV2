import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { getAllDepartments } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Installation de borne de recharge par département",
  description:
    "Trouvez un installateur de borne de recharge qualifié IRVE près de chez vous : découvrez nos zones d'intervention par département et par ville.",
  alternates: { canonical: "/installation-borne-recharge" },
};

export default async function InstallationDepartmentsIndexPage() {
  const departments = await getAllDepartments();
  const crumbs = [{ label: "Accueil", href: "/" }, { label: "Installation borne de recharge" }];

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Zones d&apos;intervention</p>
        <h1 className="font-display text-display-2 font-light text-paper">
          Installation de borne de recharge, département par département
        </h1>
        <p className="mt-6 max-w-2xl text-paper/70">
          Notre réseau d&apos;installateurs qualifiés IRVE intervient dans les départements et villes ci-dessous.
          Sélectionnez votre secteur pour connaître nos solutions et demander un devis.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div key={dept.id} className="rounded-2xl border border-line p-6">
              <Link href={`/installation-borne-recharge/${dept.slug}`} className="font-display text-xl text-paper hover:text-charge">
                {dept.name}
              </Link>
              <ul className="mt-4 space-y-2">
                {dept.cities.map((city) => (
                  <li key={city.id}>
                    <Link
                      href={`/installation-borne-recharge/${dept.slug}/${city.slug}`}
                      className="text-sm text-paper/60 transition hover:text-paper"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <p className="mt-16 text-paper/60">Nos pages locales sont en cours de déploiement dans votre région.</p>
        )}
      </div>
    </div>
  );
}
