/**
 * Strapi-Preview-Modus (Content Manager → „Open preview").
 * --------------------------------------------------------------
 * Der Preview-Handler in Strapi öffnet die Website mit
 *   ?strapiPreview=true&status=draft|published&previewSecret=…
 * Dieses Modul erkennt die Parameter, merkt sie sich für die SPA-Navigation
 * in sessionStorage (das Preview-iframe hat eine eigene Session — der normale
 * Besucher ist nie betroffen) und reicht sie über `withCmsParams()` an alle
 * CMS-Fetches weiter. Drafts liefert Strapi nur bei gültigem Secret.
 * --------------------------------------------------------------
 */
const KEY = "ne-strapi-preview";

type PreviewState = { status: "draft" | "published"; secret: string };

function detect(): PreviewState | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("strapiPreview") === "true") {
      const state: PreviewState = {
        status: params.get("status") === "published" ? "published" : "draft",
        secret: params.get("previewSecret") ?? "",
      };
      sessionStorage.setItem(KEY, JSON.stringify(state));
      return state;
    }
    const stored = sessionStorage.getItem(KEY);
    return stored ? (JSON.parse(stored) as PreviewState) : null;
  } catch {
    return null;
  }
}

export const cmsPreview = detect();

/** Hängt im Draft-Preview die Status-/Secret-Parameter an eine CMS-URL an. */
export function withCmsParams(url: string): string {
  if (!cmsPreview || cmsPreview.status !== "draft") return url;
  const suffix = `status=draft&previewSecret=${encodeURIComponent(cmsPreview.secret)}`;
  return url + (url.includes("?") ? "&" : "?") + suffix;
}

// Im Preview-iframe: Strapi Bescheid geben + bei gespeicherten Änderungen neu laden.
if (typeof window !== "undefined" && cmsPreview && window.parent !== window) {
  window.addEventListener("message", (message: MessageEvent) => {
    if (message.data?.type === "strapiUpdate") window.location.reload();
  });
  window.parent.postMessage({ type: "previewReady" }, "*");
}
