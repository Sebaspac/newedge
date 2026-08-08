import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  validateContactForm,
  submitContactForm,
  checkRateLimit,
  recordSubmission,
  isHoneypotTriggered,
} from "@/utils/contactFormValidation";
import { startAuditSla } from "@/components/AuditSlaStatus";
import { contactFormModal as CFM_STATIC } from "@/content/sections/contactFormModal";
import { contactFormModal as contactFormModalEn } from "@/content/en/sections/contactFormModal";
import { useLocalized } from "@/hooks/useLocalized";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  theme: 'studio' | 'media' | 'lab';
  /** Startet nach erfolgreichem Submit die 24h-Audit-SLA-Uhr (AuditSlaStatus). */
  sla?: boolean;
}

export const ContactFormModal = ({
  isOpen,
  onClose,
  accentColor,
  gradientFrom,
  gradientTo,
  theme,
  sla = false,
}: ContactFormModalProps) => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const contactFormModal = useLocalized("contact-form-modal", CFM_STATIC, contactFormModalEn);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormStatus(null);
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Honeypot check
    const honeypot = formData.get('website_url')?.toString();
    if (isHoneypotTriggered(honeypot)) {
      setFormStatus({ type: 'success', message: contactFormModal.messages.honeypotSuccess });
      form.reset();
      setIsSubmitting(false);
      return;
    }

    // Rate limit
    const rl = checkRateLimit();
    if (!rl.allowed) {
      setFormStatus({ type: 'error', message: rl.error! });
      setIsSubmitting(false);
      return;
    }

    // Validate
    const rawData = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      position: formData.get('position')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      consent: formData.get('consent') === 'on',
    };

    const validation = validateContactForm(rawData);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors || {});
      setIsSubmitting(false);
      return;
    }

    // Submit
    const result = await submitContactForm(validation.data!);

    if (result.success) {
      recordSubmission();
      if (sla) {
        startAuditSla();
        setFormStatus({ type: 'success', message: contactFormModal.messages.slaSuccess });
      } else {
        setFormStatus({ type: 'success', message: contactFormModal.messages.success });
      }
      form.reset();
    } else {
      setFormStatus({ type: 'error', message: result.error || contactFormModal.messages.errorFallback });
    }

    setIsSubmitting(false);
  };

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFieldErrors({});
      setFormStatus(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black mb-2 text-left sm:text-3xl">
            <span
              style={{
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              className="text-3xl font-semibold"
            >
              {contactFormModal.header.title}
            </span>
          </DialogTitle>
          <p className="text-muted-foreground text-left">
            {contactFormModal.header.description}
          </p>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          {/* Honeypot */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="website_url">{contactFormModal.honeypot.label}</label>
            <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
          </div>

          <motion.div className="space-y-4" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}>
            {/* Name */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="name" className="text-foreground font-medium">{contactFormModal.fields.name.label}</Label>
              <Input id="name" name="name" type="text" placeholder={contactFormModal.fields.name.placeholder} required maxLength={120} className="bg-background/50 border-border focus:border-primary transition-colors" />
              {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
            </motion.div>

            {/* Email */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="email" className="text-foreground font-medium">{contactFormModal.fields.email.label}</Label>
              <Input id="email" name="email" type="email" placeholder={contactFormModal.fields.email.placeholder} required maxLength={200} className="bg-background/50 border-border focus:border-primary transition-colors" />
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </motion.div>

            {/* Phone */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="phone" className="text-foreground font-medium">{contactFormModal.fields.phone.label}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={contactFormModal.fields.phone.placeholder} maxLength={30} className="bg-background/50 border-border focus:border-primary transition-colors" />
              {fieldErrors.phone && <p className="text-sm text-destructive">{fieldErrors.phone}</p>}
            </motion.div>

            {/* Company */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="company" className="text-foreground font-medium">{contactFormModal.fields.company.label}</Label>
              <Input id="company" name="company" type="text" placeholder={contactFormModal.fields.company.placeholder} maxLength={120} className="bg-background/50 border-border focus:border-primary transition-colors" />
              {fieldErrors.company && <p className="text-sm text-destructive">{fieldErrors.company}</p>}
            </motion.div>

            {/* Position */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="position" className="text-foreground font-medium">{contactFormModal.fields.position.label}</Label>
              <Input id="position" name="position" type="text" placeholder={contactFormModal.fields.position.placeholder} maxLength={120} className="bg-background/50 border-border focus:border-primary transition-colors" />
              {fieldErrors.position && <p className="text-sm text-destructive">{fieldErrors.position}</p>}
            </motion.div>

            {/* Message */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <Label htmlFor="message" className="text-foreground font-medium">{contactFormModal.fields.message.label}</Label>
              <Textarea id="message" name="message" placeholder={contactFormModal.fields.message.placeholder} required maxLength={5000} className="min-h-[120px] bg-background/50 border-border focus:border-primary transition-colors resize-none" />
              {fieldErrors.message && <p className="text-sm text-destructive">{fieldErrors.message}</p>}
            </motion.div>

            {/* Pflicht-Einwilligung (DSGVO) — der Service prüft sie ebenfalls */}
            <motion.div className="space-y-2" variants={fieldVariants}>
              <label htmlFor="consent-modal" className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="consent-modal"
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-current"
                />
                <span className="text-[13px] leading-relaxed text-muted-foreground">
                  {contactFormModal.consent.before}
                  <a href={contactFormModal.consent.linkHref} className="text-foreground underline">
                    {contactFormModal.consent.linkLabel}
                  </a>
                  {contactFormModal.consent.after}
                </span>
              </label>
              {fieldErrors.consent && <p className="text-sm text-destructive">{fieldErrors.consent}</p>}
            </motion.div>
          </motion.div>

          {/* Inline status messages */}
          {formStatus && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium ${
                formStatus.type === 'success'
                  ? 'bg-success/[0.06] text-success border border-success/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {formStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {formStatus.message}
            </motion.div>
          )}

          <motion.div variants={fieldVariants}>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-white font-bold"
              style={{
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {contactFormModal.submit.submitting}
                </>
              ) : (
                <>
                  {contactFormModal.submit.idle}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
