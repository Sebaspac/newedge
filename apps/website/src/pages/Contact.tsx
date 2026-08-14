import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { contact as CONTACT_STATIC } from "@/content/pages/contact";
import { contact as contactEn } from "@/content/en/pages/contact";
import { contactFormModal as CFM_STATIC } from "@/content/sections/contactFormModal";
import { contactFormModal as contactFormModalEn } from "@/content/en/sections/contactFormModal";
import { img } from "@/content";
import { useLocalized } from "@/hooks/useLocalized";
import {
  validateContactForm,
  submitContactForm,
  checkRateLimit,
  recordSubmission,
  isHoneypotTriggered,
} from "@/utils/contactFormValidation";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(23,23,23,0.14)";
const EASE = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "h-auto rounded-xl border-[1.5px] bg-white px-4 py-3 text-[15px] shadow-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#171717]";
const inputStyle: React.CSSProperties = {
  fontFamily: OUTFIT,
  color: INK_DEEP,
  borderColor: HAIRLINE,
};

const Contact = () => {
  // SEO ist live CMS-fähig; Hero-/Video-Copy (noch kein Strapi-Feld) kommt bewusst
  // direkt aus dem statischen Fallback, siehe Kommentar in content/pages/contact.ts.
  const contact = useLocalized("kontakt", CONTACT_STATIC, contactEn);
  const cfm = useLocalized("contact-form-modal", CFM_STATIC, contactFormModalEn);

  // Reel: `img()` löst den Medien-Slot auf. Liegt im CMS ein Video, kommt eine
  // URL zurück; sonst der Slot-Name selbst → dann bleibt das Standbild stehen.
  const reelUrl = contact.video.src ? img(contact.video.src) : "";
  const hasReel = !!reelUrl && reelUrl !== contact.video.src;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormStatus(null);
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const honeypot = formData.get("website_url")?.toString();
    if (isHoneypotTriggered(honeypot)) {
      setFormStatus({ type: "success", message: cfm.messages.honeypotSuccess });
      form.reset();
      setIsSubmitting(false);
      return;
    }

    const rl = checkRateLimit();
    if (!rl.allowed) {
      setFormStatus({ type: "error", message: rl.error! });
      setIsSubmitting(false);
      return;
    }

    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      company: formData.get("company")?.toString() || "",
      position: formData.get("position")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      consent: formData.get("consent") === "on",
    };

    const validation = validateContactForm(rawData);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors || {});
      setIsSubmitting(false);
      return;
    }

    const result = await submitContactForm(validation.data!);
    if (result.success) {
      recordSubmission();
      setFormStatus({ type: "success", message: cfm.messages.success });
      form.reset();
    } else {
      setFormStatus({ type: "error", message: result.error || cfm.messages.errorFallback });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <SEOHead title={contact.seo.title} description={contact.seo.description} canonical={contact.seo.canonical} />

      <div style={{ background: PAPER, minHeight: "100vh" }}>
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        <section
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            // Reduziert ggü. früher: H1 ist jetzt global größer (56px statt vorher
            // seiteneigen verkleinert) — Padding gleicht das aus, damit das Formular
            // weiterhin auch bei knapper Viewport-Höhe (~700px) komplett sichtbar bleibt.
            paddingTop: "clamp(48px, 5vh, 72px)",
            paddingBottom: "clamp(16px, 3vh, 32px)",
          }}
        >
          <div className="w-full max-w-[1180px] mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[300px_1fr] gap-x-16 gap-y-10 items-start">
              {/* ── LINKS: Reel-Format-Video-Platzhalter, Caption als Overlay unten ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "300px",
                    aspectRatio: "9 / 16",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: INK_DEEP,
                  }}
                >
                  {hasReel ? (
                    /* Im CMS hochgeladenes Reel — Standbild bleibt als poster */
                    <video
                      src={reelUrl}
                      poster={img(contact.video.poster)}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={img(contact.video.poster)}
                      alt={contact.video.posterAlt}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  )}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(16,16,16,0) 55%, rgba(16,16,16,0.92) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Play-Badge nur ohne Video — sobald ein Reel im CMS liegt,
                      übernehmen die nativen Video-Controls. */}
                  {!hasReel && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: LIME,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 22px rgba(23,23,23,0.45)",
                    }}
                  >
                    <Play fill={INK_DEEP} color={INK_DEEP} style={{ width: "18px", height: "18px", marginLeft: "2px" }} />
                  </span>
                  )}
                  {/* Caption — kleines Overlay auf dunklem Scrim, unten im Bild */}
                  <p
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      margin: 0,
                      padding: "0 16px 14px",
                      fontFamily: OUTFIT,
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: 1.45,
                      color: "rgba(255,255,255,0.92)",
                    }}
                  >
                    {contact.video.caption}
                  </p>
                </div>
              </motion.div>

              {/* ── RECHTS: Formular (ein Schritt) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              >
                <h1
                  style={{
                    color: INK_DEEP,
                    // Kompaktere Rhythmus-Marge nur hier — die Kontaktseite muss das
                    // ganze Formular auch bei knapper Viewport-Höhe zeigen. Schriftgröße/
                    // -stärke/-höhe bleiben unangetastet und erben ganz normal global.
                    marginBottom: "0.2em",
                  }}
                >
                  {contact.hero.headline}
                </h1>
                <p
                  style={{
                    fontFamily: OUTFIT,
                    fontWeight: 400,
                    color: "#3C3C3C",
                    marginBottom: "10px",
                    maxWidth: "48ch",
                  }}
                >
                  {contact.hero.sub}
                </p>

                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                    <label htmlFor="website_url">{cfm.honeypot.label}</label>
                    <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="space-y-2">
                      <Label htmlFor="name" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                        {cfm.fields.name.label}
                      </Label>
                      <Input id="name" name="name" type="text" placeholder={cfm.fields.name.placeholder} required maxLength={120} className={inputClass} style={inputStyle} />
                      {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                        {cfm.fields.email.label}
                      </Label>
                      <Input id="email" name="email" type="email" placeholder={cfm.fields.email.placeholder} required maxLength={200} className={inputClass} style={inputStyle} />
                      {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                        {cfm.fields.phone.label}
                      </Label>
                      <Input id="phone" name="phone" type="tel" placeholder={cfm.fields.phone.placeholder} maxLength={30} className={inputClass} style={inputStyle} />
                      {fieldErrors.phone && <p className="text-sm text-destructive">{fieldErrors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                        {cfm.fields.company.label}
                      </Label>
                      <Input id="company" name="company" type="text" placeholder={cfm.fields.company.placeholder} maxLength={120} className={inputClass} style={inputStyle} />
                      {fieldErrors.company && <p className="text-sm text-destructive">{fieldErrors.company}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                      {cfm.fields.position.label}
                    </Label>
                    <Input id="position" name="position" type="text" placeholder={cfm.fields.position.placeholder} maxLength={120} className={inputClass} style={inputStyle} />
                    {fieldErrors.position && <p className="text-sm text-destructive">{fieldErrors.position}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", color: INK_DEEP }}>
                      {cfm.fields.message.label}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={cfm.fields.message.placeholder}
                      required
                      maxLength={5000}
                      className={`${inputClass} min-h-[84px] resize-none`}
                      style={inputStyle}
                    />
                    {fieldErrors.message && <p className="text-sm text-destructive">{fieldErrors.message}</p>}
                  </div>

                  {/* Pflicht-Einwilligung (DSGVO) — der Service prüft sie ebenfalls */}
                  <div className="space-y-2" style={{ paddingTop: "4px" }}>
                    <label htmlFor="consent" className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        required
                        className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-[#171717]"
                      />
                      <span style={{ fontFamily: OUTFIT, fontSize: "13px", lineHeight: 1.5, color: "rgba(23,23,23,0.68)" }}>
                        {cfm.consent.before}
                        <a href={cfm.consent.linkHref} style={{ color: INK_DEEP, textDecoration: "underline" }}>
                          {cfm.consent.linkLabel}
                        </a>
                        {cfm.consent.after}
                      </span>
                    </label>
                    {fieldErrors.consent && <p className="text-sm text-destructive">{fieldErrors.consent}</p>}
                  </div>

                  {formStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
                      style={{
                        fontFamily: OUTFIT,
                        background: formStatus.type === "success" ? "rgba(21,128,61,0.06)" : "rgba(185,28,28,0.06)",
                        color: formStatus.type === "success" ? "#15803D" : "#B91C1C",
                        border: `1px solid ${formStatus.type === "success" ? "rgba(21,128,61,0.22)" : "rgba(185,28,28,0.22)"}`,
                      }}
                    >
                      {formStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      {formStatus.message}
                    </motion.div>
                  )}

                  <div style={{ paddingTop: "8px" }}>
                    <EdgePillButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {cfm.submit.submitting}
                        </span>
                      ) : (
                        cfm.submit.idle
                      )}
                    </EdgePillButton>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Contact;
