import {
  CITIES,
  DEPARTMENTS,
  deDepartment,
  dansDepartment,
  leDepartment,
  type CitySeed,
  type CityProfile,
  type DepartmentSeed,
} from "./geo-data";

// Simple hash déterministe pour choisir une variante de texte par ville,
// afin que deux villes du même profil ne produisent jamais exactement
// le même texte, sans dépendre d'un aléa non reproductible.
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(items: T[], slug: string, salt: string): T {
  const h = hashSlug(slug + salt);
  return items[h % items.length];
}

function formatPopulation(n: number): string {
  return n.toLocaleString("fr-FR").replace(/ /g, " ");
}

function neighbors(city: CitySeed): CitySeed[] {
  return CITIES.filter((c) => c.departmentSlug === city.departmentSlug && c.slug !== city.slug);
}

type IntroFn = (name: string, pop: string, dept: DepartmentSeed) => string;

const INTROS: Record<CityProfile, IntroFn[]> = {
  metropole: [
    (name, pop) =>
      `${name} compte parmi les plus grandes villes de France, avec environ ${pop} habitants. La densité du parc automobile électrique y augmente rapidement, portée par les zones à faibles émissions et le renouvellement du parc de véhicules d'entreprise.`,
    (name, pop) =>
      `Avec près de ${pop} habitants, ${name} concentre à la fois des copropriétés urbaines, des parkings d'entreprise et des zones pavillonnaires en périphérie : les besoins d'installation d'une borne de recharge y varient fortement selon le quartier.`,
  ],
  "ville-moyenne": [
    (name, pop) =>
      `${name} et son agglomération réunissent environ ${pop} habitants. La ville combine un centre historique dense et des quartiers résidentiels plus récents, avec des maisons individuelles disposant souvent d'un garage ou d'un accès direct au tableau électrique.`,
    (name, pop) =>
      `Ville moyenne d'environ ${pop} habitants, ${name} voit le nombre de véhicules électriques et hybrides rechargeables progresser chaque année, aussi bien chez les particuliers que dans les entreprises locales.`,
  ],
  "banlieue-dense": [
    (name, pop, dept) =>
      `${name}, ${dansDepartment(dept)}, est une commune de la proche périphérie parisienne d'environ ${pop} habitants. L'habitat y est majoritairement collectif, avec de nombreuses copropriétés et parkings souterrains partagés.`,
    (name, pop, dept) =>
      `Commune ${deDepartment(dept)} d'environ ${pop} habitants, ${name} fait partie de la première couronne parisienne. La proportion importante d'immeubles et de résidences avec parking commun y rend l'installation d'une borne de recharge plus encadrée qu'en maison individuelle.`,
  ],
  "banlieue-pavillonnaire": [
    (name, pop, dept) =>
      `${name}, commune ${deDepartment(dept)} d'environ ${pop} habitants, appartient à la grande couronne parisienne. Le tissu pavillonnaire y est important, avec de nombreuses maisons individuelles disposant d'un garage ou d'une allée privative.`,
    (name, pop, dept) =>
      `Avec environ ${pop} habitants, ${name} se situe ${dansDepartment(dept)}, en grande couronne parisienne. Les maisons avec garage y sont fréquentes, ce qui facilite généralement l'installation d'une borne de recharge à domicile.`,
  ],
};

