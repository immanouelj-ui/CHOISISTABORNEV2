export const SHOWCASE_IMAGES = [
  "/images/gallery/detail-install.webp",
  "/images/products/delta-ac-mini-installation.webp",
  "/images/products/wallbox-copper-sb-installation.webp",
  "/images/products/juicebox-40-installation.webp",
  "/images/products/abb-terra-ac-main.webp",
  "/images/products/schneider-evlink-closeup.webp",
  "/images/products/keba-p30-detail.jpg",
  "/images/products/hager-witty-closeup.webp",
  "/images/products/easee-one-main.webp",
  "/images/products/myenergi-zappi-closeup.webp",
  "/images/products/circontrol-wallbox-main.webp",
  "/images/products/legrand-green-up-detail.webp",
  "/images/products/zaptec-go-2-main.webp",
  "/images/products/webasto-pure-2-main.webp",
];

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Choisit une image de mise en avant de façon déterministe à partir d'un slug,
 * pour varier les visuels d'une page à l'autre (villes, départements, guides)
 * sans dupliquer systématiquement la même image.
 */
export function pickShowcaseImage(seed: string): string {
  return SHOWCASE_IMAGES[hashString(seed) % SHOWCASE_IMAGES.length];
}
