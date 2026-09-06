import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { getPublishedBlogPosts } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Conseils & guides sur la recharge électrique",
  description:
    "Puissance, installation, prix, aides : tous nos conseils pour choisir et installer votre borne de recharge en toute sérénité.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const posts = await getPublishedBlogPosts();
  const crumbs = [{ label: "Accueil", href: "/" }, { label: "Conseils & guides" }];

  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }}
        />
        <div className="mb-6"><Breadcrumbs items={crumbs} /></div>
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-charge">Conseils & guides</p>
        <h1 className="font-display text-display-2 font-light text-paper">
          Tout comprendre sur la recharge électrique
        </h1>
        <p className="mt-6 max-w-2xl text-paper/70">
          Puissance, prix, installation, copropriété… nos guides vous aident à faire les bons choix.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/guides/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-line transition hover:border-charge"
            >
              {post.coverImage && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-raised">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                {post.category && <p className="mb-2 text-xs uppercase tracking-wide text-fog">{post.category}</p>}
                <h2 className="font-display text-lg text-paper">{post.title}</h2>
                <p className="mt-2 text-sm text-paper/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && <p className="mt-16 text-paper/60">Nos premiers guides arrivent très bientôt.</p>}
      </div>
    </div>
  );
}
