import { useEffect, useState } from "react";
import { setImageOverrides } from "@/content/assets";
import { withCmsParams } from "@/utils/cmsPreview";

/**
 * „Bild austauschen" — Bilder aus dem CMS statt aus der Registry.
 * --------------------------------------------------------------
 * Lädt einmalig die Collection `image-override` (ein Eintrag pro Bild der
 * Website, siehe src/content/assets.ts) und meldet alle Einträge MIT
 * hochgeladener Datei an `img()`. Danach liefert `img("<key>")` überall die
 * CMS-Datei statt des eingebauten Bilds — ohne Code-Änderung, ohne Deploy.
 *
 * Ohne VITE_STRAPI_URL oder bei Fehler passiert nichts: die eingebauten
 * Bilder bleiben. Der Hook wird EINMAL in App.tsx aufgerufen; sein Rückgabe-
 * wert (Version) erzwingt einen Re-Render, sobald die Karte steht — `img()`
 * ist eine reine Funktion und kann sich nicht selbst aktualisieren.
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

interface OverrideRow {
  imageKey?: string;
  file?: { url?: string } | null;
}

let loaded = false;

export function useImageOverrides(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (loaded || !STRAPI_URL) return;
    loaded = true; // nur ein Versuch pro Seitenaufruf
    let alive = true;

    fetch(withCmsParams(`${STRAPI_URL}/api/image-overrides?populate=file&pagination[pageSize]=500`))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => {
        const rows: OverrideRow[] = Array.isArray(json?.data) ? json.data : [];
        const map: Record<string, string> = {};
        for (const row of rows) {
          const url = row?.file?.url;
          if (!row?.imageKey || !url) continue; // ohne Upload bleibt das eingebaute Bild
          map[row.imageKey] = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
        }
        if (!alive || Object.keys(map).length === 0) return;
        setImageOverrides(map);
        setVersion((v) => v + 1); // Re-Render, damit img() neu ausgewertet wird
      })
      .catch(() => {
        /* CMS aus oder nicht erreichbar → eingebaute Bilder bleiben */
      });

    return () => {
      alive = false;
    };
  }, []);

  return version;
}
