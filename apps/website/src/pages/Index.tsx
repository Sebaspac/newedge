import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { HeroSection } from "../components/HeroSection";
import { StatementStatsSection } from "@/components/StatementStatsSection";
import { DiamondModelSection } from "@/components/DiamondModelSection";
import { PositionedForImpactSection } from "../components/PositionedForImpactSection";
import { TickerScrollSection } from "../components/TickerScrollSection";
import { AiVoicesSection } from "@/components/AiVoicesSection";
import { ThreeStepsCTA } from "@/components/ThreeStepsCTA";
import { VideoShowcaseSection } from "@/components/VideoShowcaseSection";
import { TeamSupportSection } from "@/components/TeamSupportSection";
import { CaseSpotlightSection } from "@/components/CaseSpotlightSection";
import { CortexSection } from "@/components/CortexSection";
import { BuiltOnTopSection } from "@/components/BuiltOnTopSection";
import { EmbeddedAI } from "@/components/EmbeddedAI";
import { DerSchnitt } from "@/components/DerSchnitt";
import { FloatingFounderBadge } from "@/components/FloatingFounderBadge";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { useLenis } from "@/hooks/useLenis";

import { ScrollAnimation } from "../hooks/useScrollAnimation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MagicText } from "@/components/ui/magic-text";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { safeGetItem, safeSessionStorage, safeSetItem } from "@/utils/safeStorage";
import { home as HOME_STATIC, img } from "@/content";
import { home as HOME_EN } from "@/content/en/pages/home";
import { useHomeContent } from "@/hooks/useHomeContent";

// Lazy load Footer
const Footer = lazy(() => import("@/components/Footer").then((module) => ({
  default: module.Footer
})));

/** Temporärer Schalter: Case-Spotlight-Sektion auf der Homepage aus-/einblenden,
    ohne Komponente oder Content-Layer (caseSpotlight.ts, miniCases.ts) zu ändern. */
const SHOW_CASE_SPOTLIGHT = false;

const Index = () => {
  const sessionStorageSafe = safeSessionStorage();
  const { t, language } = useLanguage();
  useLenis();

  // Trigger-Anker für den schwebenden Founder-Badge: ein-/ausgeblendet zwischen
  // PositionedForImpactSection und der TeamSupportSection ("Ihr Team").
  // Founder-Badge startet bereits beim „Externer Head of AI"-Modul
  const embeddedAiSectionRef = useRef<HTMLElement>(null);
  const impactSectionRef = useRef<HTMLElement>(null);
  const teamSectionRef = useRef<HTMLElement>(null);

  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const cms = useHomeContent();
  const HOME_FB = language === "en" ? HOME_EN : HOME_STATIC;
  const home = {
    seo: cms.seo ?? HOME_FB.seo,
    loadingLogo: cms.loadingLogo ?? HOME_FB.loadingLogo,
    loadingAlt: cms.loadingAlt ?? HOME_FB.loadingAlt,
  };

  const [openAccordionIndex, setOpenAccordionIndex] = useState(0);
  const [showInitialLoading, setShowInitialLoading] = useState(() => {
    // Only show loading on first visit in this session
    if (typeof window !== "undefined") {
      return !safeGetItem(sessionStorageSafe, "hasVisited");
    }
    return false;
  });

  // Initial loading - only on first visit
  useEffect(() => {
    if (showInitialLoading) {
      const timer = setTimeout(() => {
        setShowInitialLoading(false);
        safeSetItem(sessionStorageSafe, "hasVisited", "true");
      }, 2000); // Show logo for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [sessionStorageSafe, showInitialLoading]);

  return <>
      {/* Initial Loading Screen - only first visit */}
      <AnimatePresence mode="wait">
        {showInitialLoading && <motion.div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" initial={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}>
            <motion.img src={img(home.loadingLogo)} alt={home.loadingAlt} className="w-24 h-24 md:w-32 md:h-32" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: [1, 1.15, 1, 1.1, 1]
        }} transition={{
          opacity: {
            duration: 0.3
          },
          scale: {
            duration: 0.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.2, 0.4, 0.6, 1]
          }
        }} />
          </motion.div>}
      </AnimatePresence>

      <SEOHead
        title={home.seo.title}
        description={home.seo.description}
        canonical={home.seo.canonical}
      />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
        {/* Global immersive grain — subtle */}
        <NoiseOverlay opacity={0.035} fixed zIndex={2} />

        {/* Mobile Navigation */}
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* Hero (hell) + Statement mit Kennzahlen (hell) — eigene Sections */}
        <HeroSection />
        <StatementStatsSection />

        {/* All post-hero sections — einheitlicher Seiten-Hintergrund, kein eigener Ton mehr */}
        <div>
          <div>
            {/* 02 — Lila Marquee, direkt nach den Kennzahlen */}
            <TickerScrollSection />

            {/* 02b — KI-Diamant-Modell: Aus Pyramide wird Diamant (nach dem Lime/Gelb-Ticker) */}
            <DiamondModelSection />

            {/* 03 — Was wir machen: externer Head of AI + Reise zur KI-Abteilung */}
            <EmbeddedAI sectionRef={embeddedAiSectionRef} />

            {/* 04 — Lokale Infrastruktur: das Fundament (Cortex-Hub) */}
            <CortexSection />

            {/* 04b — Darauf aufgebaut: Firmen-GPT, Agenten, Prozesse, Dashboards */}
            <BuiltOnTopSection />

            {/* 04 — Case-Spotlight: reales Projekt (BMP) — temporär ausgeblendet */}
            {SHOW_CASE_SPOTLIGHT && <CaseSpotlightSection />}

            {/* 05 — Positioned for Impact: Wie wir arbeiten */}
            <PositionedForImpactSection sectionRef={impactSectionRef} />

            {/* 07 — Ihr Team: ein Ansprechpartner, eine ganze Agentur */}
            <TeamSupportSection sectionRef={teamSectionRef} />

            {/* 07 — Der Schnitt: vorher/nachher */}
            <DerSchnitt />

            {/* 08 — Video-Showcase: NEWEDGE in Aktion */}
            <VideoShowcaseSection />

            {/* Social Proof: KI-Stimmen statt Testimonial-Karussell */}
            <AiVoicesSection />

            {/* 10 — CTA */}
            <ThreeStepsCTA />
          </div>

        </div>

        {/* Footer */}
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Footer />
        </Suspense>

        {/* Schwebender Founder-CTA — nur zwischen den beiden Trigger-Sections sichtbar */}
        <FloatingFounderBadge startRef={embeddedAiSectionRef} endRef={teamSectionRef} />

      </div>
    </>;
};
export default Index;