const HOUSING_PARAGRAPHS: Record<CityProfile, string[]> = {
  metropole: [
    "Dans les quartiers d'immeubles anciens, l'installation d'une borne de recharge en copropriété suit la procédure du droit à la prise : une notification au syndic suffit, sous réserve d'une étude technique du réseau électrique commun. Dans les quartiers pavillonnaires en périphérie, une borne murale de 7,4 kW à 11 kW couvre la majorité des besoins.",
    "Les entreprises et zones d'activité de l'agglomération font également appel à des installateurs qualifiés pour équiper leurs parkings, notamment lorsque plusieurs salariés utilisent un véhicule électrique ou hybride rechargeable au quotidien.",
  ],
  "ville-moyenne": [
    "La majorité des demandes concerne des maisons individuelles équipées d'un garage fermé ou d'un accès extérieur au tableau électrique, ce qui permet une installation rapide d'une borne murale de 7,4 kW ou 11 kW.",
    "Dans le centre-ville, les immeubles plus anciens nécessitent parfois un renforcement du tableau électrique avant la pose d'une borne, notamment lorsque l'installation date de plusieurs décennies.",
  ],
  "banlieue-dense": [
    "L'installation d'une borne de recharge en copropriété y suit le droit à la prise : une notification écrite au syndic, puis une étude technique du réseau électrique de l'immeuble avant la pose. Le délai dépend surtout de la disponibilité de puissance sur le tableau général.",
    "Pour les quelques maisons individuelles de la commune, une borne extérieure ou murale de 7,4 kW à 11 kW répond généralement aux besoins d'un usage quotidien.",
  ],
  "banlieue-pavillonnaire": [
    "La majorité des installations concerne des maisons individuelles avec garage ou allée privative, où une borne de 7,4 kW à 11 kW peut être posée rapidement, sans procédure de copropriété.",
    "Pour les quelques résidences collectives de la commune, l'installation suit le droit à la prise, avec une notification préalable au syndic et une étude du réseau électrique de l'immeuble.",
  ],
};

const CLOSINGS: Record<CityProfile, string[]> = {
  metropole: [
    "Nos installateurs partenaires qualifiés IRVE interviennent sur l'ensemble de l'agglomération, pour les particuliers comme pour les professionnels.",
    "Que votre projet concerne un logement individuel, une copropriété ou un parking d'entreprise, un installateur qualifié IRVE de notre réseau peut intervenir sur place après étude de votre demande.",
  ],
  "ville-moyenne": [
    "Nos installateurs partenaires qualifiés IRVE interviennent dans toute la commune et les environs, pour les maisons individuelles comme pour les professionnels locaux.",
    "Un installateur qualifié IRVE de notre réseau étudie votre demande et vous propose un devis adapté à votre logement, que vous soyez en maison ou en appartement.",
  ],
  "banlieue-dense": [
    "Nos installateurs partenaires qualifiés IRVE connaissent bien les procédures de copropriété de la région parisienne et vous accompagnent à chaque étape.",
    "Un installateur qualifié IRVE de notre réseau peut intervenir rapidement, que votre place de stationnement soit en sous-sol ou en extérieur.",
  ],
  "banlieue-pavillonnaire": [
    "Nos installateurs partenaires qualifiés IRVE interviennent dans toute la commune, aussi bien pour les maisons individuelles que pour les quelques résidences collectives.",
    "Un installateur qualifié IRVE de notre réseau étudie votre demande et vous propose une intervention rapide, sans démarche de copropriété dans la plupart des cas.",
  ],
};

type FaqPair = { q: string; a: string };

function faqPool(city: CitySeed, dept: DepartmentSeed): FaqPair[] {
  const isIdf = city.profile === "banlieue-dense" || city.profile === "banlieue-pavillonnaire";
  return [
    {
      q: `Quel est le délai moyen pour une installation à ${city.name} ?`,
      a: `Après validation de votre devis, l'intervention est généralement planifiée sous 2 à 4 semaines, selon la disponibilité de l'installateur et la complexité du chantier.`,
    },
    {
      q: `Faut-il l'accord de la copropriété pour installer une borne à ${city.name} ?`,
      a: isIdf
        ? `En appartement, le droit à la prise permet d'installer une borne à vos frais sans vote en assemblée générale : une simple notification au syndic suffit, sauf opposition motivée.`
        : `En maison individuelle, aucune autorisation n'est nécessaire. En copropriété, le droit à la prise s'applique : une notification au syndic suffit dans la majorité des cas.`,
    },
    {
      q: `Quelle puissance de borne choisir à ${city.name} ?`,
      a: `Une borne de 7,4 kW convient à la majorité des usages quotidiens. Une puissance de 11 kW ou 22 kW peut être envisagée pour les gros rouleurs, sous réserve d'une installation électrique compatible.`,
    },
    {
      q: `Les installateurs intervenant à ${city.name} sont-ils qualifiés IRVE ?`,
      a: `Oui, notre réseau ne travaille qu'avec des professionnels qualifiés IRVE, seuls habilités à réaliser une installation conforme aux normes électriques en vigueur.`,
    },
    {
      q: `Peut-on demander une installation ailleurs ${dansDepartment(dept)} ?`,
      a: `Oui, nos installateurs partenaires interviennent dans l'ensemble ${deDepartment(dept)}, au-delà de la seule commune de ${city.name}.`,
    },
  ];
}

