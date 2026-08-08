import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Zap, Palette, FlaskConical, ArrowRight } from "lucide-react";

type StateType = "human" | "fusion";

interface ContentState {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: string;
  icon: typeof Fingerprint;
}

const content: Record<StateType, ContentState> = {
  human: {
    title: "STUDIO",
    subtitle: "Klare Strategie",
    description: "Studio schafft Entscheidungsfähigkeit: Struktur, Systemlogik und strategische Klarheit als Grundlage für jede technische Umsetzung.",
    tags: ["Kommunikationsstrategie", "Workshops", "Brand Identity"],
    color: "#CCFF00",
    icon: Fingerprint
  },
  fusion: {
    title: "LAB",
    subtitle: "Systeme mit Ownership",
    description: "Lab entwickelt firmeneigene KI-, Daten- und Softwaresysteme – ohne SaaS-Zwang, ohne Black Boxes, unter voller Kontrolle des Unternehmens.",
    tags: ["Prozessautomatisierung", "Webseiten", "Prototypen", "KI-Agenten"],
    color: "#fbbf24",
    icon: Zap
  }
};

export const InteractiveCore = () => {
  const [activeState, setActiveState] = useState<StateType>("human");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activeState]);

  const states: Array<{key: StateType;label: string;number: string;}> = [
  { key: "human", label: "STUDIO", number: "01" },
  { key: "fusion", label: "LAB", number: "02" }];


  const activeContent = content[activeState];
  const Icon = activeContent.icon;

  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* Main Split: Box left, Text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT: Interactive Box */}
          <div className="flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
            {/* Control Panel - above the display card */}
            <div className="flex gap-2 sm:gap-3">
              {states.map((state, index) => {
                const isActive = activeState === state.key;
                const stateColor = content[state.key].color;
                const hoverClasses = state.key === "human" ?
                "hover:bg-purple-50 hover:border-purple-300" :
                "hover:bg-yellow-50 hover:border-yellow-300";
                const activeClasses = state.key === "human" ?
                "bg-purple-50 border-purple-500 shadow-lg shadow-purple-500/10" :
                "bg-yellow-50 border-yellow-500 shadow-lg shadow-yellow-500/10";
                const badgeActiveClasses = state.key === "human" ?
                "bg-purple-500 text-white" :
                "bg-yellow-500 text-black";

                return (
                  <motion.button
                    key={state.key}
                    onClick={() => setActiveState(state.key)}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`
                      relative p-3 sm:p-4 lg:p-5 text-left transition-all duration-500
                      border overflow-hidden group flex-1
                      ${isActive ? activeClasses : `bg-transparent border-gray-200 ${hoverClasses}`}
                    `}>

                    <div className={`
                      absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center
                      text-[10px] sm:text-xs font-bold transition-all duration-500
                      ${isActive ? badgeActiveClasses : "bg-gray-100 text-gray-400"}
                    `}>
                      {state.number}
                    </div>
                    <div className="pr-8 sm:pr-10">
                      <span className={`
                        text-sm sm:text-base lg:text-lg font-bold tracking-widest uppercase transition-all duration-500
                        ${isActive ? "text-black" : "text-gray-500"}
                      `}>
                        {state.label}
                      </span>
                    </div>
                    {isActive &&
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px]"
                      style={{ backgroundColor: stateColor }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }} />
                    }
                  </motion.button>);
              })}
            </div>

            {/* Display Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden shadow-2xl flex flex-col">

              <div className="absolute inset-0 bg-[#0a0a0f] border border-white/20" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`bg-${activeState}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0">

                  <div
                    className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/4 w-[250px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] blur-[80px] sm:blur-[100px] lg:blur-[120px] opacity-40"
                    style={{ backgroundColor: activeContent.color }} />

                  <div className="absolute inset-0 translate-x-1/4 hidden sm:block">
                    {activeState === "human" &&
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {[...Array(4)].map((_, i) =>
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-400/30"
                        style={{ width: `${80 + i * 50}px`, height: `${80 + i * 50}px` }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
                      )}
                      </div>
                    }
                    {activeState === "fusion" &&
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {[...Array(3)].map((_, i) =>
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8 - i * 2, repeat: Infinity, ease: "linear" }}>
                            <div
                          className="w-16 h-16 md:w-24 md:h-24 border-2 border-yellow-400/40"
                          style={{ transform: `translate(-50%, -50%) translateX(${50 + i * 25}px)` }} />
                          </motion.div>
                      )}
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-500/30 backdrop-blur animate-pulse-slow" />
                      </div>
                    }
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="relative z-10 flex-1 p-4 sm:p-6 md:p-8 flex flex-col">
                <div className="mt-auto">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`icon-${activeState}`}
                        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 sm:p-4 md:p-5 bg-white/10 backdrop-blur-xl border border-white/20"
                        style={{ boxShadow: `0 0 40px ${activeContent.color}50` }}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                      </motion.div>
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/15 border border-green-400/40">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-wider text-green-300">
                          Status: loading
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`content-${activeState}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}>
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1.5 sm:mb-2 text-white tracking-tight drop-shadow-lg">
                            {activeContent.title}
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg text-white/70 font-light">
                            {activeContent.subtitle}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-4 sm:mb-6 max-w-xl">
                          {activeContent.description}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {activeContent.tags.map((tag, i) =>
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/10 border border-white/20 text-[10px] sm:text-xs md:text-sm font-semibold text-white backdrop-blur">
                              {tag}
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2">

            <div className="mb-3 sm:mb-4 md:mb-6">
              <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-[#CCFF00]">
                UNSERE SERVICES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-black">
              Zwei Bereiche. Eine Vision.
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-xl">
              Steuerbare Systeme beginnen nicht mit Technologie, sondern mit Klarheit über Marke, Struktur und Entscheidungslogik.<br />
              Ohne diese Grundlage führen neue Tools und KI zu mehr Komplexität statt zu mehr Kontrolle. Das Ergebnis sind steigende Kosten, operative Komplexität und neue Abhängigkeiten.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-xl mt-4 sm:mt-6">
              Unsere Arbeit folgt deshalb einer klaren Reihenfolge:
              <br />
              Klarheit im Studio. Umsetzung im Lab.
            </p>
            

            
          </motion.div>
        </div>

        {/* Quick Navigation Grid */}
      </div>
    </section>);

};