export type DepartmentArticle = "le" | "la" | "les" | "l";

export type DepartmentSeed = {
  slug: string;
  code: string;
  name: string;
  region: string;
  /** Article défini à utiliser devant le nom (le Rhône, la Sarthe, les Yvelines, l'Essonne). */
  article: DepartmentArticle;
};

/** "de" + article contracté : du Rhône, de la Sarthe, des Yvelines, de l'Essonne. */
export function deDepartment(dept: DepartmentSeed): string {
  if (dept.slug === "paris") return "de Paris";
  switch (dept.article) {
    case "le":
      return `du ${dept.name}`;
    case "la":
      return `de la ${dept.name}`;
    case "les":
      return `des ${dept.name}`;
    case "l":
      return `de l'${dept.name}`;
  }
}

/** "le/la/les/l'" + nom, pour une utilisation en sujet ou complément : le Rhône, les Yvelines... */
export function leDepartment(dept: DepartmentSeed): string {
  if (dept.slug === "paris") return "Paris";
  switch (dept.article) {
    case "le":
      return `le ${dept.name}`;
    case "la":
      return `la ${dept.name}`;
    case "les":
      return `les ${dept.name}`;
    case "l":
      return `l'${dept.name}`;
  }
}

/** "dans le/la/les/l'" + nom : dans le Rhône, dans les Yvelines, dans l'Essonne... */
export function dansDepartment(dept: DepartmentSeed): string {
  if (dept.slug === "paris") return "à Paris";
  switch (dept.article) {
    case "le":
      return `dans le ${dept.name}`;
    case "la":
      return `dans la ${dept.name}`;
    case "les":
      return `dans les ${dept.name}`;
    case "l":
      return `dans l'${dept.name}`;
  }
}

export type CityProfile =
  | "metropole"
  | "ville-moyenne"
  | "banlieue-dense"
  | "banlieue-pavillonnaire";

export type CitySeed = {
  slug: string;
  name: string;
  departmentSlug: string;
  population: number;
  profile: CityProfile;
};

