import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { NavHoverItem } from "@/components/ui/menu-hover-effects";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { nav as NAV_STATIC, img, Icon, type CategoryFilter } from "@/content";
import { nav as navEn } from "@/content/en/sections/nav";
import { useLocalized } from "@/hooks/useLocalized";

/* ── NEWEDGE CI tokens (Mobile-Menü, Rebrush 2026-07) ── */
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(204,255,0,0.14)";


interface MobileNavigationProps {
  onContactClick: () => void;
  logoSrc?: string;
  theme?: 'light' | 'dark';
  showCaseFilter?: boolean;
  activeFilter?: CategoryFilter;
  onFilterChange?: (filter: CategoryFilter) => void;
}

export const MobileNavigation = ({
  onContactClick,
  logoSrc,
  theme = 'light',
  showCaseFilter = false,
  activeFilter = 'all',
  onFilterChange
}: MobileNavigationProps) => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const nav = useLocalized("nav", NAV_STATIC, navEn);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileLeistungenOpen, setMobileLeistungenOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body-Scroll sperren, solange das Mobile-Menü offen ist
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* ═══════════════ DESKTOP NAV ═══════════════ */}
      <nav
        className={`fixed left-4 right-4 z-50 mx-auto pointer-events-auto transition-all duration-500 ease-out hidden lg:block rounded-full ${isScrolled ? 'py-2.5 px-5' : 'py-3 px-6'}`}
        style={{
          top: 'calc(var(--safe-area-top, 0px) + 16px)',
          maxWidth: isScrolled ? '1100px' : '1200px',
          background: 'rgba(255,255,255,0.68)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.68)',
          boxShadow: '0 8px 32px rgba(23,23,23,0.14), inset 0 1px 0 rgba(255,255,255,0.92)',
        }}
      >
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2.5">
              <img src={img(nav.logo.src)} alt={nav.logo.alt} className={`edge-mark-static transition-all duration-500 ${isScrolled ? 'h-7' : 'h-8'} w-auto`} />
            </motion.div>
          </Link>

          {/* Center: Case Filter Buttons */}
          {showCaseFilter && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
              {nav.filterButtons.map(filter => {
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => onFilterChange?.(filter.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${isActive ? 'bg-[#CCFF00] text-[#171717]' : 'text-[#171717]/60 hover:text-[#171717] hover:bg-[#171717]/5'}`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-7">
            {/* ─── KI-Abteilungen — oberste Ebene, vor „Lösungen" ─── */}
            <Link to={nav.angebot.to}>
              <NavHoverItem>{nav.angebot.label}</NavHoverItem>
            </Link>

            {/* ─── Anwendungsfelder Mega Menu ─── */}
            <div className="relative group/leist">
              <button className="flex items-center">
                <NavHoverItem>
                  {nav.megaMenu.trigger}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover/leist:rotate-180 transition-transform duration-300" />
                </NavHoverItem>
              </button>

              {/* Mega menu dropdown — centered under nav */}
              <div className="fixed left-1/2 -translate-x-1/2 mt-[18px] w-[960px] max-w-[95vw] opacity-0 invisible group-hover/leist:opacity-100 group-hover/leist:visible transition-all duration-300 group-hover/leist:delay-75 z-[60]" style={{ top: 'calc(var(--safe-area-top, 0px) + 76px)' }}>
                {/* Invisible bridge to maintain hover */}
                <div className="absolute -top-5 left-0 right-0 h-5" />

                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)', border: '1px solid rgba(23,23,23,0.06)', boxShadow: '0 25px 80px -12px rgba(23,23,23,0.22)' }}>
                  <div className="grid grid-cols-12 gap-0">

                    {/* Pain Points Column */}
                    <div className="col-span-4 p-7">
                      <div className="mb-5">
                        <p className="font-bold uppercase tracking-[0.04em] text-[#171717]" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
                          {nav.megaMenu.painPointsHeading}
                        </p>
                        <div className="mt-2 h-px bg-gradient-to-r from-[#CCFF00]/40 to-transparent" />
                      </div>
                      <div className="space-y-0.5">
                        {nav.painPoints.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-[13px] text-[#3C3C3C] hover:text-[#171717] hover:bg-[#CCFF00]/[0.07] transition-all group/item"
                          >
                            <Icon name={item.icon} className="w-4 h-4 text-[#171717]/40 group-hover/item:text-[#171717] transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Industrien Column */}
                    <div className="col-span-4 p-7 border-x border-[#171717]/[0.06]">
                      <div className="mb-5">
                        <p className="font-bold uppercase tracking-[0.04em] text-[#171717]" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
                          {nav.megaMenu.industrienHeading}
                        </p>
                        <div className="mt-2 h-px bg-gradient-to-r from-[#CCFF00]/40 to-transparent" />
                      </div>
                      <div className="space-y-0.5">
                        {nav.industrien.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-[13px] text-[#3C3C3C] hover:text-[#171717] hover:bg-[#CCFF00]/[0.07] transition-all group/item"
                          >
                            <Icon name={item.icon} className="w-4 h-4 text-[#171717]/40 group-hover/item:text-[#171717] transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Featured Case Column */}
                    <div className="col-span-4 p-7 bg-gradient-to-br from-[#CCFF00]/[0.05] to-transparent">
                      <div className="mb-5">
                        <p className="font-bold uppercase tracking-[0.04em] text-[#171717]" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
                          {nav.megaMenu.featuredHeading}
                        </p>
                        <div className="mt-2 h-px bg-gradient-to-r from-[#CCFF00]/40 to-transparent" />
                      </div>
                      <Link to={nav.featured.to} className="block group/card">
                        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#CCFF00]/15 to-[#171717]/10 border border-[#171717]/10 mb-4 flex items-end p-3 group-hover/card:border-[#CCFF00]/40 transition-all overflow-hidden relative">
                          <img
                            src={img(nav.featured.image.src)}
                            alt={nav.featured.image.alt}
                            className="absolute inset-0 w-full h-full object-cover object-[25%_20%] opacity-90 group-hover/card:opacity-100 transition-opacity"
                          />
                        </div>
                        <p className="font-semibold text-[#171717] mb-1.5" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
                          {nav.featured.title}
                        </p>
                        <p className="text-[#3C3C3C]/70 leading-relaxed mb-3" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
                          {nav.featured.desc}
                        </p>
                        <span className="text-[12px] font-semibold text-[#171717] transition-colors inline-flex items-center gap-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {nav.featured.cta}
                        </span>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* „Über NEWEDGE“ entfernt — /methodik ist über „Ihre KI-Abteilung“
                erreichbar, /about und /careers sind deaktiviert. Content bleibt
                im CMS, nur der Menüpunkt ist raus. */}

            <LanguageToggle />

            <Link
              to="/kontakt"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden transition-transform duration-200 hover:scale-[1.03]"
              style={{
                // Ruhezustand: derselbe Ink-Verlauf wie die Footer-Karte (analog Hero-CTA)
                background: "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "5px 5px 5px 20px",
                cursor: "pointer",
              }}
            >
              {/* Violett-Overlay — blendet beim Hover über dem Verlauf ein */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ background: "#CCFF00" }}
              />
              <span className="transition-colors duration-200 group-hover:text-[#171717]" style={{ position: "relative" }}>{nav.cta.label}</span>
              <span
                style={{
                  position: "relative",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#CCFF00",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight style={{ width: "14px", height: "14px", color: INK_DEEP }} />
              </span>
              {/* Kleiner Edge-Riss in der Lücke zwischen Label und Kreis — berührt keine Buchstaben */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                <EdgeRip style={{ top: "-1px", right: "33px", width: "8px", height: "15px" }} />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ MOBILE NAV HEADER — schwebende Glas-Pille ═══════════════ */}
      <nav
        className="fixed left-3 right-3 z-50 pointer-events-auto lg:hidden py-2.5 px-4 rounded-full"
        style={{
          top: 'max(12px, calc(env(safe-area-inset-top, 0px) + 8px))',
          background: 'rgba(255,255,255,0.68)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.68)',
          boxShadow: '0 8px 32px rgba(23,23,23,0.14), inset 0 1px 0 rgba(255,255,255,0.92)',
        }}
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={handleLinkClick} className="flex items-center">
            <motion.div whileTap={{ scale: 0.98 }} className="flex items-center gap-2">
              <img src={img(nav.logo.src)} alt={nav.logo.alt} className="edge-mark-static h-7 w-auto" />
            </motion.div>
          </Link>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#171717] z-50 relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full active:bg-[#CCFF00]/10 transition-colors"
            aria-label={nav.mobile.toggleAria}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

      {/* ═══════════════ MOBILE MENU OVERLAY ═══════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(16,16,16,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
              data-mobile-menu="open"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ x: reduceMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : "100%" }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-[360px] z-[60] lg:hidden flex flex-col"
              style={{
                background: PAPER,
                borderRadius: "24px 0 0 24px",
                boxShadow: "-16px 0 48px rgba(16,16,16,0.28)",
                paddingTop: "max(20px, calc(env(safe-area-inset-top, 0px) + 16px))",
                paddingBottom: "max(20px, calc(env(safe-area-inset-bottom, 0px) + 16px))",
              }}
            >
              {/* Kopf: Logo + Schließen */}
              <div className="flex items-center justify-between px-6 pb-4" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2">
                  <img src={img(nav.logo.src)} alt={nav.logo.alt} className="edge-mark-static h-7 w-auto" />
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle onSwitch={handleLinkClick} />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-full active:bg-[#CCFF00]/10 transition-colors"
                    style={{ color: INK_DEEP }}
                    aria-label={nav.mobile.toggleAria}
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="flex-1 px-6 py-6 overflow-y-auto">
                <nav className="flex flex-col gap-5">

                  {/* ─── KI-Abteilungen — oberste Ebene, „Was bietet NEWEDGE an?" ─── */}
                  <Link
                    to={nav.angebot.to}
                    onClick={() => setIsOpen(false)}
                    className="font-semibold text-3xl transition-colors duration-300"
                    style={{ fontFamily: "'Outfit', sans-serif", color: INK_DEEP }}
                  >
                    {nav.angebot.label}
                  </Link>

                  {/* ─── Anwendungsfelder — großes Item + Akkordeon (8 Sub-Nav) ─── */}
                  <div>
                    <button
                      onClick={() => setMobileLeistungenOpen(!mobileLeistungenOpen)}
                      aria-expanded={mobileLeistungenOpen}
                      className="group/nav flex items-center gap-2 cursor-pointer text-left"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      <motion.span
                        aria-hidden
                        className="inline-flex"
                        style={{ color: INK_DEEP }}
                        animate={mobileLeistungenOpen ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                      >
                        <ArrowRight strokeWidth={3} className="size-8" />
                      </motion.span>
                      <motion.span
                        className="font-semibold text-3xl transition-colors duration-300"
                        style={{ color: INK_DEEP }}
                        animate={{ x: mobileLeistungenOpen ? 0 : -40 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                      >
                        {nav.megaMenu.trigger}
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileLeistungenOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            <p className="pb-1.5 uppercase" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.06em", color: INK_DEEP }}>
                              {nav.megaMenu.painPointsHeading}
                            </p>
                            {nav.painPoints.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 py-2.5 min-h-[44px] rounded-lg active:bg-[#CCFF00]/[0.08] transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: INK }}
                              >
                                <Icon name={item.icon} className="w-4 h-4 shrink-0" style={{ color: INK_DEEP }} />
                                {item.label}
                              </Link>
                            ))}

                            <p className="pt-4 pb-1.5 uppercase" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.06em", color: INK_DEEP }}>
                              {nav.megaMenu.industrienHeading}
                            </p>
                            {nav.industrien.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 py-2.5 min-h-[44px] rounded-lg active:bg-[#CCFF00]/[0.08] transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: INK }}
                              >
                                <Icon name={item.icon} className="w-4 h-4 shrink-0" style={{ color: INK_DEEP }} />
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* „Über NEWEDGE“ entfernt — siehe Desktop-Nav oben. */}
                </nav>
              </div>

              {/* Fix unten (Thumb-Zone): primärer CTA → Kontaktseite */}
              <div className="px-5 pt-4 flex justify-center" style={{ borderTop: `1px solid ${HAIRLINE}` }} onClick={handleLinkClick}>
                <EdgePillButton to="/kontakt">{nav.mobile.contactButton}</EdgePillButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
