import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { getBlogPostBySlug, getCitiesForGuide } from "@/lib/content";
import { pickShowcaseImage } from "@/lib/images";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/guides/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription ?? post.excerpt,
      images: [post.coverImage ?? pickShowcaseImage(post.slug)],
    },
  };
}

export default async function GuideArticlePage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post || !post.isPublished) notFound();
  const cities = await getCitiesForGuide(post.slug);

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Conseils & guides", href: "/guides" },
    { label: post.title },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        {post.category && <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">{post.category}</p>}
        <h1 className="font-display text-display-2 font-light text-paper">{post.title}</h1>
        <p className="mt-6 text-lg text-paper/70">{post.excerpt}</p>

        {post.coverImage && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-raised">
            <Image src={post.coverImage} alt={post.title} fill sizes="768px" className="object-cover" priority />
          </div>
        )}

        <article className="prose-invert mt-10 max-w-none space-y-6 text-paper/80">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        <div className="mt-16 rounded-3xl border border-line bg-ink-soft p-8 text-center">
          <p className="font-display text-xl text-paper">Prêt à choisir votre borne ?</p>
          <p className="mt-2 text-paper/60">Trouvez la borne adaptée à votre véhicule et faites-la installer par un professionnel.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/produits">Voir les bornes</ButtonLink>
            <ButtonLink href="/installation" variant="secondary">Demander une installation</ButtonLink>
          </div>
        </div>

        {cities.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-lg text-paper">Installation près de chez vous</h2>
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
              <Link
                href="/installation-borne-recharge"
                className="rounded-full border border-line px-4 py-2 text-sm text-paper/60 transition hover:border-charge hover:text-paper"
              >
                Toutes nos zones d&apos;intervention →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
