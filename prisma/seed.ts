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
    description: "La Pulsar Max concentre 22 kW de puissance dans un boîtier compact. Pensée pour un usage quotidien silencieux, elle ajuste automatiquement la charge selon la capacité de votre installation électrique.",
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
    description: "Habillage premium et gestion fine de la puissance jusqu'à 22 kW.",
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
    description: "Étanche et conçue pour l'extérieur, la Go 2 combine robustesse et pilotage intelligent via application.",
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
    description: "Design modulaire et câble amovible pour s'adapter aux différents besoins de recharge.",
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
    description: "La Zappi priorise automatiquement l'énergie produite sur site avant de puiser sur le réseau.",
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
    description: "Sobre et fiable, la Pure II délivre une charge stable en 7,4 kW.",
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
    description: "Une borne pensée pour les installations résidentielles exigeantes.",
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
    description: "Montage rapide et câblage simplifié pour réduire le temps d'installation.",
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
    description: "Une borne qui s'intègre discrètement aux façades et installations résidentielles.",
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
    tagline: "Le format compact.",
    description: "Une borne compacte pour garage et stationnement résidentiel.",
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
    description: "Une solution résidentielle issue du savoir-faire industriel d'ABB.",
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
    tagline: "Simplicité et robustesse.",
    description: "Une borne robuste et directe pour une charge fiable au quotidien.",
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
    description: "Une borne conçue pour les particuliers exigeants et les parkings d'entreprise.",
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
    tagline: "S'adapte à votre installation.",
    description: "Une puissance réglable pour s'adapter à votre tableau électrique existant.",
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
    tagline: "Un classique outre-Atlantique, adapté à l'Europe.",
    description: "Une borne simple à utiliser avec pilotage à distance.",
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

  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();

  console.log("Seed — marques et catégories...");

  for (const b of brands) {
    await prisma.brand.create({
      data: {
        id: crypto.randomUUID(),
        name: b.name,
        slug: b.slug,
        updatedAt: new Date(),
      },
    });
  }

  for (const c of categories) {
    await prisma.category.create({
      data: {
        id: crypto.randomUUID(),
        name: c.name,
        slug: c.slug,
        updatedAt: new Date(),
      },
    });
  }

  console.log("Seed — produits...");

  for (const p of products) {
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: p.brand },
    });
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: p.category },
    });

    const productId = crypto.randomUUID();

    await prisma.product.create({
      data: {
        id: productId,
        reference: p.slug.toUpperCase().replace(/-/g, "_"),
        sku: `CT-${p.slug.toUpperCase().replace(/-/g, "-")}`,
        slug: p.slug,
        name: p.name,
        brandId: brand.id,
        categoryId: category.id,
        shortDescription: p.tagline,
        description: p.description,
        priceHT: Number((p.price / 1.2).toFixed(2)),
        priceTTC: p.price,
        vatRate: 20,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: 25,
        inStock: true,
        leadTimeDays: 2,
        powerKw: p.powerKw,
        phaseType: p.phase === "monophase" ? "MONO" : "TRI",
        connectorType: "T2S",
        hasDynamicLoad: false,
        hasSolarMode: p.connectivity !== "none" && p.slug.includes("zappi"),
        hasWifi: p.connectivity === "wifi" || p.connectivity === "wifi_bluetooth" || p.connectivity === "wifi_4g",
        hasRfid: false,
        has4G: p.connectivity === "wifi_4g",
        isFeatured: p.featured ?? false,
        isBestSeller: p.badge === "Meilleure vente",
        isActive: true,
        isAdvenirEligible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: {
          create: [
            {
              id: crypto.randomUUID(),
              url: `/images/products/${p.slug}-main.webp`,
              alt: `${p.name} — vue principale`,
              isPrimary: true,
              order: 0,
              createdAt: new Date(),
            },
            {
              id: crypto.randomUUID(),
              url: `/images/products/${p.slug}-detail.webp`,
              alt: `${p.name} — détail`,
              isPrimary: false,
              order: 1,
              createdAt: new Date(),
            },
            {
              id: crypto.randomUUID(),
              url: `/images/products/${p.slug}-installation.webp`,
              alt: `${p.name} — installée`,
              isPrimary: false,
              order: 2,
              createdAt: new Date(),
            },
            {
              id: crypto.randomUUID(),
              url: `/images/products/${p.slug}-closeup.webp`,
              alt: `${p.name} — gros plan`,
              isPrimary: false,
              order: 3,
              createdAt: new Date(),
            },
          ],
        },
      },
    });
  }

  await prisma.coupon.create({
    data: {
      id: crypto.randomUUID(),
      code: "BIENVENUE10",
      description: "10% de réduction de bienvenue",
      discountType: "PERCENT",
      value: 10,
      minSpend: 0,
      isActive: true,
      validFrom: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Seed terminé — ${products.length} produits créés.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
