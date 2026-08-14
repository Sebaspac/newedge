import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import { notFound as NOTFOUND_STATIC } from "@/content/pages/notFound";
import { notFound as notFoundEn } from "@/content/en/pages/notFound";
import { useLocalized } from "@/hooks/useLocalized";
import { LocaleLink as Link } from "@/components/LocaleLink";

const NotFound = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const notFound = useLocalized("not-found", NOTFOUND_STATIC, notFoundEn);
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F2F2" }}>
      <SEOHead title={notFound.seo.title} description={notFound.seo.description} noindex />
      <div className="text-center">
        <h1 style={{ color: "#171717" }}>{t('notFound.title')}</h1>
        <p className="mb-4" style={{ color: "#3C3C3C" }}>{t('notFound.subtitle')}</p>
        <Link to="/" className="underline" style={{ color: "#171717" }}>
          {t('notFound.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
