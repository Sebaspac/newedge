import { motion } from "framer-motion";
import { ArrowRight, Search, Map, Rocket } from "lucide-react";

const steps = [
  { icon: Search, label: "Analyse", desc: "Wir identifizieren eure größten Hebel." },
  { icon: Map, label: "Roadmap", desc: "Ihr bekommt einen konkreten Fahrplan." },
  { icon: Rocket, label: "Umsetzung", desc: "Wir bauen eure Systeme – in 4–10 Wochen." },
];

interface EntryPointCTAProps {
  onContactClick: () => void;
}

export const EntryPointCTA = ({ onContactClick }: EntryPointCTAProps) => {
  return (
    <section className="section-py-lg bg-primary-foreground text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
            In 30 Minuten wissen, wo KI euch am meisten bringt.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-10">
            Kostenlos. Unverbindlich. BAFA-förderfähig.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center border border-border bg-background">
                <step.icon className="w-6 h-6 text-foreground/80" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                Schritt {i + 1}
              </span>
              <h3 className="text-lg font-bold mb-1">{step.label}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={onContactClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent backdrop-blur-md border-2 border-black text-black font-bold text-base hover:bg-black hover:text-white transition-all duration-300 group hover:-translate-y-0.5"
          >
            Kostenlose KI-Analyse sichern
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
