// Compte Uploadcare partagé avec irvohm.fr (même CRM, même flux de pièces jointes).
// La clé publique est sans risque à exposer côté client : c'est le mécanisme
// prévu par Uploadcare pour l'upload direct depuis le navigateur.
export const UPLOADCARE_PUBLIC_KEY = "482ddcbf9c71fdf5fd89";
export const UPLOADCARE_CDN_BASE = "https://2cbbtu0mnx.ucarecd.net/";

/**
 * Uploade un fichier directement depuis le navigateur vers Uploadcare et
 * retourne son URL CDN publique, à transmettre au CRM (champ "photos").
 */
export async function uploadFileToUploadcare(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
  formData.append("UPLOADCARE_STORE", "1");
  formData.append("file", file);

  const response = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);
  if (!data?.file) return null;
  return `${UPLOADCARE_CDN_BASE}${data.file}/${file.name}`;
}