export type GeneratedLocalPage = {
  citySlug: string;
  departmentSlug: string;
  title: string;
  metaDescription: string;
  intro: string;
  content: string;
  faq: FaqPair[];
};

export function generateLocalPage(city: CitySeed): GeneratedLocalPage {
  const dept = DEPARTMENTS.find((d) => d.slug === city.departmentSlug)!;
  const pop = formatPopulation(city.population);

  const introFn = pick(INTROS[city.profile], city.slug, "intro");
  const intro = introFn(city.name, pop, dept);

  const housing = pick(HOUSING_PARAGRAPHS[city.profile], city.slug, "housing");
  const closing = pick(CLOSINGS[city.profile], city.slug, "closing");

  const nearby = neighbors(city).slice(0, 3);
  const nearbyMention =
    nearby.length > 0
      ? `Nos installateurs interviennent également dans les communes voisines telles que ${nearby.map((c) => c.name).join(", ")}.`
      : "";

  const content = [housing, [closing, nearbyMention].filter(Boolean).join(" ")].join("\n\n");

  const title = `Installation de borne de recharge à ${city.name}`;
  const metaDescription = `Faites installer votre borne de recharge à ${city.name} (${dept.name}) par un professionnel qualifié IRVE. Devis gratuit, intervention rapide, sans engagement.`;

  const faq = pickFaq(city, dept);

  return { citySlug: city.slug, departmentSlug: city.departmentSlug, title, metaDescription, intro, content, faq };
}

function pickFaq(city: CitySeed, dept: DepartmentSeed): FaqPair[] {
  const pool = faqPool(city, dept);
  const h = hashSlug(city.slug + "faq");
  // Toujours inclure les 2 questions génériques les plus utiles, puis 2 questions
  // tirées du reste du pool selon la ville pour varier la composition.
  const always = [pool[0], pool[3]];
  const rest = [pool[1], pool[2], pool[4]];
  const rotated = [...rest.slice(h % rest.length), ...rest.slice(0, h % rest.length)];
  return [always[0], rotated[0], rotated[1], always[1]];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateDepartmentIntro(deptSlug: string): string {
  const dept = DEPARTMENTS.find((d) => d.slug === deptSlug)!;
  const cities = CITIES.filter((c) => c.departmentSlug === deptSlug);
  const biggest = [...cities].sort((a, b) => b.population - a.population)[0];
  const plural = dept.article === "les";
  const variants = [
    `${capitalize(leDepartment(dept))} (${dept.region}) ${plural ? "réunissent" : "réunit"} ${cities.length} commune${cities.length > 1 ? "s" : ""} couverte${cities.length > 1 ? "s" : ""} par notre réseau d'installateurs, dont ${biggest.name}, la plus peuplée avec environ ${formatPopulation(biggest.population)} habitants.`,
    `En région ${dept.region}, ${leDepartment(dept)} ${plural ? "font" : "fait"} partie de nos zones d'intervention ${cities.length > 1 ? `sur ${cities.length} communes` : "avec une commune couverte"}, avec des besoins d'installation qui varient entre habitat individuel et collectif selon les secteurs.`,
  ];
  return pick(variants, deptSlug, "dept-intro");
}
