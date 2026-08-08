import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { structuredData as structuredDataStatic } from "@/content/sections/structuredData";
import { structuredData as structuredDataEn } from "@/content/en/sections/structuredData";
import { useLocalizedStatic } from "@/hooks/useLocalized";

const StructuredData = () => {
  const structuredData = useLocalizedStatic(structuredDataStatic, structuredDataEn);
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const currentPath = location.pathname;

  const org = structuredData.organization;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": "https://newedgebrand.com/#organization",
    "name": org.name,
    "alternateName": org.alternateName,
    "url": org.url,
    "logo": org.logo,
    "description": org.description,
    "foundingLocation": org.foundingLocation,
    "knowsAbout": org.knowsAbout,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": org.address.addressLocality,
      "addressRegion": org.address.addressRegion,
      "addressCountry": org.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.1351,
      "longitude": 11.5820
    },
    "areaServed": org.areaServed.map((area) => ({ "@type": area.type, "name": area.name })),
    "email": org.email,
    "sameAs": org.sameAs,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": org.offerCatalogName,
      "itemListElement": org.offerCatalogs.map((catalog) => ({
        "@type": "OfferCatalog",
        "name": catalog.name,
        "itemListElement": catalog.services.map((service) => ({
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": service.name, "description": service.description }
        }))
      }))
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://newedgebrand.com/#website",
    "url": structuredData.website.url,
    "name": structuredData.website.name,
    "description": structuredData.website.description,
    "publisher": { "@id": "https://newedgebrand.com/#organization" },
    "inLanguage": structuredData.website.inLanguage
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": structuredData.faq.map((entry) => ({
      "@type": "Question",
      "name": entry.question,
      "acceptedAnswer": { "@type": "Answer", "text": entry.answer }
    }))
  };

  // Page-specific Service schemas
  const serviceSchemas: Record<string, object> = Object.fromEntries(
    Object.entries(structuredData.serviceSchemas).map(([path, service]) => [
      path,
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `https://newedgebrand.com${path}/#service`,
        "name": service.name,
        "description": service.description,
        "provider": { "@id": "https://newedgebrand.com/#organization" },
        "areaServed": { "@type": "Country", "name": "Deutschland" },
        "serviceType": service.serviceType,
        "category": service.category,
        "offers": {
          "@type": "Offer",
          "priceCurrency": service.offer.priceCurrency,
          "price": service.offer.price,
          "description": service.offer.description,
          "eligibleRegion": { "@type": "Country", "name": "Deutschland" }
        }
      }
    ])
  );

  const currentServiceSchema = serviceSchemas[currentPath];

  // react-helmet-async rendert nur das erste <script>-Child (organizationSchema);
  // die fragment-/conditional-gewrappten WebSite/FAQ/Service-Schemas verwirft es.
  // Diese hier zuverlässig per document.head injizieren — der <Helmet> unten bleibt
  // bewusst unangetastet (rendert organizationSchema UND hält react-helmet aktiv,
  // damit SEOHead-Tags lazy-geladener Seiten greifen).
  useEffect(() => {
    const extra = [
      ...(isHomepage ? [websiteSchema, faqSchema] : []),
      ...(currentServiceSchema ? [currentServiceSchema] : []),
    ];
    const nodes = extra.map((schema) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-structured-data', '');
      el.text = JSON.stringify(schema);
      document.head.appendChild(el);
      return el;
    });
    return () => nodes.forEach((node) => node.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {isHomepage && (
        <>
          <script type="application/ld+json">
            {JSON.stringify(websiteSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </>
      )}
      {currentServiceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(currentServiceSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default StructuredData;
