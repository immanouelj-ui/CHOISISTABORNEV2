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
  await prisma.leadNote.deleteMany();
  await prisma.installationRequest.deleteMany();
  await prisma.localPage.deleteMany();
  await prisma.city.deleteMany();
  await prisma.department.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.contactMessage.deleteMany();

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

  console.log("Seed — départements, villes et pages locales...");

  type SeedCity = {
    name: string;
    slug: string;
    postalCode: string;
    population: number;
    title: string;
    metaDescription: string;
    intro: string;
    content: string;
    faq: { q: string; a: string }[];
  };

  type SeedDepartment = {
    code: string;
    name: string;
    slug: string;
    intro: string;
    cities: SeedCity[];
  };

  const departments: SeedDepartment[] = [
    {
      code: "69",
      name: "Rhône",
      slug: "rhone",
      intro:
        "De la Presqu'île lyonnaise aux communes de la métropole, le Rhône combine copropriétés urbaines denses et pavillons périphériques : deux réalités qui demandent des solutions d'installation différentes.",
      cities: [
        {
          name: "Lyon",
          slug: "lyon",
          postalCode: "69000",
          population: 522000,
          title: "Installation de borne de recharge à Lyon",
          metaDescription:
            "Faites installer votre borne de recharge à Lyon par un professionnel qualifié IRVE : copropriétés, maisons de la Presqu'île aux pentes de la Croix-Rousse, parkings d'entreprise.",
          intro:
            "À Lyon, la majorité des demandes concernent des installations en copropriété ou en parking souterrain partagé, où la pose d'une borne nécessite une étude préalable du tableau électrique commun.",
          content:
            "Lyon compte une part importante de logements collectifs, du 2e arrondissement jusqu'aux quartiers résidentiels de Lyon 6 ou Lyon 9. Installer une borne de recharge dans une copropriété lyonnaise implique généralement une demande formelle en assemblée générale, dans le cadre du droit à la prise, puis une étude technique du réseau électrique de l'immeuble.\n\nPour les maisons individuelles des collines de Fourvière ou de la Croix-Rousse, l'installation est souvent plus directe : une borne murale de 7,4 kW ou 11 kW suffit dans la majorité des cas pour un usage quotidien.\n\nNos installateurs partenaires interviennent sur l'ensemble de la ville et peuvent également équiper des parkings d'entreprise dans les zones d'activité de Gerland ou de la Part-Dieu.",
          faq: [
            { q: "Peut-on installer une borne dans une copropriété à Lyon ?", a: "Oui. Le droit à la prise permet à tout copropriétaire ou locataire de faire installer une borne à ses frais, sous réserve d'une notification préalable au syndic. Nos installateurs vous accompagnent dans cette démarche." },
            { q: "Quel délai pour une installation à Lyon ?", a: "Après validation de votre devis, l'intervention est généralement planifiée sous 2 à 4 semaines selon la complexité du chantier." },
          ],
        },
        {
          name: "Villeurbanne",
          slug: "villeurbanne",
          postalCode: "69100",
          population: 152000,
          title: "Installation de borne de recharge à Villeurbanne",
          metaDescription:
            "Installateur de borne de recharge qualifié IRVE à Villeurbanne : maisons, résidences récentes et entreprises du quartier Gratte-Ciel ou de la Doua.",
          intro:
            "Villeurbanne mêle grands ensembles résidentiels récents, pavillons et zones tertiaires autour de la Doua : chaque configuration appelle une solution de recharge adaptée.",
          content:
            "Les résidences récentes construites autour du Carré de Soie ou des Gratte-Ciel disposent souvent déjà de gaines techniques prêtes à recevoir une infrastructure de recharge collective, ce qui simplifie l'installation individuelle.\n\nDans les quartiers pavillonnaires, une borne extérieure de 7,4 kW à 22 kW répond à la majorité des besoins des propriétaires de véhicules électriques ou hybrides rechargeables.\n\nLes entreprises installées autour du campus de la Doua ou dans les zones d'activité peuvent également faire équiper leurs places de parking pour leurs salariés ou leur flotte.",
          faq: [
            { q: "Les nouvelles résidences de Villeurbanne sont-elles pré-équipées ?", a: "Certaines résidences récentes disposent d'infrastructures collectives facilitant le raccordement, mais chaque situation doit être vérifiée au cas par cas lors de l'étude technique." },
          ],
        },
      ],
    },
    {
      code: "38",
      name: "Isère",
      slug: "isere",
      intro:
        "Entre l'agglomération grenobloise et les vallées alpines, l'Isère présente une forte proportion de maisons individuelles avec garage, un contexte particulièrement favorable à l'installation d'une borne de recharge.",
      cities: [
        {
          name: "Grenoble",
          slug: "grenoble",
          postalCode: "38000",
          population: 158000,
          title: "Installation de borne de recharge à Grenoble",
          metaDescription:
            "Installation de borne de recharge à Grenoble et dans son agglomération : maisons avec garage, résidences et entreprises de la presqu'île scientifique.",
          intro:
            "À Grenoble, les maisons avec garage individuel représentent une part importante des demandes d'installation, avec une préférence marquée pour les bornes triphasées 11 kW ou 22 kW.",
          content:
            "L'agglomération grenobloise, encadrée par les massifs de Belledonne, de la Chartreuse et du Vercors, compte de nombreuses maisons individuelles équipées de garages fermés, un contexte idéal pour une installation intérieure rapide et peu coûteuse.\n\nDans le centre-ville et autour de la presqu'île scientifique, les immeubles plus anciens nécessitent parfois un renforcement du tableau électrique avant la pose d'une borne, notamment en copropriété.\n\nLes entreprises et laboratoires de la presqu'île peuvent par ailleurs équiper leurs parkings pour répondre aux besoins de leurs salariés et visiteurs.",
          faq: [
            { q: "Quelle puissance choisir pour une maison à Grenoble ?", a: "Pour un garage individuel avec une installation électrique standard, une borne de 7,4 kW à 11 kW couvre la plupart des besoins quotidiens de recharge." },
          ],
        },
      ],
    },
    {
      code: "13",
      name: "Bouches-du-Rhône",
      slug: "bouches-du-rhone",
      intro:
        "Entre villas avec parking privatif et grandes copropriétés du littoral, les Bouches-du-Rhône demandent une expertise particulière sur les installations extérieures exposées au climat méditerranéen.",
      cities: [
        {
          name: "Marseille",
          slug: "marseille",
          postalCode: "13000",
          population: 870000,
          title: "Installation de borne de recharge à Marseille",
          metaDescription:
            "Installateur qualifié IRVE à Marseille : villas des quartiers sud, copropriétés du centre-ville et parkings d'entreprise dans les zones d'activité.",
          intro:
            "À Marseille, les installations se répartissent entre villas avec parking privatif dans les quartiers sud et grandes copropriétés du centre-ville, chacune avec ses propres contraintes techniques.",
          content:
            "Les villas des quartiers sud ou de l'Estaque disposent le plus souvent d'un accès direct au tableau électrique, ce qui permet une installation extérieure rapide avec une borne au degré de protection IP55 adaptée au climat méditerranéen.\n\nDans le centre-ville et les grandes copropriétés du littoral, l'installation en parking souterrain commun suit la même procédure de droit à la prise qu'ailleurs en France, avec une étude préalable du réseau électrique collectif.\n\nLes zones d'activité proches de l'aéroport ou du port peuvent également faire installer des bornes pour équiper leurs flottes de véhicules professionnels.",
          faq: [
            { q: "Une borne extérieure résiste-t-elle au climat marseillais ?", a: "Les bornes que nous proposons disposent d'un indice de protection IP55 minimum, conçu pour résister à l'exposition au soleil, à la pluie et aux embruns du littoral." },
          ],
        },
      ],
    },
  ];

  for (const dept of departments) {
    const department = await prisma.department.create({
      data: {
        id: crypto.randomUUID(),
        code: dept.code,
        name: dept.name,
        slug: dept.slug,
        intro: dept.intro,
        updatedAt: new Date(),
      },
    });

    for (const city of dept.cities) {
      const cityRecord = await prisma.city.create({
        data: {
          id: crypto.randomUUID(),
          departmentId: department.id,
          name: city.name,
          slug: city.slug,
          postalCode: city.postalCode,
          population: city.population,
          updatedAt: new Date(),
        },
      });

      await prisma.localPage.create({
        data: {
          id: crypto.randomUUID(),
          cityId: cityRecord.id,
          title: city.title,
          metaDescription: city.metaDescription,
          intro: city.intro,
          content: city.content,
          faq: JSON.stringify(city.faq),
          isPublished: true,
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log("Seed — guides & conseils...");

  const posts = [
    {
      slug: "quelle-borne-de-recharge-choisir",
      title: "Quelle borne de recharge choisir ?",
      excerpt: "Puissance, connectivité, usage : les critères essentiels pour choisir la bonne borne.",
      category: "Guide d'achat",
      content:
        "Choisir une borne de recharge dépend avant tout de trois facteurs : la puissance de charge souhaitée, le type de logement et l'usage quotidien du véhicule.\n\nPour un usage résidentiel classique, une borne de 7,4 kW couvre la majorité des besoins : elle permet de recharger une batterie de taille moyenne en une nuit. Pour les gros rouleurs ou les véhicules à grande capacité de batterie, une borne 11 kW ou 22 kW réduit sensiblement le temps de charge, à condition que l'installation électrique du logement le permette.\n\nLa connectivité (Wi-Fi, application mobile, RFID) apporte un confort supplémentaire : suivi de consommation, programmation des heures creuses, gestion multi-utilisateurs. Elle n'est cependant pas indispensable pour un usage individuel simple.\n\nEnfin, pensez à vérifier la compatibilité du connecteur avec votre véhicule : la quasi-totalité des véhicules vendus en Europe utilisent aujourd'hui un connecteur Type 2.",
    },
    {
      slug: "quelle-puissance-pour-une-borne-a-domicile",
      title: "Quelle puissance pour une borne à domicile ?",
      excerpt: "3,7 kW, 7,4 kW, 11 kW ou 22 kW : comment choisir la puissance adaptée à votre logement.",
      category: "Guide technique",
      content:
        "La puissance d'une borne de recharge domestique dépend à la fois de votre installation électrique et de votre véhicule.\n\nUne installation monophasée standard permet généralement d'aller jusqu'à 7,4 kW. Pour bénéficier de 11 kW ou 22 kW, une installation triphasée est nécessaire, ce qui peut impliquer une intervention sur votre compteur électrique.\n\nCôté véhicule, la plupart des voitures électriques grand public acceptent une charge en 7,4 kW ou 11 kW en courant alternatif ; au-delà, le gain de vitesse de charge devient marginal pour beaucoup de modèles.\n\nEn pratique, une borne 7,4 kW couvre les besoins d'un usage quotidien pour la majorité des foyers, avec une recharge complète en une nuit.",
    },
    {
      slug: "prix-installation-borne-de-recharge",
      title: "Combien coûte l'installation d'une borne de recharge ?",
      excerpt: "Les facteurs qui influencent le prix d'une installation : distance, puissance, travaux annexes.",
      category: "Prix & aides",
      content:
        "Le coût d'installation d'une borne de recharge varie principalement selon trois critères : la distance entre le tableau électrique et l'emplacement de la borne, la puissance choisie, et la nécessité éventuelle de travaux complémentaires (tranchée, mise à la terre, renforcement du tableau).\n\nUne installation simple, à proximité immédiate du tableau électrique, reste la configuration la plus économique. À l'inverse, une installation nécessitant une tranchée extérieure ou un raccordement en copropriété augmente le coût de la main d'œuvre.\n\nDes aides existent pour réduire ce coût, notamment pour les installations en copropriété ou en entreprise, sous réserve d'éligibilité. Un devis personnalisé, établi après étude de votre situation, reste la meilleure façon de connaître le coût exact de votre projet.",
    },
    {
      slug: "borne-7kw-ou-11kw",
      title: "Borne 7,4 kW ou 11 kW ?",
      excerpt: "Les avantages et limites de chaque puissance pour un usage résidentiel.",
      category: "Guide technique",
      content:
        "La borne 7,4 kW reste le choix le plus répandu pour un usage résidentiel : elle est compatible avec une installation monophasée standard et permet une recharge complète en une nuit pour la plupart des véhicules.\n\nLa borne 11 kW nécessite une installation triphasée, plus coûteuse à mettre en place si elle n'existe pas déjà, mais réduit le temps de charge d'environ un tiers par rapport au 7,4 kW.\n\nPour un usage quotidien classique, la différence de confort entre les deux puissances reste limitée. Elle devient significative pour les gros rouleurs ou les foyers équipés de plusieurs véhicules électriques.",
    },
    {
      slug: "installation-borne-copropriete",
      title: "Installation d'une borne de recharge en copropriété",
      excerpt: "Le droit à la prise, l'assemblée générale et les étapes clés pour équiper votre place de parking.",
      category: "Copropriété",
      content:
        "Le droit à la prise permet à tout copropriétaire ou locataire disposant d'une place de stationnement de faire installer une borne de recharge à ses frais, sans avoir besoin d'un vote favorable en assemblée générale — le syndic ne peut s'y opposer que pour des motifs sérieux et légitimes.\n\nLa démarche commence par une notification au syndic, accompagnée d'une description technique du projet. Un professionnel qualifié IRVE réalise ensuite une étude du réseau électrique de l'immeuble avant de procéder à l'installation.\n\nPour les copropriétés souhaitant équiper plusieurs places à terme, une infrastructure collective mutualisée peut être une solution plus économique sur le long terme qu'une multiplication d'installations individuelles.",
    },
    {
      slug: "combien-de-temps-pour-recharger-une-voiture-electrique",
      title: "Combien de temps faut-il pour recharger une voiture électrique ?",
      excerpt: "Le temps de charge dépend de la puissance de la borne et de la capacité de la batterie.",
      category: "Guide technique",
      content:
        "Le temps de recharge d'une voiture électrique dépend principalement de deux facteurs : la puissance de la borne et la capacité de la batterie du véhicule.\n\nSur une prise domestique classique (2,3 kW), une charge complète peut prendre plus de 24 heures pour une batterie de taille moyenne. Sur une borne de 7,4 kW, ce temps est généralement divisé par trois. Sur une borne 11 kW ou 22 kW, la charge est encore plus rapide, à condition que le véhicule accepte cette puissance en courant alternatif.\n\nEn pratique, la plupart des usagers rechargent leur véhicule la nuit : une borne 7,4 kW suffit alors largement à restituer l'autonomie consommée dans la journée.",
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        id: crypto.randomUUID(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        metaDescription: post.excerpt,
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("Seed — FAQ...");

  const faqItems: { question: string; answer: string; category: string; order: number }[] = [
    { category: "Achat", order: 0, question: "Quels moyens de paiement acceptez-vous ?", answer: "Le paiement s'effectue en ligne de manière sécurisée par carte bancaire via Stripe." },
    { category: "Achat", order: 1, question: "Les prix affichés incluent-ils la TVA ?", answer: "Oui, tous les prix affichés sur le site sont exprimés toutes taxes comprises (TTC), sauf mention contraire pour les clients professionnels." },
    { category: "Livraison", order: 0, question: "Quels sont les délais de livraison ?", answer: "Le délai de livraison est indiqué sur chaque fiche produit et confirmé par e-mail après validation de votre commande." },
    { category: "Livraison", order: 1, question: "Puis-je suivre ma commande ?", answer: "Un numéro de suivi vous est communiqué dès l'expédition de votre commande, consultable depuis votre espace client." },
    { category: "Installation", order: 0, question: "Dois-je acheter ma borne pour demander une installation ?", answer: "Non, vous pouvez demander un devis d'installation même si vous possédez déjà votre borne : indiquez-le simplement dans le formulaire." },
    { category: "Installation", order: 1, question: "Les installateurs sont-ils qualifiés IRVE ?", answer: "Oui, notre réseau est composé exclusivement de professionnels qualifiés IRVE, seuls habilités à réaliser une installation conforme et éligible aux aides." },
    { category: "Compte", order: 0, question: "Comment suivre mes demandes d'installation ?", answer: "Votre espace client centralise vos commandes, factures et demandes d'installation avec leur statut d'avancement." },
  ];

  for (const item of faqItems) {
    await prisma.faqItem.create({
      data: {
        id: crypto.randomUUID(),
        question: item.question,
        answer: item.answer,
        category: item.category,
        order: item.order,
        updatedAt: new Date(),
      },
    });
  }

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
