import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const brands = [
  { name: "Wallbox", slug: "wallbox" },
  { name: "Zaptec", slug: "zaptec" },
  { name: "Easee", slug: "easee" },
  { name: "Myenergi", slug: "myenergi" },
  { name: "Webasto", slug: "webasto" },
  { name: "Schneider Electric", slug: "schneider-electric" },
  { name: "Hager", slug: "hager" },
  { name: "Legrand", slug: "legrand" },
  { name: "Delta", slug: "delta" },
  { name: "ABB", slug: "abb" },
  { name: "Circontrol", slug: "circontrol" },
  { name: "KEBA", slug: "keba" },
  { name: "ChargePoint", slug: "chargepoint" },
  { name: "JuiceBox", slug: "juicebox" },
];

const categories = [
  { name: "Résidentiel", slug: "residentiel" },
  { name: "Copropriété", slug: "copropriete" },
  { name: "Professionnel", slug: "professionnel" },
];

type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  powerKw: number;
  phase: "monophase" | "triphase";
  connectivity: "none" | "wifi" | "wifi_bluetooth" | "wifi_4g";
  installation: "interieur" | "exterieur" | "les_deux";
  badge?: string;
  featured?: boolean;
  brand: string;
  category: string;
};

const products: SeedProduct[] = [
  {
    slug: "wallbox-pulsar-max",
    name: "Pulsar Max",
    tagline: "Compacte, puissante, connectée.",
    description:
      "La Pulsar Max concentre 22 kW de puissance dans un boîtier de la taille d'une tablette. Pensée pour un usage quotidien silencieux, elle ajuste automatiquement la charge selon la capacité de votre installation électrique.",
    price: 849,
    compareAtPrice: 949,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi_bluetooth",
    installation: "les_deux",
    badge: "Meilleure vente",
    featured: true,
    brand: "wallbox",
    category: "residentiel",
  },
  {
    slug: "wallbox-copper-sb",
    name: "Copper SB",
    tagline: "L'élégance au service de la recharge.",
    description:
      "Habillage en cuivre brossé et finitions premium : la Copper SB est pensée pour les intérieurs soignés. Écran tactile intégré et gestion fine de la puissance jusqu'à 22 kW.",
    price: 1290,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi_bluetooth",
    installation: "interieur",
    badge: "Édition premium",
    brand: "wallbox",
    category: "residentiel",
  },
  {
    slug: "zaptec-go-2",
    name: "Go 2",
    tagline: "La référence scandinave, sans compromis.",
    description:
      "Étanche IP54, certifiée pour l'extérieur, la Go 2 combine robustesse nordique et pilotage intelligent via application. Répartition dynamique de la charge sur plusieurs bornes.",
    price: 799,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi",
    installation: "exterieur",
    brand: "zaptec",
    category: "copropriete",
  },
  {
    slug: "easee-one",
    name: "One",
    tagline: "Modulaire, évolutive, sans câble fixe.",
    description:
      "Design modulaire permettant de faire évoluer la puissance sans changer le boîtier. Compatible Type 2 avec câble amovible pour s'adapter à tous les véhicules.",
    price: 899,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi_4g",
    installation: "les_deux",
    badge: "Nouveau",
    featured: true,
    brand: "easee",
    category: "residentiel",
  },
  {
    slug: "myenergi-zappi",
    name: "Zappi",
    tagline: "Charge intelligente pilotée par le solaire.",
    description:
      "Conçue pour les foyers équipés de panneaux solaires, la Zappi priorise automatiquement l'énergie produite sur site avant de puiser sur le réseau.",
    price: 1050,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "wifi",
    installation: "les_deux",
    badge: "Intelligent",
    brand: "myenergi",
    category: "residentiel",
  },
  {
    slug: "webasto-pure-2",
    name: "Pure II",
    tagline: "L'essentiel, parfaitement exécuté.",
    description:
      "Sobre et fiable, la Pure II délivre une charge stable en 7,4 kW. Idéale pour une première installation ou un usage secondaire.",
    price: 549,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "none",
    installation: "interieur",
    brand: "webasto",
    category: "residentiel",
  },
  {
    slug: "schneider-evlink",
    name: "EVlink Home",
    tagline: "La garantie d'un grand groupe électrique.",
    description:
      "Développée par un leader mondial de la distribution électrique, l'EVlink Home répond aux exigences des installations les plus normées.",
    price: 720,
    powerKw: 11,
    phase: "triphase",
    connectivity: "wifi",
    installation: "les_deux",
    brand: "schneider-electric",
    category: "residentiel",
  },
  {
    slug: "hager-witty",
    name: "Witty Start",
    tagline: "Pensée pour les installateurs.",
    description:
      "Montage rapide, câblage simplifié : la Witty Start réduit le temps d'installation de 30 % par rapport aux bornes traditionnelles.",
    price: 599,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "wifi",
    installation: "les_deux",
    brand: "hager",
    category: "professionnel",
  },
  {
    slug: "legrand-green-up",
    name: "Green'Up Premium",
    tagline: "Le standard français de la recharge.",
    description:
      "Compatible avec l'ensemble du parc automobile électrique, la Green'Up Premium s'intègre discrètement à toutes les façades.",
    price: 690,
    powerKw: 11,
    phase: "triphase",
    connectivity: "wifi",
    installation: "exterieur",
    brand: "legrand",
    category: "residentiel",
  },
  {
    slug: "delta-ac-mini",
    name: "AC Mini",
    tagline: "Le format le plus compact du marché.",
    description:
      "À peine plus grande qu'une boîte aux lettres, l'AC Mini se fond dans n'importe quel garage sans jamais sacrifier la puissance de charge.",
    price: 469,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "none",
    installation: "interieur",
    brand: "delta",
    category: "residentiel",
  },
  {
    slug: "abb-terra-ac",
    name: "Terra AC",
    tagline: "L'excellence industrielle, chez vous.",
    description:
      "Issue du savoir-faire d'ABB dans les infrastructures de recharge rapide, la Terra AC en version résidentielle offre une fiabilité de niveau professionnel.",
    price: 950,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi_bluetooth",
    installation: "les_deux",
    brand: "abb",
    category: "professionnel",
  },
  {
    slug: "circontrol-wallbox",
    name: "eNext Wallbox",
    tagline: "Simplicité méditerranéenne.",
    description:
      "Une borne robuste et directe, sans fonctionnalités superflues, pour les foyers qui veulent avant tout une charge fiable au quotidien.",
    price: 529,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "wifi",
    installation: "les_deux",
    brand: "circontrol",
    category: "residentiel",
  },
  {
    slug: "keba-p30",
    name: "P30 x-series",
    tagline: "L'ingénierie autrichienne à son sommet.",
    description:
      "Reconnue dans toute l'Europe pour sa fiabilité en flotte, la P30 x-series équipe aussi bien les particuliers exigeants que les parkings d'entreprise.",
    price: 1190,
    powerKw: 22,
    phase: "triphase",
    connectivity: "wifi_4g",
    installation: "les_deux",
    badge: "Professionnel",
    brand: "keba",
    category: "professionnel",
  },
  {
    slug: "chargepoint-home-flex",
    name: "Home Flex",
    tagline: "S'adapte à votre installation, pas l'inverse.",
    description:
      "Puissance réglable de 16 à 50 ampères directement depuis l'application : la Home Flex s'ajuste à votre tableau électrique existant.",
    price: 749,
    powerKw: 11,
    phase: "monophase",
    connectivity: "wifi",
    installation: "les_deux",
    brand: "chargepoint",
    category: "residentiel",
  },
  {
    slug: "juicebox-40",
    name: "JuiceBox 40",
    tagline: "Un classique outre-Atlantique, verifié en Europe.",
    description:
      "Best-seller nord-américain adapté aux normes européennes, la JuiceBox 40 combine simplicité d'usage et pilotage à distance.",
    price: 639,
    powerKw: 7.4,
    phase: "monophase",
    connectivity: "wifi",
    installation: "les_deux",
    brand: "juicebox",
    category: "residentiel",
  },
];

