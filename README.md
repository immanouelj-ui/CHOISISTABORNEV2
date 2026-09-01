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
- **Panier** (`/panier`) : panier Zustand persistant et modification des quantités.
- **Checkout client** (`/commande`) : coordonnées, adresse de livraison/facturation et validation du panier côté serveur.
- **Paiement Stripe Checkout** : création d'une commande en base avant redirection Stripe, prix recalculés depuis PostgreSQL et contrôle du stock côté serveur.
- **Webhook Stripe** (`/api/stripe/webhook`) : confirmation du paiement, passage de la commande à `PAID`, mise à jour du paiement et décrément du stock de manière transactionnelle et idempotente.
- **Confirmation** (`/paiement/succes`) et **annulation** (`/paiement/annule`) du paiement.
- **Prisma / Supabase PostgreSQL** : utilisateurs, produits, panier, commandes, lignes de commande, paiements, avis, coupons et adresses.
- **SEO / accessibilité** : métadonnées, sitemap, robots, JSON-LD produit et respect de `prefers-reduced-motion`.

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
