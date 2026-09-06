# CHOISISTABORNE

Site e-commerce premium et immersif pour bornes de recharge électrique — Next.js (App Router), TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Prisma, Zustand.

> **Nom de marque définitif : CHOISISTABORNE.** "Chargebox" n'apparaît nulle part dans l'interface — ce projet reprend uniquement la structure fonctionnelle générale d'un site de vente de bornes, avec une identité, un branding et des textes 100 % originaux.

## Démarrage rapide

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Le site est accessible sur **http://localhost:3000**.

## Fonctionnalités

- **Accueil immersif** : Hero plein écran, animations GSAP, configurateur, galerie et comparateur.
- **Catalogue** (`/produits`) : recherche, filtres, tri et fiches produit.
- **Simulateur** (`/simulateur`) : recommandation de borne.
- **Panier** (`/panier`) : panier Zustand persistant, modification des quantités et cross-sell installation.
- **Checkout client** (`/commande`) : coordonnées, adresse de livraison/facturation et validation du panier côté serveur.
- **Paiement Stripe Checkout** : création d'une commande en base avant redirection Stripe, prix recalculés depuis PostgreSQL et contrôle du stock côté serveur.
- **Webhook Stripe** (`/api/stripe/webhook`) : confirmation du paiement, passage de la commande à `PAID`, mise à jour du paiement et décrément du stock de manière transactionnelle et idempotente.
- **Confirmation** (`/paiement/succes`) et **annulation** (`/paiement/annule`) du paiement.
- **Installation & génération de leads** (`/installation`) : formulaire de demande de devis, cross-sell sur le panier et les fiches produit, CRM interne (`/admin/prospects`) avec statuts et notes.
- **SEO local** (`/installation-borne-recharge/[departement]/[ville]`) : pages locales éditoriales par département et par ville, avec FAQ et LocalBusiness JSON-LD, listées en base (`Department`, `City`, `LocalPage`).
- **Conseils & guides** (`/guides`) : articles de blog SEO stockés en base (`BlogPost`).
- **FAQ, À propos, Contact** et pages légales (`/mentions-legales`, `/cgv`, `/confidentialite`, `/cookies`) avec bandeau de gestion des cookies.
- **Prisma / Supabase PostgreSQL** : utilisateurs, produits, panier, commandes, lignes de commande, paiements, avis, coupons, adresses, prospects d'installation, contenus locaux et blog.
- **SEO / accessibilité** : métadonnées, sitemap (produits + pages locales + guides), robots, JSON-LD (Product, Organization, WebSite, BreadcrumbList, FAQPage, LocalBusiness, Article) et respect de `prefers-reduced-motion`.

### Ce qui reste à construire

Compte tenu de l'ampleur du cahier des charges, cette itération priorise le cœur e-commerce déjà en place et le
moteur stratégique de génération de leads d'installation + SEO local/contenu. Restent notamment à développer :
facturation PDF automatique, envoi d'emails transactionnels, gestion fine du stock (mouvements, seuils), variantes
produits, promotions/codes promo côté admin, avis clients avec formulaire de dépôt, et intégration Analytics/GTM.

## Stripe — configuration

Les clés Stripe ne doivent **jamais** être commitées dans GitHub. Copiez `.env.example` vers `.env.local` et renseignez :

```env
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

En production, ajoutez les mêmes variables dans l'hébergeur (par exemple Vercel) plutôt que dans le dépôt Git.

### Webhook Stripe

Configurez dans le Dashboard Stripe un endpoint :

```text
https://VOTRE-DOMAINE/api/stripe/webhook
```

Événements nécessaires :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.expired`
- `payment_intent.payment_failed`

Copiez la signature du webhook (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`.

## Production / Supabase

Le schéma Prisma utilise PostgreSQL et les tables existantes sont mappées avec `@@map` (`users`, `products`, `orders`, etc.). Après modification du schéma :

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

## Images

Les images de `/public/images` sont des visuels de substitution. Remplacez-les par les photos finales en conservant les noms attendus par les fiches produit.

## Structure

```text
app/                    routes App Router + API checkout/webhook
components/animations/  hooks GSAP
components/layout/      header, menu mobile, footer, panier
components/home/        sections accueil
components/products/    catalogue et fiches produit
components/simulator/   simulateur
components/ui/          composants partagés
lib/                    Prisma, Stripe, store panier, types
prisma/                 schema + seed
public/images/          visuels
scripts/                outils images
```
