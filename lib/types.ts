export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string;
  kind: string;
  position: number;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price: number;
  compareAtPrice: number | null;
  powerKw: number;
  phase: string;
  connectivity: string;
  installation: string;
  badge: string | null;
  featured: boolean;
  stock: number;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  images: ProductImageDTO[];
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export const connectivityLabel: Record<string, string> = {
  none: "Sans connectivité",
  wifi: "Wi-Fi",
  wifi_bluetooth: "Wi-Fi + Bluetooth",
  wifi_4g: "Wi-Fi + 4G",
};

export const installationLabel: Record<string, string> = {
  interieur: "Intérieur",
  exterieur: "Extérieur",
  les_deux: "Intérieur ou extérieur",
};

export const phaseLabel: Record<string, string> = {
  monophase: "Monophasé",
  triphase: "Triphasé",
};
