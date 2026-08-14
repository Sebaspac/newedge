import { useState } from "react";
import { motion } from "framer-motion";
import { aiVoices as aiVoicesStatic, img } from "@/content";
import { aiVoices as aiVoicesEn } from "@/content/en/sections/aiVoices";
import { useLocalizedStatic } from "@/hooks/useLocalized";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const INK_DEEP = "#171717";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Layout der schwebenden Fotos (Desktop): Position, Größe, Rotation je Foto. */
const PHOTO_LAYOUT: React.CSSProperties[] = [
  { top: "4%", left: "2%", width: "min(24vw, 320px)", transform: "rotate(-2deg)" },
  { bottom: "6%", left: "-2%", width: "min(20vw, 250px)", transform: "rotate(1.5deg)" },
  { top: "0%", right: "3%", width: "min(22vw, 300px)", transform: "rotate(2deg)" },
  { top: "44%", right: "8%", width: "min(13vw, 170px)", transform: "rotate(-1.5deg)" },
  { bottom: "2%", left: "38%", width: "min(17vw, 220px)", transform: "rotate(-1deg)" },
  { bottom: "4%", right: "-1%", width: "min(18vw, 230px)", transform: "rotate(2deg)" },
];

/**
 * „Was die KI über uns sagt" (Referenz-Layout): Bullet-Kicker, riesige
 * zentrierte Headline, vier Provider-Pills mit vorbefülltem Prompt,
 * schwebende Studio-Fotos drumherum.
 */
export const AiVoicesSection = () => {
  const aiVoices = useLocalizedStatic(aiVoicesStatic, aiVoicesEn);
  const [hiddenIcons, setHiddenIcons] = useState<Record<string, boolean>>({});
  const q = encodeURIComponent(aiVoices.prompt);

  return (
    <section aria-label={aiVoices.heading} className="relative" style={{ overflowX: "clip" }}>
      <div
        className="relative max-w-[1440px] mx-auto"
        style={{ paddingTop: "clamp(64px,9vw,130px)", paddingBottom: "clamp(64px,9vw,130px)" }}
      >
        {/* ── Schwebende Fotos (nur Desktop) ── */}
        <div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none">
          {aiVoices.photos.map((p, i) => (
            <motion.img
              key={p.src}
              src={img(p.src)}
              alt=""
              loading="lazy"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
              style={{
                position: "absolute",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: "18px",
                ...PHOTO_LAYOUT[i % PHOTO_LAYOUT.length],
              }}
            />
          ))}
        </div>

        {/* ── Zentrierter Inhalt ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative text-center mx-auto px-6"
          style={{ maxWidth: "760px", zIndex: 1 }}
        >
          <p
            className="flex items-center justify-center gap-2"
            style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "14px", color: INK_DEEP, marginBottom: "16px" }}
          >
            <span aria-hidden style={{ width: "7px", height: "7px", borderRadius: "50%", background: INK_DEEP, flexShrink: 0 }} />
            {aiVoices.kicker}
          </p>

          <div
            style={{
              fontFamily: OUTFIT,
              fontWeight: 700,
              fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: INK_DEEP,
              marginBottom: "36px",
            }}
          >
            {aiVoices.heading}
          </div>

          {/* Provider-Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {aiVoices.providers.map((prov) => (
              /* Farben als Klassen (nicht inline) — sonst überstimmt der Inline-Style die hover:-Varianten */
              <a
                key={prov.label}
                href={`${prov.hrefBase}${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 transition-all duration-200 bg-[#CCFF00] text-[#171717] hover:bg-[#171717] hover:text-[#CCFF00] group"
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 600,
                  fontSize: "16px",
                  borderRadius: "999px",
                  padding: "13px 26px",
                }}
              >
                {!hiddenIcons[prov.iconSlug] && (
                  <span aria-hidden style={{ position: "relative", width: "19px", height: "19px", display: "block", flexShrink: 0 }}>
                    <img
                      src={`https://cdn.simpleicons.org/${prov.iconSlug}/171717`}
                      alt=""
                      loading="lazy"
                      onError={() => setHiddenIcons((prev) => ({ ...prev, [prov.iconSlug]: true }))}
                      style={{ position: "absolute", inset: 0, width: "19px", height: "19px", display: "block" }}
                      className="transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <img
                      src={`https://cdn.simpleicons.org/${prov.iconSlug}/CCFF00`}
                      alt=""
                      loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "19px", height: "19px", display: "block" }}
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </span>
                )}
                {prov.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
