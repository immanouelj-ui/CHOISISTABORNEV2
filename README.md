# CHOISISTABORNE

Site e-commerce premium et immersif pour bornes de recharge électrique — Next.js (App Router), TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Prisma, Zustand.

> **Nom de marque définitif : CHOISISTABORNE.** "Chargebox" n'apparaît nulle part dans l'interface — ce projet reprend uniquement la structure fonctionnelle générale d'un site de vente de bornes, avec une identité, un branding et des textes 100 % originaux.

## Démarrage rapide

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Le site est accessible sur **http://localhost:3000**.

> Note réseau : `npm install` déclenche `prisma generate`, qui télécharge le moteur Prisma depuis `binaries.prisma.sh`. Cela nécessite un accès internet sortant normal (aucune configuration particulière n'est requise sur votre machine).

## Ce qui est implémenté

- **Accueil immersif** : Hero plein écran avec timeline GSAP au chargement, section de zoom scrubbed au scroll, configurateur interactif ("Quelle borne est faite pour vous ?"), section pinnée (7,4 kW → 22 kW → Connectée → Intelligente), galerie de détails avec animations décalées, produits en scroll horizontal (`containerAnimation`-style pin), comparateur.
- **Catalogue** (`/produits`) : recherche, filtres (catégorie, marque, puissance, connectivité), tri, skeletons de chargement, cartes produit avec hover GSAP et ajout rapide au panier.
- **Fiche produit** (`/produits/[slug]`) : reveal d'image façon "product reveal" (scale 1.4 → 1), galerie narrative en scroll (image → gros plan → caractéristiques → installation), JSON-LD Schema.org `Product`, produits liés.
- **Simulateur** (`/simulateur`) : parcours en 5 étapes avec transitions GSAP et moteur de recommandation scoré sur les 15 produits.
- **Panier** (`/panier` + `CartDrawer`) : store Zustand persistant, tiroir animé (slide + stagger), page panier complète.
- **Header animé** : compaction au scroll (GSAP), menu plein écran sur mobile.
- **Footer graphique** avec reveal au scroll.
- **SEO** : métadonnées par page, Open Graph, Twitter cards, `sitemap.ts` dynamique, `robots.ts`, JSON-LD produit.
- **Prisma** : schéma complet (User, Product, Brand, Category, Order, Cart, Review, Coupon, Address...), seed avec 15 produits réels (Wallbox, Zaptec, Easee, myenergi, Webasto, Schneider Electric, Hager, Legrand, Delta, ABB, Circontrol, KEBA, ChargePoint, JuiceBox), chacun avec 4 images.
- **Accessibilité / performance** : `prefers-reduced-motion` respecté partout (chaque animation GSAP a une branche réduite), animations sur `transform`/`opacity` uniquement, images `next/image` avec `sizes` définis.

## Images

Toutes les images de `/public/images` sont des **visuels de substitution générés proceduralement** (dégradés + glyphes abstraits de borne/voiture/maison dans la palette de la marque), pour que le site soit navigable immédiatement sans dépendance à un service externe.

Remplacez-les par de vraies photos en gardant exactement les mêmes noms de fichiers :

```
public/images/hero/hero-main.webp, hero-closeup.webp, zoom-1..4.webp
public/images/gallery/pinned-1..5.webp, detail-screen.webp, detail-connector.webp, detail-led.webp, detail-texture.webp, detail-install.webp
public/images/misc/configurator-1..3.webp, og-cover.webp
public/images/products/{slug}-main.webp, {slug}-detail.webp, {slug}-installation.webp, {slug}-closeup.webp
```

Le script qui les a générées est conservé dans `scripts/gen_images.py` (nécessite `pillow` et `numpy`) si vous voulez régénérer ou ajuster la palette.

## Production / PostgreSQL

En développement, la base est SQLite (`prisma/schema.prisma`, `DATABASE_URL="file:./dev.db"`). Pour la production :

1. Dans `prisma/schema.prisma`, changez `provider = "sqlite"` en `provider = "postgresql"`.
2. Définissez `DATABASE_URL` vers votre instance PostgreSQL dans `.env`.
3. `npx prisma db push` (ou `migrate deploy`), puis `npm run db:seed`.

## Ce qui reste à brancher pour une mise en production complète

Le brief d'origine demandait aussi un compte client avec authentification, un checkout Stripe fonctionnel et une interface d'administration. Le socle est prêt pour ça (modèles `User`, `Order`, `OrderItem`, page `/compte` en placeholder, panier déjà persistant), mais l'authentification, l'intégration Stripe et le back-office admin n'ont pas été implémentés dans cette itération — ce sont les prochaines briques logiques à ajouter.

## Structure

```
app/                    routes (App Router)
components/animations/  hook GSAP réutilisable (contexte + cleanup + reduced motion)
components/layout/      header, menu mobile, footer, tiroir panier
components/home/        sections de la page d'accueil
components/products/    carte produit, grille, filtres, galerie, reveal
components/simulator/   simulateur en 5 étapes
components/ui/          bouton partagé
lib/                    accès Prisma, store panier Zustand, types partagés
prisma/                 schema + seed
public/images/          visuels (placeholders génératifs)
scripts/                générateur d'images de substitution
```
