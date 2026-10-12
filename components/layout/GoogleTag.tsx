"use client";

import { useEffect } from "react";

const STORAGE_KEY = "ctb-cookie-consent";
export const CONSENT_EVENT = "ctb-cookie-consent-change";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Le tag Google est chargé dans le layout avec le consentement refusé par défaut
// (Consent Mode v2). Ce composant passe le consentement à "granted" après acceptation.
export default function GoogleTag() {
  useEffect(() => {
    const sync = () => {
      let accepted = false;
      try {
        accepted = localStorage.getItem(STORAGE_KEY) === "accepted";
      } catch {
        accepted = false;
      }
      if (accepted && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        });
      }
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  return null;
}
