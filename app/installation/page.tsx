import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
import InstallationRequestForm from "@/components/installation/InstallationRequestForm";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Installation de borne de recharge par un professionnel qualifié",
  description:
    "Achetez votre borne de recharge sur CHOISISTABORNE et faites-la installer par un professionnel IRVE. Devis gratuit, intervention en maison, appartement, copropriété ou entreprise.",
  alternates: { canonical: "/installation" },
  openGraph: {
    title: "Installation de borne de recharge — CHOISISTABORNE",
    description: "Devis gratuit et mise en relation avec un installateur IRVE près de chez vous.",
  },
};

const STEPS = [
  { title: "Choisissez votre borne", text: "Sélectionnez la borne adaptée à votre véhicule et à votre logement dans notre catalogue." },
  { title: "Décrivez votre besoin", text: "Renseignez votre adresse, votre type de logement et la puissance souhaitée en 2 minutes." },
  { title: "Nous vous mettons en relation", text: "Un installateur qualifié IRVE de notre réseau vous contacte pour établir un devis personnalisé." },
  { title: "Votre installation est planifiée", text: "Vous validez le devis et convenez ensemble d'une date d'intervention." },
  { title: "Votre borne est installée", text: "L'installateur pose et met en service votre borne dans le respect des normes en vigueur." },
];

const ADVANTAGES = [
  "Installateurs qualifiés IRVE (Infrastructures de Recharge pour Véhicules Électriques)",
  "Devis gratuit et sans engagement",
  "Intervention en maison, appartement, copropriété ou entreprise",
  "Éligibilité aux aides à l'installation lorsque votre situation le permet",
  "Suivi de votre demande directement depuis votre espace client",
];

const FAQ = [
  {
    q: "Combien coûte l'installation d'une borne de recharge ?",
    a: "Le coût dépend de la distance entre votre tableau électrique et l'emplacement de la borne, de la puissance choisie et d'éventuels travaux annexes (tranchée, mise à la terre). Un devis précis vous est transmis après l'étude de votre demande.",
  },
  {
    q: "Faut-il un électricien qualifié pour installer une borne ?",
    a: "Oui. L'installation d'une borne de recharge doit être réalisée par un professionnel qualifié IRVE, seul habilité à garantir la sécurité de l'installation et l'accès à certaines aides.",
  },
  {
    q: "Puis-je faire installer une borne achetée ailleurs ?",
    a: "Notre service d'installation est avant tout pensé pour accompagner l'achat d'une borne sur CHOISISTABORNE, mais indiquez-le nous dans le formulaire : nous étudierons votre demande.",
  },
  {
    q: "Combien de temps faut-il pour être recontacté ?",
    a: "Notre équipe revient vers vous sous 48h ouvrées pour qualifier votre projet et préparer votre devis d'installation.",
  },
];

export default async function InstallationPage({
  searchParams,
}: {
  searchParams: { produit?: string };
}) {
  const product = searchParams.produit
    ? await prisma.product.findUnique({ where: { slug: searchParams.produit }, select: { id: true, name: true } })
    : null;

  const cities = await prisma.city.findMany({
    where: { localPage: { isPublished: true } },
    include: { department: true },
    orderBy: { name: "asc" },
    take: 12,
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const crumbs = [{ label: "Accueil", href: "/" }, { label: "Installation" }];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
      />

      <section className="relative flex min-h-[70vh] w-full items-end overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src="/images/products/wallbox-pulsar-max-installation.webp"
            alt="Borne de recharge installée sur une façade de maison"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        </div>
        <div className="container-content relative z-10 w-full pb-16 pt-32">
          <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Installation borne de recharge</p>
          <h1 className="max-w-3xl font-display text-display-2 font-light text-paper">
            Vous avez votre borne. Nous pouvons aussi l&apos;installer.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-paper/75">
            Un réseau d&apos;installateurs qualifiés IRVE partout en France, pour une pose rapide et conforme aux normes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#devis" className="inline-flex items-center gap-2 rounded-full bg-paper px-8 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-charge hover:text-paper">
              Demander un devis d&apos;installation
            </a>
            <Link href="/produits" className="text-sm text-paper/70 underline-offset-4 hover:text-paper hover:underline">
              Découvrir les bornes
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 md:px-12">
        <div className="mx-auto max-w-content">
          <h2 className="mb-12 font-display text-display-3 font-light text-paper">Comment ça marche</h2>
          <div className="grid gap-6 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-line p-6">
                <span className="font-display text-3xl text-charge">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg text-paper">{step.title}</h3>
                <p className="mt-2 text-sm text-paper/60">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-soft px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-display text-display-3 font-light text-paper">Pourquoi passer par CHOISISTABORNE</h2>
            <ul className="space-y-4">
              {ADVANTAGES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-paper/80">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-charge" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {cities.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-paper">
                  <MapPin size={18} className="text-charge" /> Zones d&apos;intervention
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/installation-borne-recharge/${city.department.slug}/${city.slug}`}
                      className="rounded-full border border-line px-4 py-2 text-sm text-paper/80 transition hover:border-charge hover:text-paper"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div id="devis">
            <InstallationRequestForm
              source="PAGE_INSTALLATION"
              productId={product?.id}
              productName={product?.name}
            />
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 font-display text-display-3 font-light text-paper">Questions fréquentes</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-line p-6">
                <summary className="cursor-pointer list-none font-display text-paper marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-paper/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
