import type { Metadata } from "next";
import "./globals.css";
import AnimatedHeader from "@/components/layout/AnimatedHeader";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CookieConsent from "@/components/layout/CookieConsent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CHOISISTABORNE — Choisissez la borne qui vous correspond",
    template: "%s — CHOISISTABORNE",
  },
  description:
    "CHOISISTABORNE sélectionne et vend les meilleures bornes de recharge pour véhicules électriques : comparateur, simulateur de puissance, et installation simplifiée.",
  keywords: [
    "borne de recharge",
    "voiture électrique",
    "wallbox",
    "recharge électrique",
    "installation borne",
  ],
  openGraph: {
    title: "CHOISISTABORNE — Choisissez la borne qui vous correspond",
    description: "La recharge électrique, simplement.",
    url: SITE_URL,
    siteName: "CHOISISTABORNE",
    images: ["/images/misc/og-cover.webp"],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHOISISTABORNE",
    description: "Choisissez la borne qui vous correspond.",
    images: ["/images/misc/og-cover.webp"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CHOISISTABORNE",
  url: SITE_URL,
  logo: `${SITE_URL}/images/misc/og-cover.webp`,
  slogan: "Choisissez votre borne. Nous pouvons aussi l'installer.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CHOISISTABORNE",
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased font-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <AnimatedHeader />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CookieConsent />
      </body>
    </html>
  );
}
