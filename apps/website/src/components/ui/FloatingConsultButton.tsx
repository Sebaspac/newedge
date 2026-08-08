import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { img } from "@/content";
import { brandAssets as BA_STATIC } from "@/content/sections/brandAssets";
import { brandAssets as brandAssetsEn } from "@/content/en/sections/brandAssets";
import { useLocalized } from "@/hooks/useLocalized";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/utils/localePath";

const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const MONO: React.CSSProperties = {
  fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace",
};
const DISPLAY: React.CSSProperties = {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 600,
};

const REVOLVING_TEXT = "KOSTENLOSES ERSTGESPRÄCH · JETZT BUCHEN · ";

export const FloatingConsultButton = ({ textColor }: { textColor?: string } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  // Foto aus dem Content-Layer (CMS-austauschbar); Fallback: statisch
  const assets = useLocalized("brand-assets", BA_STATIC, brandAssetsEn);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>

      {/* Popup — absolute, appears above + left */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 16px)",
              right: 0,
              zIndex: 60,
              background: "#FFFFFF",
              border: "1.5px solid rgba(204,255,0,0.22)",
              boxShadow: "0 8px 40px rgba(204,255,0,0.22), 0 2px 8px rgba(23,23,23,0.12)",
              padding: "28px 24px 24px",
              width: "300px",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(23,23,23,0.68)",
                padding: "4px",
                display: "flex",
              }}
              aria-label="Schließen"
            >
              <X size={15} strokeWidth={1.5} />
            </button>

            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img
                src={img(assets.consultAvatar.src)}
                alt={assets.consultAvatar.alt}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "25% 20%",
                  flexShrink: 0,
                  border: "2px solid rgba(204,255,0,0.22)",
                }}
              />
              <div>
                <div style={{ ...DISPLAY, fontSize: "15px", letterSpacing: "-0.01em", color: INK_DEEP, lineHeight: 1.2, marginBottom: "2px" }}>
                  Sebastian Pachon
                </div>
                <div style={{ ...MONO, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "rgba(23,23,23,0.68)" }}>
                  Gründer & Geschäftsführer
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(23,23,23,0.06)", marginBottom: "16px" }} />

            {/* Heading + badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
              <h3 style={{ color: INK_DEEP }}>
                30-Min Erstgespräch
              </h3>
              <span style={{
                ...MONO,
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: INK_DEEP,
                background: LIME,
                border: `1px solid ${LIME}`,
                padding: "3px 7px",
                flexShrink: 0,
                marginTop: "3px",
              }}>
                Kostenlos
              </span>
            </div>

            {/* Description */}
            <p style={{ ...MONO, color: "rgba(23,23,23,0.68)", marginBottom: "20px" }}>
              Ein kurzes, unverbindliches Gespräch mit Sebastian — wir besprechen Ihre
              Situation und prüfen, wie KI oder Prozessautomatisierung bei Ihnen wirkt.
            </p>

            {/* CTA */}
            <button
              onClick={() => { setIsOpen(false); navigate(localizePath("/kontakt", language)); }}
              style={{
                width: "100%",
                background: LIME,
                color: "#171717",
                ...MONO,
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                padding: "13px 20px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Jetzt Termin buchen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circle button */}
      <motion.div
        style={{ position: "relative", cursor: "pointer", width: "152px", height: "152px" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.28 }}
        onClick={() => navigate(localizePath("/kontakt", language))}
      >
        {/* Revolving text ring — CSS animation, no Framer overhead */}
        <div style={{
          position: "absolute", inset: 0,
          animation: "fcb-spin 12s linear infinite",
        }}>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
            <defs>
              <path id="fcb-circle" d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
            </defs>
            <text style={{ fontSize: "17px", fill: textColor ?? "#171717", fontFamily: "Consolas, ui-monospace, monospace", letterSpacing: "0.04em" }}>
              <textPath href="#fcb-circle" startOffset="0%">{REVOLVING_TEXT}</textPath>
            </text>
          </svg>
          <style>{`@keyframes fcb-spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Center image */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            overflow: "hidden",
            border: `2.5px solid ${LIME}`,
            boxShadow: "0 4px 20px rgba(204,255,0,0.22)",
          }}>
            <img
              src={img(assets.consultAvatar.src)}
              alt={assets.consultAvatar.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "25% 20%" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
