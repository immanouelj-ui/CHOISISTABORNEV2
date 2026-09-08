// Compte Uploadcare partagé avec irvohm.fr (même CRM, même flux de pièces jointes).
// La clé publique est sans risque à exposer côté client : c'est le mécanisme
// prévu par Uploadcare pour l'upload direct depuis le navigateur.
export const UPLOADCARE_PUBLIC_KEY = "482ddcbf9c71fdf5fd89";
export const UPLOADCARE_CDN_BASE = "https://2cbbtu0mnx.ucarecd.net/";

const UPLOAD_TIMEOUT_MS = 20_000;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Redimensionne une image côté navigateur avant envoi : une photo prise avec
 * un téléphone peut peser plusieurs Mo, ce qui rend l'upload très long (voire
 * bloqué) sur un réseau mobile. Retombe silencieusement sur le fichier
 * d'origine si le redimensionnement échoue (format non supporté, etc.).
 */
async function resizeImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale >= 1) {
      bitmap.close();
      return file;
    }
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/**
 * Uploade un fichier directement depuis le navigateur vers Uploadcare et
 * retourne son URL CDN publique, à transmettre au CRM (champ "photos").
 * Borné dans le temps : une connexion mobile lente ne doit jamais bloquer
 * indéfiniment l'envoi du formulaire.
 */
export async function uploadFileToUploadcare(file: File): Promise<string | null> {
  const resized = await resizeImageFile(file);

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
  formData.append("UPLOADCARE_STORE", "1");
  formData.append("file", resized);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!data?.file) return null;
    return `${UPLOADCARE_CDN_BASE}${data.file}/${resized.name}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Uploade plusieurs fichiers en parallèle (par petits lots, pour ne pas
 * saturer une connexion mobile) et retourne les URLs des envois réussis.
 * Un fichier en échec ou trop lent n'empêche jamais les autres d'aboutir.
 */
export async function uploadFilesToUploadcare(files: File[], concurrency = 3): Promise<string[]> {
  const results: (string | null)[] = new Array(files.length).fill(null);
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const index = cursor++;
      results[index] = await uploadFileToUploadcare(files[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, worker));
  return results.filter((url): url is string => Boolean(url));
}
