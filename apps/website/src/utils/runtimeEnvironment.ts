export const isEmbeddedIframe = () => {
  if (typeof window === "undefined") return false;

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export const shouldDisableHeavyPreviewEffects = () => isEmbeddedIframe();