async function main() {
  console.log("Seed — nettoyage des tables...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();

  console.log("Seed — marques et catégories...");
  for (const b of brands) {
    await prisma.brand.create({ data: b });
  }
  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  console.log("Seed — produits...");
  for (const p of products) {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: p.brand } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.category } });

    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        powerKw: p.powerKw,
        phase: p.phase,
        connectivity: p.connectivity,
        installation: p.installation,
        badge: p.badge,
        featured: p.featured ?? false,
        brandId: brand.id,
        categoryId: category.id,
        images: {
          create: [
            { url: `/images/products/${p.slug}-main.webp`, alt: `${p.name} — vue principale`, kind: "main", position: 0 },
            { url: `/images/products/${p.slug}-detail.webp`, alt: `${p.name} — détail`, kind: "detail", position: 1 },
            { url: `/images/products/${p.slug}-installation.webp`, alt: `${p.name} — installée`, kind: "installation", position: 2 },
            { url: `/images/products/${p.slug}-closeup.webp`, alt: `${p.name} — gros plan`, kind: "closeup", position: 3 },
          ],
        },
      },
    });
  }

  await prisma.coupon.create({
    data: { code: "BIENVENUE10", percentOff: 10, active: true },
  });

  console.log(`Seed terminé — ${products.length} produits créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
