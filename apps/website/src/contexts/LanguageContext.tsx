import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGetItem, safeLocalStorage, safeSetItem } from "@/utils/safeStorage";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  de: {
    // Navigation
    "nav.services": "Services",
    "nav.media": "Media",
    "nav.studio": "Studio",
    "nav.lab": "Lab",
    "nav.team": "Unser Team",
    "nav.home": "Start",

    // Common
    "common.learnMore": "Mehr erfahren",
    "common.getStarted": "Loslegen",
    "common.contact": "Kontakt",
    "common.backToHome": "Zurück zur Startseite",
    "common.discussProject": "Projekt besprechen",
    "common.startProject": "Projekt starten",
    "common.exploreServices": "Services erkunden",

    // Homepage
    "home.hero.title": "NEWEDGE",
    "home.hero.subtitle": "For strategy. aesthetics.\n& tech.",
    "home.hero.description":
      "Wir helfen Marken, sichtbar zu werden, Prozesse zu automatisieren – und den Wandel durch Innovation aktiv zu gestalten.",
    "home.hero.descriptionSecond": "Von strategischer Beratung bis hin zu cutting-edge Technologie.",
    "home.about.title": "Über uns",
    "home.about.description":
      "NEWEDGE ist ein kreatives Tech-Studio, das sich auf innovative digitale Lösungen spezialisiert hat. Wir verbinden strategisches Denken mit ästhetischem Design und modernster Technologie.",
    "home.services.title": "Unsere Services",
    "home.contact.title": "Bereit durchzustarten?",
    "home.contact.description":
      "Lassen Sie uns über Ihr nächstes Projekt sprechen und gemeinsam etwas Außergewöhnliches schaffen.",

    // Services
    "services.hero.title": "NEW EDGE SERVICES",
    "services.hero.subtitle": "For strategy. aesthetics. & tech.",
    "services.hero.description":
      "Umfassende digitale Lösungen, die Strategie, Design und Technologie nahtlos verbinden. Wir entwickeln maßgeschneiderte Ansätze für Ihre einzigartigen Herausforderungen.",
    "services.keyActivities": "Key Activities",
    "services.strategy.title": "Strategic Consulting",
    "services.strategy.description":
      "Digitale Transformation und strategische Beratung für nachhaltige Geschäftserfolge.",
    "services.design.title": "Creative Design",
    "services.design.description": "Ästhetische Lösungen, die Ihre Marke zum Leben erwecken und Nutzer begeistern.",
    "services.development.title": "Tech Development",
    "services.development.description": "Modernste Technologielösungen für komplexe digitale Herausforderungen.",
    "services.cta.title": "Bereit für Ihr nächstes Projekt?",
    "services.cta.description":
      "Lassen Sie uns gemeinsam innovative Lösungen entwickeln, die Ihr Unternehmen voranbringen.",

    // Media
    "media.hero.title": "NEW EDGE MEDIA",
    "media.hero.subtitle": "For strategy. aesthetics. & tech.",
    "media.hero.description":
      "Kreative Medienproduktion, die Geschichten erzählt und Emotionen weckt. Von Konzept bis zur finalen Umsetzung.",
    "media.services.title": "Media Services",
    "media.video.title": "Video Production",
    "media.video.description": "Professionelle Videoproduktion für alle Ihre Kommunikationsbedürfnisse.",
    "media.photography.title": "Photography",
    "media.photography.description": "Hochwertige Fotografie, die Ihre Marke perfekt in Szene setzt.",
    "media.animation.title": "Animation & Motion",
    "media.animation.description": "Dynamische Animationen und Motion Graphics für maximale Aufmerksamkeit.",
    "media.branding.title": "Brand Identity",
    "media.branding.description": "Ganzheitliche Markenentwicklung für einen starken und einprägsamen Auftritt.",
    "media.cta.title": "Bereit für Ihre Medienproduktion?",
    "media.cta.description": "Lassen Sie uns gemeinsam kreative Inhalte entwickeln, die Ihre Zielgruppe begeistern.",

    // Studio
    "studio.hero.title": "NEW EDGE STUDIO",
    "studio.hero.subtitle": "For strategy. aesthetics. & tech.",
    "studio.hero.description":
      "Unser kreatives Zentrum, wo Ideen Form annehmen. Hier entstehen innovative Designs und durchdachte Benutzererfahrungen, die Ihre Marke zum Leben erwecken.",
    "studio.services.title": "Studio Services",
    "studio.ux.title": "UX/UI Design",
    "studio.ux.description": "Intuitive Benutzererfahrungen, die Ihre Nutzer begeistern und Ihre Ziele erreichen.",
    "studio.web.title": "Web Design",
    "studio.web.description": "Moderne Webdesigns, die responsive und performant auf allen Geräten funktionieren.",
    "studio.app.title": "App Design",
    "studio.app.description": "Mobile-first Designs für iOS und Android mit fokus auf Usability.",
    "studio.systems.title": "Design Systems",
    "studio.systems.description": "Skalierbare Design-Systeme für konsistente Markenerlebnisse.",
    "studio.cta.title": "Bereit für außergewöhnliches Design?",
    "studio.cta.description": "Lassen Sie uns gemeinsam Designs entwickeln, die Ihre Nutzer begeistern.",

    // Lab
    "lab.hero.title": "NEWEDGE Lab",
    "lab.hero.subtitle": "For strategy. aesthetics. & tech.",
    "lab.hero.description":
      "Unser Experimentierfeld für cutting-edge Technologien. Hier erforschen wir die Zukunft der digitalen Innovation und entwickeln bahnbrechende Lösungen.",
    "lab.services.title": "Lab Services",
    "lab.ai.title": "AI Solutions",
    "lab.ai.description": "Intelligente Automatisierung und KI-gestützte Lösungen für komplexe Herausforderungen.",
    "lab.blockchain.title": "Blockchain Development",
    "lab.blockchain.description":
      "Dezentrale Anwendungen und Smart Contracts für die nächste Generation des Internets.",
    "lab.ar.title": "AR/VR Experiences",
    "lab.ar.description": "Immersive Erfahrungen, die die Grenzen zwischen digital und physisch verschwimmen lassen.",
    "lab.iot.title": "IoT Integration",
    "lab.iot.description": "Vernetzte Lösungen für eine intelligentere und effizientere Zukunft.",
    "lab.agentHub.title": "NEWEDGE Agent Hub",
    "lab.agentHub.subtitle": "KI-gestützte Automatisierungslösungen",
    "lab.agentHub.description":
      "Revolutionäre KI-Agenten, die komplexe Aufgaben autonom bewältigen und Ihr Unternehmen in die Zukunft führen.",
    "lab.featured.title": "Featured Applications",
    "lab.upcoming.title": "Upcoming Applications",
    "lab.smartAnalytics.title": "Smart Analytics Agent",
    "lab.smartAnalytics.description":
      "Automatisierte Datenanalyse und Erkenntnisgewinnung für datengetriebene Entscheidungen.",
    "lab.creativeCopilot.title": "Creative Copilot",
    "lab.creativeCopilot.description": "KI-Assistent für kreative Prozesse und Content-Generierung.",
    "lab.processOptimizer.title": "Process Optimizer",
    "lab.processOptimizer.description": "Intelligente Prozessautomatisierung für maximale Effizienz.",
    "lab.predictiveInsights.title": "Predictive Insights",
    "lab.predictiveInsights.description": "Vorhersagemodelle für strategische Planung und Risikomanagement.",
    "lab.cta.title": "Bereit für die Zukunft?",
    "lab.cta.description": "Lassen Sie uns gemeinsam innovative Technologien erkunden und implementieren.",

    // Legal pages
    "legal.impressum.title": "Impressum",
    "legal.privacy.title": "Datenschutzerklärung",
    "legal.contact.title": "Kontakt",
    "legal.backToHome": "Zurück zur Startseite",

    // 404
    "notFound.title": "404",
    "notFound.subtitle": "Oops! Seite nicht gefunden",
    "notFound.description": "Die angeforderte Seite existiert nicht.",
    "notFound.backToHome": "Zurück zur Startseite",
  },
  en: {
    // Navigation
    "nav.services": "Services",
    "nav.media": "Media",
    "nav.studio": "Studio",
    "nav.lab": "Lab",
    "nav.team": "Our Team",
    "nav.home": "Home",

    // Common
    "common.learnMore": "Learn More",
    "common.getStarted": "Get Started",
    "common.contact": "Contact",
    "common.backToHome": "Back to Home",
    "common.discussProject": "Discuss Project",
    "common.startProject": "Start Project",
    "common.exploreServices": "Explore Services",

    // Homepage
    "home.hero.title": "NEWEDGE",
    "home.hero.subtitle": "For strategy. aesthetics. & tech.",
    "home.hero.description":
      "We develop digital solutions that go beyond the ordinary. From strategic consulting to cutting-edge technology - we bring your vision to life.",
    "home.about.title": "About Us",
    "home.about.description":
      "NEWEDGE is a creative tech studio specializing in innovative digital solutions. We connect strategic thinking with aesthetic design and cutting-edge technology.",
    "home.services.title": "Our Services",
    "home.contact.title": "Ready to get started?",
    "home.contact.description": "Let's talk about your next project and create something extraordinary together.",

    // Services
    "services.hero.title": "NEW EDGE SERVICES",
    "services.hero.subtitle": "For strategy. aesthetics. & tech.",
    "services.hero.description":
      "Comprehensive digital solutions that seamlessly connect strategy, design, and technology. We develop tailored approaches for your unique challenges.",
    "services.keyActivities": "Key Activities",
    "services.strategy.title": "Strategic Consulting",
    "services.strategy.description":
      "Digital transformation and strategic consulting for sustainable business success.",
    "services.design.title": "Creative Design",
    "services.design.description": "Aesthetic solutions that bring your brand to life and inspire users.",
    "services.development.title": "Tech Development",
    "services.development.description": "State-of-the-art technology solutions for complex digital challenges.",
    "services.cta.title": "Ready for your next project?",
    "services.cta.description": "Let's develop innovative solutions together that advance your business.",

    // Media
    "media.hero.title": "NEW EDGE MEDIA",
    "media.hero.subtitle": "For strategy. aesthetics. & tech.",
    "media.hero.description":
      "Creative media production that tells stories and awakens emotions. From concept to final implementation - we bring your vision to life.",
    "media.services.title": "Media Services",
    "media.video.title": "Video Production",
    "media.video.description": "Professional video production for all your communication needs.",
    "media.photography.title": "Photography",
    "media.photography.description": "High-quality photography that perfectly showcases your brand.",
    "media.animation.title": "Animation & Motion",
    "media.animation.description": "Dynamic animations and motion graphics for maximum attention.",
    "media.branding.title": "Brand Identity",
    "media.branding.description": "Holistic brand development for a strong and memorable presence.",
    "media.cta.title": "Ready for your media production?",
    "media.cta.description": "Let's develop creative content together that inspires your target audience.",

    // Studio
    "studio.hero.title": "NEW EDGE STUDIO",
    "studio.hero.subtitle": "For strategy. aesthetics. & tech.",
    "studio.hero.description":
      "Our creative center where ideas take shape. Here we create innovative designs and thoughtful user experiences that bring your brand to life.",
    "studio.services.title": "Studio Services",
    "studio.ux.title": "UX/UI Design",
    "studio.ux.description": "Intuitive user experiences that inspire your users and achieve your goals.",
    "studio.web.title": "Web Design",
    "studio.web.description": "Modern web designs that work responsively and performantly on all devices.",
    "studio.app.title": "App Design",
    "studio.app.description": "Mobile-first designs for iOS and Android with focus on usability.",
    "studio.systems.title": "Design Systems",
    "studio.systems.description": "Scalable design systems for consistent brand experiences.",
    "studio.cta.title": "Ready for extraordinary design?",
    "studio.cta.description": "Let's develop designs together that inspire your users.",

    // Lab
    "lab.hero.title": "NEW EDGE LAB",
    "lab.hero.subtitle": "For strategy. aesthetics. & tech.",
    "lab.hero.description":
      "Our experimentation field for cutting-edge technologies. Here we explore the future of digital innovation and develop groundbreaking solutions.",
    "lab.services.title": "Lab Services",
    "lab.ai.title": "AI Solutions",
    "lab.ai.description": "Intelligent automation and AI-powered solutions for complex challenges.",
    "lab.blockchain.title": "Blockchain Development",
    "lab.blockchain.description":
      "Decentralized applications and smart contracts for the next generation of the internet.",
    "lab.ar.title": "AR/VR Experiences",
    "lab.ar.description": "Immersive experiences that blur the boundaries between digital and physical.",
    "lab.iot.title": "IoT Integration",
    "lab.iot.description": "Connected solutions for a smarter and more efficient future.",
    "lab.agentHub.title": "NEWEDGE Agent Hub",
    "lab.agentHub.subtitle": "AI-powered automation solutions",
    "lab.agentHub.description":
      "Revolutionary AI agents that autonomously handle complex tasks and lead your business into the future.",
    "lab.featured.title": "Featured Applications",
    "lab.upcoming.title": "Upcoming Applications",
    "lab.smartAnalytics.title": "Smart Analytics Agent",
    "lab.smartAnalytics.description": "Automated data analysis and insight generation for data-driven decisions.",
    "lab.creativeCopilot.title": "Creative Copilot",
    "lab.creativeCopilot.description": "AI assistant for creative processes and content generation.",
    "lab.processOptimizer.title": "Process Optimizer",
    "lab.processOptimizer.description": "Intelligent process automation for maximum efficiency.",
    "lab.predictiveInsights.title": "Predictive Insights",
    "lab.predictiveInsights.description": "Prediction models for strategic planning and risk management.",
    "lab.cta.title": "Ready for the future?",
    "lab.cta.description": "Let's explore and implement innovative technologies together.",

    // Legal pages
    "legal.impressum.title": "Legal Notice",
    "legal.privacy.title": "Privacy Policy",
    "legal.contact.title": "Contact",
    "legal.backToHome": "Back to Home",

    // 404
    "notFound.title": "404",
    "notFound.subtitle": "Oops! Page not found",
    "notFound.description": "The requested page does not exist.",
    "notFound.backToHome": "Back to Home",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storage = safeLocalStorage();
  const [language, setLanguage] = useState<Language>(() => {
    // URL ist maßgeblich: `/en/…` → EN (kein Flash bei Direktaufruf). Sonst DE;
    // die `/en`- bzw. `/`-LocaleLayout hält die Sprache clientseitig synchron.
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/en" || p.startsWith("/en/")) return "en";
      return "de";
    }
    const saved = safeGetItem(storage, "language");
    return (saved as Language) || "de";
  });

  useEffect(() => {
    safeSetItem(storage, "language", language);
  }, [language, storage]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
