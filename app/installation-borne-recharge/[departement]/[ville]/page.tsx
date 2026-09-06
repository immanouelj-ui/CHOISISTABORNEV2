import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import InstallationRequestForm from "@/components/installation/InstallationRequestForm";
import { ButtonLink } from "@/components/ui/Button";
import { getLocalPage, getGuidesForCity } from "@/lib/content";
import { pickShowcaseImage } from "@/lib/images";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: { departement: string; ville: string };
}): Promise<Metadata> {
  const result = await getLocalPage(params.departement, params.ville);
  if (!result) return {};
  const { localPage, city } = result;
  return {
    title: localPage.title,
    description: localPage.metaDescription,
    alternates: { canonical: `/installation-borne-recharge/${params.departement}/${city.slug}` },
    openGraph: { title: localPage.title, description: localPage.metaDescription },
  };
}

export default async function CityInstallationPage({
  params,
}: {
  params: { departement: string; ville: string };
}) {
  const result = await getLocalPage(params.departement, params.ville);
  if (!result) notFound();
  const { city, localPage, siblingCities } = result;
  const guides = await getGuidesForCity(city.slug);
  const heroImage = pickShowcaseImage(city.slug);

  const faqEntries: { q: string; a: string }[] = localPage.faq ? JSON.parse(localPage.faq) : [];

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Installation borne de recharge", href: "/installation-borne-recharge" },
    { label: city.department.name, href: `/installation-borne-recharge/${city.department.slug}` },
    { label: city.name },
  ];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `CHOISISTABORNE — Installation borne de recharge ${city.name}`,
    areaServed: city.name,
    address: { "@type": "PostalAddress", addressLocality: city.name, postalCode: city.postalCode ?? undefined, addressCountry: "FR" },
    url: `${SITE_URL}/installation-borne-recharge/${city.department.slug}/${city.slug}`,
  };

  const faqJsonLd = faqEntries.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntries.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        {faqJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        )}

        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">
          Installation borne de recharge — {city.department.name}
        </p>
        <h1 className="max-w-3xl font-display text-display-2 font-light text-paper">{localPage.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-paper/75">{localPage.intro}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href={`#devis-${city.slug}`} size="lg">Demander un devis à {city.name}</ButtonLink>
          <ButtonLink href="/produits" variant="secondary" size="lg">Voir les bornes</ButtonLink>
        </div>

        <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-ink-raised">
          <Image
            src={heroImage}
            alt={`Installation de borne de recharge à ${city.name}`}
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <article className="prose-invert max-w-none space-y-6 text-paper/80">
            {localPage.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          <div id={`devis-${city.slug}`}>
            <InstallationRequestForm source={`LOCAL_${city.slug.toUpperCase()}`} />
          </div>
        </div>

        {faqEntries.length > 0 && (
          <div className="mt-24 max-w-3xl">
            <h2 className="mb-8 font-display text-display-3 font-light text-paper">
              Questions fréquentes — {city.name}
            </h2>
            <div className="space-y-4">
              {faqEntries.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-line p-6">
                  <summary className="cursor-pointer list-none font-display text-paper marker:content-none">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-paper/70">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="mt-24 grid gap-16 md:grid-cols-2">
          {siblingCities.length > 0 && (
            <div>
              <h2 className="mb-6 font-display text-lg text-paper">
                Installation borne de recharge dans {city.department.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {siblingCities.map((sibling) => (
                  <Link
                    key={sibling.id}
                    href={`/installation-borne-recharge/${city.department.slug}/${sibling.slug}`}
                    className="rounded-full border border-line px-4 py-2 text-sm text-paper/80 transition hover:border-charge hover:text-paper"
                  >
                    {sibling.name}
                  </Link>
                ))}
              </div>
              <Link
                href={`/installation-borne-recharge/${city.department.slug}`}
                className="mt-4 inline-block text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline"
              >
                Voir tout le département {city.department.name} →
              </Link>
            </div>
          )}

          {guides.length > 0 && (
            <div>
              <h2 className="mb-6 font-display text-lg text-paper">Guides utiles</h2>
              <ul className="space-y-3">
                {guides.map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="text-sm text-paper/80 underline-offset-4 transition hover:text-paper hover:underline"
                    >
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
