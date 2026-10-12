"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "ctb-cookie-consent";
export const CONSENT_EVENT = "ctb-cookie-consent-change";
const TAG_ID = "AW-18509034830";

// Charge le tag Google uniquement après acceptation des cookies de mesure d'audience.
export default function GoogleTag() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setAllowed(localStorage.getItem(STORAGE_KEY) === "accepted");
      } catch {
        setAllowed(false);
      }
    };
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${TAG_ID}');
        `}
      </Script>
    </>
  );
}
