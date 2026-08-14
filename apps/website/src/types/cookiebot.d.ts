/**
 * Cookiebot (Usercentrics) — global bereitgestellt vom Skript-Tag in index.html.
 * Nur die Felder, die wir tatsächlich benutzen.
 */
export {};

declare global {
  interface Window {
    Cookiebot?: {
      consent?: { statistics?: boolean; marketing?: boolean };
      /** Öffnet das Banner erneut, damit die Einwilligung geändert/widerrufen werden kann. */
      renew?: () => void;
    };
  }
}
