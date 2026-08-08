import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/utils/localePath";

/**
 * Drop-in-Ersatz für react-router `<Link>`: präfixt interne String-`to`-Pfade
 * sprachrichtig mit `/en`. Anker/externe/Objekt-`to` bleiben unberührt.
 * Verwendung: `import { LocaleLink as Link } from "@/components/LocaleLink";`
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink(
  { to, ...rest },
  ref,
) {
  const { language } = useLanguage();
  const localized = typeof to === "string" ? localizePath(to, language) : to;
  return <Link ref={ref} to={localized} {...rest} />;
});
