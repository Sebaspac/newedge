
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";
import { useImageOverrides } from "@/hooks/useImageOverrides";
// Eager load only critical pages for faster initial load
import Index from "./pages/Index";

// Lazy load all secondary pages for better performance
// Careers-Import bewusst entfernt — Seite ist vorerst deaktiviert (Route → NotFound), Content bleibt im CMS.
const About = lazy(() => import("./pages/About"));
const Methodik = lazy(() => import("./pages/Methodik"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Contact = lazy(() => import("./pages/Contact"));
const KiAudit = lazy(() => import("./pages/KiAudit"));
const Cortex = lazy(() => import("./pages/Cortex"));
const WebDesign = lazy(() => import("./pages/WebDesign"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PainPointAuswahlverfahren = lazy(() => import("./pages/PainPointAuswahlverfahren"));
const MiniCaseDetail = lazy(() => import("./pages/MiniCaseDetail"));
const KiGlossar = lazy(() => import("./pages/KiGlossar"));
const RoiRechner = lazy(() => import("./pages/RoiRechner"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

/** Setzt die Sprache passend zum URL-Präfix (`/en` = EN, sonst DE) und rendert die Route. */
const LocaleLayout = ({ lang }: { lang: "de" | "en" }) => {
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    if (language !== lang) setLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, language, setLanguage]);
  return <Outlet />;
};

/** Ein einziges Routen-Set — unter `/` (DE) und `/en` (EN) identisch gemountet. */
const appRoutes = () => (
  <>
    <Route index element={<Index />} />
    {/* Karriere-Seite vorerst deaktiviert (nicht erreichbar) — Content bleibt im CMS erhalten */}
    <Route path="careers" element={<NotFound />} />
    {/* „Über uns" vorerst deaktiviert — Seite/Content bleiben, Route zeigt auf 404 */}
    <Route path="about" element={<NotFound />} />
    <Route path="methodik" element={<Methodik />} />
    <Route path="impressum" element={<Impressum />} />
    <Route path="kontakt" element={<Contact />} />
    <Route path="ki-audit" element={<KiAudit />} />
    <Route path="cortex" element={<Cortex />} />
    <Route path="websites" element={<WebDesign />} />
    <Route path="loesungen/auswahlverfahren" element={<PainPointAuswahlverfahren />} />
    <Route path="leistungen/pain-points/auswahlverfahren" element={<PainPointAuswahlverfahren />} />
    {/* Alle Pain-Point- & Industrie-Unterseiten nutzen dieselbe Struktur wie Auswahlverfahren. */}
    <Route path="leistungen/pain-points/:slug" element={<PainPointAuswahlverfahren />} />
    <Route path="leistungen/industrien/:slug" element={<PainPointAuswahlverfahren />} />
    <Route path="loesungen/:slug" element={<PainPointAuswahlverfahren />} />
    <Route path="industrien/:slug" element={<PainPointAuswahlverfahren />} />
    {/* Mini-Case Detailseiten — eine Phase je Case (illustrativ) */}
    <Route path="loesungen/:slug/case/:caseId" element={<MiniCaseDetail />} />
    <Route path="industrien/:slug/case/:caseId" element={<MiniCaseDetail />} />
    <Route path="ki-glossar" element={<KiGlossar />} />
    <Route path="roi-rechner" element={<RoiRechner />} />
    <Route path="*" element={<NotFound />} />
  </>
);

const App = () => {
  // `document.documentElement.lang` wird pro Route von `LocaleLayout` gesetzt (de/en).

  // „Bild austauschen" aus dem CMS laden. Der Rückgabewert wird bewusst nicht
  // gelesen — er erzwingt nur einen Re-Render, sobald Ersatzbilder vorliegen.
  useImageOverrides();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <StructuredData />

              <Suspense fallback={<LoadingScreen progress={100} />}>
                <Routes>
                  <Route path="/en" element={<LocaleLayout lang="en" />}>
                    {appRoutes()}
                  </Route>
                  <Route path="/" element={<LocaleLayout lang="de" />}>
                    {appRoutes()}
                  </Route>
                </Routes>
              </Suspense>

            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
