import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { testimonialsSection as TS_STATIC, type Testimonial } from "@/content";
import { testimonialsSection as testimonialsSectionEn } from "@/content/en/sections/testimonials";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useHomeSection } from "@/hooks/useHomeContent";

const LIME  = "#CCFF00";
const INK_DEEP = "#0D0D12";

const EASE = [0.22, 1, 0.36, 1] as const;

const HEAD: React.CSSProperties = {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 700,
};
const BODY: React.CSSProperties = {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 400,
};

const VISIBLE  = 2.5;
const GAP      = 20;

export const TestimonialsSection = () => {
  const [current, setCurrent]       = useState(0);
  const [autoPlayed, setAutoPlayed] = useState(false);
  const isMobile = useIsMobile();

  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const testimonials = useTestimonials();
  const testimonialsSection = useHomeSection("testimonialsSection", TS_STATIC, testimonialsSectionEn);
  const MAX_INDEX = Math.max(0, testimonials.length - 3);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });

  /* one-time nudge: advance by 1 when section enters view (desktop carousel only) */
  useEffect(() => {
    if (isMobile || !isInView || autoPlayed) return;
    const t = setTimeout(() => {
      setCurrent(1);
      setAutoPlayed(true);
    }, 800);
    return () => clearTimeout(t);
  }, [isMobile, isInView, autoPlayed]);

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(MAX_INDEX, i + 1));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "transparent", // zeigt das durchgehende Magazin-Papier der Seite
        paddingTop:    "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Header: headline left, arrows right ─────────────────────────── */}
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2
              style={{
                ...HEAD,
                fontSize:      "clamp(1.9rem, 3.4vw, 2.75rem)",
                lineHeight:    1.1,
                letterSpacing: "-0.01em",
                color:         INK_DEEP,
                maxWidth:      "20ch",
              }}
            >
              {testimonialsSection.headlineLead}{" "}
              <span style={{ color: LIME }}>{testimonialsSection.headlineHighlight}</span>{" "}
              {testimonialsSection.headlineTail}
            </h2>
          </motion.div>

          {/* Arrow buttons — square */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:flex items-center gap-3 flex-shrink-0"
          >
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label={testimonialsSection.prevLabel}
              className="flex items-center justify-center transition-all duration-200"
              style={{
                width:        "52px",
                height:       "52px",
                borderRadius: "50%",
                background:   "transparent",
                border:       `1px solid ${current === 0 ? "rgba(23,23,23,0.22)" : LIME}`,
                color:        current === 0 ? "rgba(23,23,23,0.22)" : INK_DEEP,
                cursor:       current === 0 ? "not-allowed" : "pointer",
              }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              onClick={next}
              disabled={current === MAX_INDEX}
              aria-label={testimonialsSection.nextLabel}
              className="flex items-center justify-center transition-all duration-200"
              style={{
                width:        "52px",
                height:       "52px",
                borderRadius: "50%",
                background:   current === MAX_INDEX ? "transparent" : LIME,
                border:       `1px solid ${current === MAX_INDEX ? "rgba(23,23,23,0.22)" : LIME}`,
                color:        current === MAX_INDEX ? "rgba(23,23,23,0.22)" : "#FFFFFF",
                cursor:       current === MAX_INDEX ? "not-allowed" : "pointer",
              }}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {isMobile ? (
          /* ── Mobile: native horizontal swipe (scroll-snap) ───────────────── */
          <div
            className="testimonials-mobile-scroll flex overflow-x-auto"
            style={{
              gap: `${GAP}px`,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              // bleed slightly past the container padding so cards feel edge-anchored
              marginLeft:  "-1rem",
              marginRight: "-1rem",
              paddingLeft:  "1rem",
              paddingRight: "1rem",
            }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} mobile />
            ))}
          </div>
        ) : (
          <>
            {/* ── Carousel ─────────────────────────────────────────────────── */}
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: `calc(-${current} * (100% / ${VISIBLE} + ${GAP / VISIBLE}px))`,
                }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ gap: `${GAP}px` }}
              >
                {testimonials.map((t, i) => (
                  <TestimonialCard key={t.name} testimonial={t} index={i} />
                ))}
              </motion.div>
            </div>

            {/* ── Progress dots ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 mt-8">
              {Array.from({ length: MAX_INDEX + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Gehe zu Testimonial ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width:           i === current ? "24px" : "6px",
                    height:          "6px",
                    borderRadius:    "3px",
                    backgroundColor: i === current ? LIME : "rgba(23,23,23,0.22)",
                  }}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* hide the horizontal scrollbar on mobile */}
      <style>{`
        .testimonials-mobile-scroll::-webkit-scrollbar { display: none; }
        .testimonials-mobile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

// ─── Single card ──────────────────────────────────────────────────────────────
type CardProps = {
  testimonial: Testimonial;
  index: number;
  mobile?: boolean;
};

const TestimonialCard = ({ testimonial, mobile = false }: CardProps) => (
  <div
    className="flex flex-col justify-between flex-none"
    style={{
      width:    mobile ? "min(83vw, 320px)" : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})`,
      minWidth: mobile ? "min(83vw, 320px)" : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})`,
      ...(mobile ? { scrollSnapAlign: "start" } : {}),
      minHeight: "310px",
      padding:   "30px 28px 28px",
      background:           "rgba(255,255,255,0.68)",
      backdropFilter:       "blur(32px) saturate(200%) brightness(1.04)",
      WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.04)",
      border:       "1px solid rgba(255,255,255,0.92)",
      boxShadow:    [
        "0 2px 0 0 rgba(255,255,255,0.92) inset",
        "0 8px 24px rgba(23,23,23,0.14)",
        "0 24px 64px rgba(23,23,23,0.06)",
        "0 4px 12px rgba(0,0,0,0.08)",
        "0 1px 3px rgba(0,0,0,0.06)",
      ].join(", "),
      borderRadius: "16px",
      position:     "relative",
    }}
  >
    {/* Dot accent */}
    <div
      style={{
        position:     "absolute",
        top:          "20px",
        right:        "20px",
        width:        "9px",
        height:       "9px",
        borderRadius: "50%",
        background:   LIME,
      }}
    />

    {/* Quote */}
    <p
      style={{
        ...BODY,
        fontSize:     "14.5px",
        lineHeight:   1.7,
        color:        "rgba(23,23,23,0.92)",
        paddingRight: "24px",
        flex:         1,
        marginBottom: "28px",
      }}
    >
      {testimonial.text}
    </p>

    {/* Author */}
    <div>
      <div style={{ height: "1px", backgroundColor: "rgba(23,23,23,0.14)", marginBottom: "14px" }} />
      <div style={{ ...HEAD, fontSize: "15px", color: INK_DEEP, lineHeight: 1.2, marginBottom: "3px" }}>
        {testimonial.name}
      </div>
      <div style={{ ...BODY, fontWeight: 600, fontSize: "11.5px", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(23,23,23,0.45)" }}>
        {testimonial.role}
      </div>
    </div>
  </div>
);