export const DEPARTMENTS: DepartmentSeed[] = [
  { slug: "alpes-maritimes", code: "06", name: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur", article: "les" },
  { slug: "aube", code: "10", name: "Aube", region: "Grand Est", article: "l" },
  { slug: "bas-rhin", code: "67", name: "Bas-Rhin", region: "Grand Est", article: "le" },
  { slug: "bouches-du-rhone", code: "13", name: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur", article: "les" },
  { slug: "calvados", code: "14", name: "Calvados", region: "Normandie", article: "le" },
  { slug: "charente-maritime", code: "17", name: "Charente-Maritime", region: "Nouvelle-Aquitaine", article: "la" },
  { slug: "cote-d-or", code: "21", name: "Côte-d'Or", region: "Bourgogne-Franche-Comté", article: "la" },
  { slug: "doubs", code: "25", name: "Doubs", region: "Bourgogne-Franche-Comté", article: "le" },
  { slug: "drome", code: "26", name: "Drôme", region: "Auvergne-Rhône-Alpes", article: "la" },
  { slug: "essonne", code: "91", name: "Essonne", region: "Île-de-France", article: "l" },
  { slug: "finistere", code: "29", name: "Finistère", region: "Bretagne", article: "le" },
  { slug: "gard", code: "30", name: "Gard", region: "Occitanie", article: "le" },
  { slug: "gironde", code: "33", name: "Gironde", region: "Nouvelle-Aquitaine", article: "la" },
  { slug: "haut-rhin", code: "68", name: "Haut-Rhin", region: "Grand Est", article: "le" },
  { slug: "haute-garonne", code: "31", name: "Haute-Garonne", region: "Occitanie", article: "la" },
  { slug: "haute-savoie", code: "74", name: "Haute-Savoie", region: "Auvergne-Rhône-Alpes", article: "la" },
  { slug: "hauts-de-seine", code: "92", name: "Hauts-de-Seine", region: "Île-de-France", article: "les" },
  { slug: "herault", code: "34", name: "Hérault", region: "Occitanie", article: "l" },
  { slug: "ille-et-vilaine", code: "35", name: "Ille-et-Vilaine", region: "Bretagne", article: "l" },
  { slug: "indre-et-loire", code: "37", name: "Indre-et-Loire", region: "Centre-Val de Loire", article: "l" },
  { slug: "isere", code: "38", name: "Isère", region: "Auvergne-Rhône-Alpes", article: "l" },
  { slug: "loire", code: "42", name: "Loire", region: "Auvergne-Rhône-Alpes", article: "la" },
  { slug: "loire-atlantique", code: "44", name: "Loire-Atlantique", region: "Pays de la Loire", article: "la" },
  { slug: "loiret", code: "45", name: "Loiret", region: "Centre-Val de Loire", article: "le" },
  { slug: "maine-et-loire", code: "49", name: "Maine-et-Loire", region: "Pays de la Loire", article: "le" },
  { slug: "marne", code: "51", name: "Marne", region: "Grand Est", article: "la" },
  { slug: "meurthe-et-moselle", code: "54", name: "Meurthe-et-Moselle", region: "Grand Est", article: "la" },
  { slug: "morbihan", code: "56", name: "Morbihan", region: "Bretagne", article: "le" },
  { slug: "moselle", code: "57", name: "Moselle", region: "Grand Est", article: "la" },
  { slug: "nord", code: "59", name: "Nord", region: "Hauts-de-France", article: "le" },
  { slug: "paris", code: "75", name: "Paris", region: "Île-de-France", article: "le" },
  { slug: "puy-de-dome", code: "63", name: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes", article: "le" },
  { slug: "pyrenees-atlantiques", code: "64", name: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine", article: "les" },
  { slug: "pyrenees-orientales", code: "66", name: "Pyrénées-Orientales", region: "Occitanie", article: "les" },
  { slug: "rhone", code: "69", name: "Rhône", region: "Auvergne-Rhône-Alpes", article: "le" },
  { slug: "sarthe", code: "72", name: "Sarthe", region: "Pays de la Loire", article: "la" },
  { slug: "savoie", code: "73", name: "Savoie", region: "Auvergne-Rhône-Alpes", article: "la" },
  { slug: "seine-et-marne", code: "77", name: "Seine-et-Marne", region: "Île-de-France", article: "la" },
  { slug: "seine-maritime", code: "76", name: "Seine-Maritime", region: "Normandie", article: "la" },
  { slug: "seine-saint-denis", code: "93", name: "Seine-Saint-Denis", region: "Île-de-France", article: "la" },
  { slug: "somme", code: "80", name: "Somme", region: "Hauts-de-France", article: "la" },
  { slug: "val-d-oise", code: "95", name: "Val-d'Oise", region: "Île-de-France", article: "le" },
  { slug: "val-de-marne", code: "94", name: "Val-de-Marne", region: "Île-de-France", article: "le" },
  { slug: "var", code: "83", name: "Var", region: "Provence-Alpes-Côte d'Azur", article: "le" },
  { slug: "vaucluse", code: "84", name: "Vaucluse", region: "Provence-Alpes-Côte d'Azur", article: "le" },
  { slug: "yvelines", code: "78", name: "Yvelines", region: "Île-de-France", article: "les" },
];

export const CITIES: CitySeed[] = [
  { slug: "paris", name: "Paris", departmentSlug: "paris", population: 2133000, profile: "metropole" },
  { slug: "marseille", name: "Marseille", departmentSlug: "bouches-du-rhone", population: 870000, profile: "metropole" },
  { slug: "lyon", name: "Lyon", departmentSlug: "rhone", population: 522000, profile: "metropole" },
  { slug: "toulouse", name: "Toulouse", departmentSlug: "haute-garonne", population: 500000, profile: "metropole" },
  { slug: "nice", name: "Nice", departmentSlug: "alpes-maritimes", population: 342000, profile: "metropole" },
  { slug: "nantes", name: "Nantes", departmentSlug: "loire-atlantique", population: 320000, profile: "metropole" },
  { slug: "strasbourg", name: "Strasbourg", departmentSlug: "bas-rhin", population: 291000, profile: "metropole" },
  { slug: "montpellier", name: "Montpellier", departmentSlug: "herault", population: 295000, profile: "metropole" },
  { slug: "bordeaux", name: "Bordeaux", departmentSlug: "gironde", population: 260000, profile: "metropole" },
  { slug: "lille", name: "Lille", departmentSlug: "nord", population: 234000, profile: "metropole" },
  { slug: "rennes", name: "Rennes", departmentSlug: "ille-et-vilaine", population: 220000, profile: "metropole" },

  { slug: "aix-en-provence", name: "Aix-en-Provence", departmentSlug: "bouches-du-rhone", population: 145000, profile: "ville-moyenne" },
  { slug: "amiens", name: "Amiens", departmentSlug: "somme", population: 133000, profile: "ville-moyenne" },
  { slug: "angers", name: "Angers", departmentSlug: "maine-et-loire", population: 155000, profile: "ville-moyenne" },
  { slug: "annecy", name: "Annecy", departmentSlug: "haute-savoie", population: 132000, profile: "ville-moyenne" },
  { slug: "antibes", name: "Antibes", departmentSlug: "alpes-maritimes", population: 76000, profile: "ville-moyenne" },
  { slug: "avignon", name: "Avignon", departmentSlug: "vaucluse", population: 92000, profile: "ville-moyenne" },
  { slug: "bayonne", name: "Bayonne", departmentSlug: "pyrenees-atlantiques", population: 51000, profile: "ville-moyenne" },
  { slug: "besancon", name: "Besançon", departmentSlug: "doubs", population: 118000, profile: "ville-moyenne" },
  { slug: "beziers", name: "Béziers", departmentSlug: "herault", population: 78000, profile: "ville-moyenne" },
  { slug: "brest", name: "Brest", departmentSlug: "finistere", population: 139000, profile: "ville-moyenne" },
  { slug: "cagnes-sur-mer", name: "Cagnes-sur-Mer", departmentSlug: "alpes-maritimes", population: 50000, profile: "ville-moyenne" },
  { slug: "caen", name: "Caen", departmentSlug: "calvados", population: 105000, profile: "ville-moyenne" },
  { slug: "cannes", name: "Cannes", departmentSlug: "alpes-maritimes", population: 74000, profile: "ville-moyenne" },
  { slug: "chambery", name: "Chambéry", departmentSlug: "savoie", population: 61000, profile: "ville-moyenne" },
  { slug: "clermont-ferrand", name: "Clermont-Ferrand", departmentSlug: "puy-de-dome", population: 147000, profile: "ville-moyenne" },
  { slug: "colmar", name: "Colmar", departmentSlug: "haut-rhin", population: 70000, profile: "ville-moyenne" },
  { slug: "dijon", name: "Dijon", departmentSlug: "cote-d-or", population: 158000, profile: "ville-moyenne" },
  { slug: "grasse", name: "Grasse", departmentSlug: "alpes-maritimes", population: 50000, profile: "ville-moyenne" },
  { slug: "grenoble", name: "Grenoble", departmentSlug: "isere", population: 158000, profile: "ville-moyenne" },
  { slug: "la-rochelle", name: "La Rochelle", departmentSlug: "charente-maritime", population: 76000, profile: "ville-moyenne" },
  { slug: "le-cannet", name: "Le Cannet", departmentSlug: "alpes-maritimes", population: 42000, profile: "ville-moyenne" },
  { slug: "le-havre", name: "Le Havre", departmentSlug: "seine-maritime", population: 170000, profile: "ville-moyenne" },
  { slug: "le-mans", name: "Le Mans", departmentSlug: "sarthe", population: 143000, profile: "ville-moyenne" },
  { slug: "lorient", name: "Lorient", departmentSlug: "morbihan", population: 57000, profile: "ville-moyenne" },
  { slug: "mandelieu-la-napoule", name: "Mandelieu-la-Napoule", departmentSlug: "alpes-maritimes", population: 22000, profile: "ville-moyenne" },
  { slug: "menton", name: "Menton", departmentSlug: "alpes-maritimes", population: 29000, profile: "ville-moyenne" },
  { slug: "metz", name: "Metz", departmentSlug: "moselle", population: 117000, profile: "ville-moyenne" },
  { slug: "mougins", name: "Mougins", departmentSlug: "alpes-maritimes", population: 19000, profile: "ville-moyenne" },
  { slug: "mulhouse", name: "Mulhouse", departmentSlug: "haut-rhin", population: 108000, profile: "ville-moyenne" },
  { slug: "nancy", name: "Nancy", departmentSlug: "meurthe-et-moselle", population: 104000, profile: "ville-moyenne" },
  { slug: "nimes", name: "Nîmes", departmentSlug: "gard", population: 150000, profile: "ville-moyenne" },
  { slug: "orleans", name: "Orléans", departmentSlug: "loiret", population: 116000, profile: "ville-moyenne" },
  { slug: "pau", name: "Pau", departmentSlug: "pyrenees-atlantiques", population: 76000, profile: "ville-moyenne" },
  { slug: "perpignan", name: "Perpignan", departmentSlug: "pyrenees-orientales", population: 121000, profile: "ville-moyenne" },
  { slug: "quimper", name: "Quimper", departmentSlug: "finistere", population: 62000, profile: "ville-moyenne" },
  { slug: "reims", name: "Reims", departmentSlug: "marne", population: 182000, profile: "ville-moyenne" },
  { slug: "rouen", name: "Rouen", departmentSlug: "seine-maritime", population: 111000, profile: "ville-moyenne" },
  { slug: "saint-etienne", name: "Saint-Étienne", departmentSlug: "loire", population: 172000, profile: "ville-moyenne" },
  { slug: "saint-laurent-du-var", name: "Saint-Laurent-du-Var", departmentSlug: "alpes-maritimes", population: 30000, profile: "ville-moyenne" },
  { slug: "saint-raphael", name: "Saint-Raphaël", departmentSlug: "var", population: 35000, profile: "ville-moyenne" },
  { slug: "toulon", name: "Toulon", departmentSlug: "var", population: 176000, profile: "ville-moyenne" },
  { slug: "tours", name: "Tours", departmentSlug: "indre-et-loire", population: 137000, profile: "ville-moyenne" },
  { slug: "troyes", name: "Troyes", departmentSlug: "aube", population: 61000, profile: "ville-moyenne" },
  { slug: "valence", name: "Valence", departmentSlug: "drome", population: 64000, profile: "ville-moyenne" },
  { slug: "vallauris", name: "Vallauris", departmentSlug: "alpes-maritimes", population: 26000, profile: "ville-moyenne" },
  { slug: "vence", name: "Vence", departmentSlug: "alpes-maritimes", population: 19000, profile: "ville-moyenne" },
  { slug: "villeneuve-loubet", name: "Villeneuve-Loubet", departmentSlug: "alpes-maritimes", population: 16000, profile: "ville-moyenne" },
  { slug: "villeurbanne", name: "Villeurbanne", departmentSlug: "rhone", population: 152000, profile: "ville-moyenne" },

  { slug: "antony", name: "Antony", departmentSlug: "hauts-de-seine", population: 63000, profile: "banlieue-dense" },
  { slug: "asnieres-sur-seine", name: "Asnières-sur-Seine", departmentSlug: "hauts-de-seine", population: 87000, profile: "banlieue-dense" },
  { slug: "aulnay-sous-bois", name: "Aulnay-sous-Bois", departmentSlug: "seine-saint-denis", population: 86000, profile: "banlieue-dense" },
  { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", departmentSlug: "hauts-de-seine", population: 121000, profile: "banlieue-dense" },
  { slug: "choisy-le-roi", name: "Choisy-le-Roi", departmentSlug: "val-de-marne", population: 45000, profile: "banlieue-dense" },
  { slug: "clamart", name: "Clamart", departmentSlug: "hauts-de-seine", population: 53000, profile: "banlieue-dense" },
  { slug: "colombes", name: "Colombes", departmentSlug: "hauts-de-seine", population: 86000, profile: "banlieue-dense" },
  { slug: "creteil", name: "Créteil", departmentSlug: "val-de-marne", population: 92000, profile: "banlieue-dense" },
  { slug: "drancy", name: "Drancy", departmentSlug: "seine-saint-denis", population: 70000, profile: "banlieue-dense" },
  { slug: "gagny", name: "Gagny", departmentSlug: "seine-saint-denis", population: 39000, profile: "banlieue-dense" },
  { slug: "garches", name: "Garches", departmentSlug: "hauts-de-seine", population: 18000, profile: "banlieue-dense" },
  { slug: "issy-les-moulineaux", name: "Issy-les-Moulineaux", departmentSlug: "hauts-de-seine", population: 69000, profile: "banlieue-dense" },
  { slug: "ivry-sur-seine", name: "Ivry-sur-Seine", departmentSlug: "val-de-marne", population: 62000, profile: "banlieue-dense" },
  { slug: "le-perreux-sur-marne", name: "Le Perreux-sur-Marne", departmentSlug: "val-de-marne", population: 34000, profile: "banlieue-dense" },
  { slug: "le-plessis-robinson", name: "Le Plessis-Robinson", departmentSlug: "hauts-de-seine", population: 30000, profile: "banlieue-dense" },
  { slug: "le-raincy", name: "Le Raincy", departmentSlug: "seine-saint-denis", population: 14000, profile: "banlieue-dense" },
  { slug: "les-pavillons-sous-bois", name: "Les Pavillons-sous-Bois", departmentSlug: "seine-saint-denis", population: 21000, profile: "banlieue-dense" },
  { slug: "levallois-perret", name: "Levallois-Perret", departmentSlug: "hauts-de-seine", population: 66000, profile: "banlieue-dense" },
  { slug: "montreuil", name: "Montreuil", departmentSlug: "seine-saint-denis", population: 111000, profile: "banlieue-dense" },
  { slug: "montrouge", name: "Montrouge", departmentSlug: "hauts-de-seine", population: 49000, profile: "banlieue-dense" },
  { slug: "nanterre", name: "Nanterre", departmentSlug: "hauts-de-seine", population: 96000, profile: "banlieue-dense" },
  { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", departmentSlug: "hauts-de-seine", population: 61000, profile: "banlieue-dense" },
  { slug: "nogent-sur-marne", name: "Nogent-sur-Marne", departmentSlug: "val-de-marne", population: 33000, profile: "banlieue-dense" },
  { slug: "noisy-le-grand", name: "Noisy-le-Grand", departmentSlug: "seine-saint-denis", population: 69000, profile: "banlieue-dense" },
  { slug: "rueil-malmaison", name: "Rueil-Malmaison", departmentSlug: "hauts-de-seine", population: 79000, profile: "banlieue-dense" },
  { slug: "saint-denis", name: "Saint-Denis", departmentSlug: "seine-saint-denis", population: 113000, profile: "banlieue-dense" },
  { slug: "saint-maur-des-fosses", name: "Saint-Maur-des-Fossés", departmentSlug: "val-de-marne", population: 75000, profile: "banlieue-dense" },
  { slug: "sucy-en-brie", name: "Sucy-en-Brie", departmentSlug: "val-de-marne", population: 26000, profile: "banlieue-dense" },
  { slug: "vincennes", name: "Vincennes", departmentSlug: "val-de-marne", population: 49000, profile: "banlieue-dense" },
  { slug: "vitry-sur-seine", name: "Vitry-sur-Seine", departmentSlug: "val-de-marne", population: 96000, profile: "banlieue-dense" },

  { slug: "argenteuil", name: "Argenteuil", departmentSlug: "val-d-oise", population: 111000, profile: "banlieue-pavillonnaire" },
  { slug: "cergy", name: "Cergy", departmentSlug: "val-d-oise", population: 65000, profile: "banlieue-pavillonnaire" },
  { slug: "chatou", name: "Chatou", departmentSlug: "yvelines", population: 30000, profile: "banlieue-pavillonnaire" },
  { slug: "chelles", name: "Chelles", departmentSlug: "seine-et-marne", population: 55000, profile: "banlieue-pavillonnaire" },
  { slug: "cormeilles-en-parisis", name: "Cormeilles-en-Parisis", departmentSlug: "val-d-oise", population: 23000, profile: "banlieue-pavillonnaire" },
  { slug: "enghien-les-bains", name: "Enghien-les-Bains", departmentSlug: "val-d-oise", population: 12000, profile: "banlieue-pavillonnaire" },
  { slug: "ermont", name: "Ermont", departmentSlug: "val-d-oise", population: 29000, profile: "banlieue-pavillonnaire" },
  { slug: "evry-courcouronnes", name: "Évry-Courcouronnes", departmentSlug: "essonne", population: 68000, profile: "banlieue-pavillonnaire" },
  { slug: "franconville", name: "Franconville", departmentSlug: "val-d-oise", population: 36000, profile: "banlieue-pavillonnaire" },
  { slug: "le-vesinet", name: "Le Vésinet", departmentSlug: "yvelines", population: 16000, profile: "banlieue-pavillonnaire" },
  { slug: "maisons-laffitte", name: "Maisons-Laffitte", departmentSlug: "yvelines", population: 24000, profile: "banlieue-pavillonnaire" },
  { slug: "massy", name: "Massy", departmentSlug: "essonne", population: 51000, profile: "banlieue-pavillonnaire" },
  { slug: "meaux", name: "Meaux", departmentSlug: "seine-et-marne", population: 55000, profile: "banlieue-pavillonnaire" },
  { slug: "montmorency", name: "Montmorency", departmentSlug: "val-d-oise", population: 21000, profile: "banlieue-pavillonnaire" },
  { slug: "morangis", name: "Morangis", departmentSlug: "essonne", population: 12000, profile: "banlieue-pavillonnaire" },
  { slug: "poissy", name: "Poissy", departmentSlug: "yvelines", population: 38000, profile: "banlieue-pavillonnaire" },
  { slug: "pontoise", name: "Pontoise", departmentSlug: "val-d-oise", population: 31000, profile: "banlieue-pavillonnaire" },
  { slug: "saint-germain-en-laye", name: "Saint-Germain-en-Laye", departmentSlug: "yvelines", population: 45000, profile: "banlieue-pavillonnaire" },
  { slug: "saint-ouen-laumone", name: "Saint-Ouen-l'Aumône", departmentSlug: "val-d-oise", population: 24000, profile: "banlieue-pavillonnaire" },
  { slug: "sannois", name: "Sannois", departmentSlug: "val-d-oise", population: 27000, profile: "banlieue-pavillonnaire" },
  { slug: "sarcelles", name: "Sarcelles", departmentSlug: "val-d-oise", population: 59000, profile: "banlieue-pavillonnaire" },
  { slug: "sartrouville", name: "Sartrouville", departmentSlug: "yvelines", population: 53000, profile: "banlieue-pavillonnaire" },
  { slug: "taverny", name: "Taverny", departmentSlug: "val-d-oise", population: 27000, profile: "banlieue-pavillonnaire" },
  { slug: "verrieres-le-buisson", name: "Verrières-le-Buisson", departmentSlug: "essonne", population: 16000, profile: "banlieue-pavillonnaire" },
  { slug: "versailles", name: "Versailles", departmentSlug: "yvelines", population: 85000, profile: "banlieue-pavillonnaire" },
  { slug: "yerres", name: "Yerres", departmentSlug: "essonne", population: 30000, profile: "banlieue-pavillonnaire" },
];
