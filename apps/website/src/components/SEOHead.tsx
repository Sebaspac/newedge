import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://newedgebrand.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;

const SEOHead = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  noindex = false,
}: SEOHeadProps) => {
  const location = useLocation();

  // Auto-generate canonical from current route if not explicitly provided
  const fullCanonical = canonical
    ? canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`
    : `${BASE_URL}${location.pathname === '/' ? '' : location.pathname}`;

  /* ── hreflang ────────────────────────────────────────────────────────────
     Die Website liegt zweisprachig unter denselben Slugs: DE unter "/", EN
     unter "/en". Ohne hreflang behandelt Google beide Fassungen als
     konkurrierende Duplikate statt als Sprachvarianten derselben Seite — die
     eine kann die andere aus dem Index drängen.

     Abgeleitet wird der Pfad aus dem Canonical, nicht aus location.pathname:
     Nur so stimmt die Zuordnung auch dort, wo eine Seite über mehrere Routen
     erreichbar ist (Alias-Slugs) und ihr Canonical bewusst abweicht.
     x-default zeigt auf die deutsche Fassung — das ist die Hauptsprache. */
  const pfad = fullCanonical.replace(BASE_URL, '');
  const pfadOhneSprache = pfad.replace(/^\/en(?=\/|$)/, '') || '/';
  const urlDe = `${BASE_URL}${pfadOhneSprache === '/' ? '' : pfadOhneSprache}`;
  const urlEn = `${BASE_URL}/en${pfadOhneSprache === '/' ? '' : pfadOhneSprache}`;
  const istEn = /^\/en(\/|$)/.test(pfad);

  return (
    <Helmet>
      <html lang={istEn ? 'en' : 'de'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      <link rel="alternate" hrefLang="de" href={urlDe} />
      <link rel="alternate" hrefLang="en" href={urlEn} />
      <link rel="alternate" hrefLang="x-default" href={urlDe} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content="website" />
      {/* Locale muss der tatsächlichen Sprachfassung folgen — vorher stand auf
          jeder EN-Seite de_DE, was Social-Previews falsch einordnet. */}
      <meta property="og:locale" content={istEn ? 'en_US' : 'de_DE'} />
      <meta property="og:locale:alternate" content={istEn ? 'de_DE' : 'en_US'} />
      <meta property="og:site_name" content="NEWEDGE Brand" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
    </Helmet>
  );
};

export default SEOHead;
