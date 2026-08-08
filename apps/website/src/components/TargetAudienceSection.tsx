import { motion } from "framer-motion";
import { Wrench, HeartPulse, Building2 } from "lucide-react";

const audiences = [
  {
    icon: Wrench,
    title: "Handwerk & Dienstleister",
    size: "5–50 Mitarbeiter",
    benefit: "Sichtbarkeit erhöhen und Prozesse digitalisieren – ohne IT-Abteilung.",
  },
  {
    icon: HeartPulse,
    title: "Gesundheitswesen & Kliniken",
    size: "10–150 Mitarbeiter",
    benefit: "Patientenmanagement, Reporting und Admin automatisieren.",
  },
  {
    icon: Building2,
    title: "Hausverwaltungen & Immobilien",
    size: "5–80 Mitarbeiter",
    benefit: "Operative Effizienz durch KI-gestützte Workflows steigern.",
  },
];

export const TargetAudienceSection = () => {
  return (
    <section className="section-py-md bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-10 md:mb-14"
        >
          <span className="inline-block text-sm font-bold uppercase tracking-widest mb-3 text-primary">
            Unsere Zielgruppe
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight">
            Für wen wir das machen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 md:p-8 border border-border bg-card rounded-none hover:border-primary/40 transition-colors duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
                {item.size}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
