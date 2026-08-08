import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Brain, ShieldCheck, FileCheck, BarChart3, CheckCircle2, ClipboardCheck } from "lucide-react";

const elegantEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const KiAuditAnimation = () => {
  const [activeElements, setActiveElements] = useState<number[]>([]);
  const [colorRotation, setColorRotation] = useState(0);
  const [activeDeliverables, setActiveDeliverables] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const analysisElements = [
    { icon: Search, label: "Prozesse & Tools", status: "Erfasst" },
    { icon: Brain, label: "KI-Potenziale", status: "Bewertet" },
    { icon: ShieldCheck, label: "Daten & Risiken", status: "Geprüft" },
  ];

  const deliverables = [
    { icon: Search, label: "Prozesse" },
    { icon: Brain, label: "KI-Chancen" },
    { icon: ShieldCheck, label: "Risiken" },
    { icon: FileCheck, label: "Governance" },
    { icon: ClipboardCheck, label: "Go/No-Go" },
  ];

  useEffect(() => {
    const initTimer = setTimeout(() => setIsInitialized(true), 400);

    const elementsInterval = setInterval(() => {
      setActiveElements(prev => {
        if (prev.length >= 3) return [];
        return [...prev, prev.length];
      });
    }, 3200);

    const colorInterval = setInterval(() => {
      setColorRotation(prev => (prev + 8) % 360);
    }, 200);

    const deliverableInterval = setInterval(() => {
      setActiveDeliverables(prev => {
        if (prev.length >= 5) return [];
        return [...prev, prev.length];
      });
    }, 2400);

    return () => {
      clearTimeout(initTimer);
      clearInterval(elementsInterval);
      clearInterval(colorInterval);
      clearInterval(deliverableInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[240px] md:h-[400px] lg:h-[450px] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-900 border border-purple-500/20">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(168, 85, 247, 0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Analysis Elements - Left */}
      <motion.div
        className="absolute left-3 md:left-6 lg:left-8 top-[20%] md:top-1/4 space-y-1.5 md:space-y-3 max-w-[110px] md:max-w-[160px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: elegantEase }}
      >
        <AnimatePresence>
          {analysisElements.map((element, idx) => {
            const Icon = element.icon;
            const isActive = activeElements.includes(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -5 }}
                transition={{ duration: 0.6, ease: elegantEase }}
                className={`flex items-center gap-1.5 md:gap-2 px-1.5 md:px-3 py-1 md:py-2 transition-all duration-500 ${
                  isActive
                    ? 'bg-slate-800/70 backdrop-blur-sm border border-purple-500/30 shadow-lg'
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              >
                <div className={`w-5 h-5 md:w-7 md:h-7 flex items-center justify-center transition-colors duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                    : 'bg-slate-700'
                }`}>
                  <Icon className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  <p className={`text-[8px] md:text-xs font-semibold transition-colors duration-500 ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                    {element.label}
                  </p>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: elegantEase }}
                      className="text-[7px] md:text-[10px] text-emerald-400 flex items-center gap-0.5 md:gap-1"
                    >
                      <CheckCircle2 className="w-2 h-2 md:w-3 md:h-3" />
                      {element.status}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Central Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Rotating Radar Ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 0.25 : 0, rotate: colorRotation }}
          transition={{ opacity: { duration: 0.6, delay: 0.4, ease: elegantEase } }}
          className="absolute w-20 h-20 md:w-44 md:h-44 rounded-full"
          style={{
            background: `conic-gradient(from ${colorRotation}deg, #CCFF00, #CCFF00, #CCFF00, transparent, #CCFF00)`,
          }}
        />

        {/* Dashed Rings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: -360 }}
          transition={{
            opacity: { duration: 0.6, delay: 0.5, ease: elegantEase },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-16 h-16 md:w-36 md:h-36"
        >
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: 360 }}
          transition={{
            opacity: { duration: 0.6, delay: 0.6, ease: elegantEase },
            rotate: { duration: 45, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-12 h-12 md:w-28 md:h-28"
        >
          <div className="absolute inset-0 rounded-full border border-indigo-500/30" />
        </motion.div>

        {/* Center Search Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: [1, 1.02, 1]
          }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-10 h-10 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 z-10"
        >
          <Search className="w-5 h-5 md:w-10 md:h-10 text-white" />
        </motion.div>
      </div>

      {/* Result Cards - Right */}
      <motion.div
        className="absolute right-3 md:right-6 lg:right-8 top-[20%] md:top-1/4 space-y-1.5 md:space-y-3 max-w-[100px] md:max-w-[140px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: elegantEase }}
      >
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.5, ease: elegantEase }}
          className="bg-slate-800/60 backdrop-blur-sm border border-purple-500/20 p-1.5 md:p-3 shadow-lg"
        >
          <div className="flex items-center gap-1 md:gap-2">
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400"
            />
            <span className="text-[8px] md:text-xs font-medium text-slate-300">Governance</span>
          </div>
          <p className="text-[7px] md:text-[10px] text-slate-500 mt-0.5 md:mt-1">In Bewertung...</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: elegantEase }}
          className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 p-1.5 md:p-3 shadow-lg"
        >
          <div className="flex items-center gap-1 md:gap-2">
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400"
            />
            <span className="text-[8px] md:text-xs font-medium text-slate-300">Empfehlung</span>
          </div>
          <p className="text-[7px] md:text-[10px] text-emerald-400 mt-0.5 md:mt-1">Go-Entscheidung ✓</p>
        </motion.div>
      </motion.div>

      {/* Deliverables - Bottom */}
      <motion.div
        className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5 md:gap-1.5 flex-wrap justify-center max-w-[95%] md:max-w-[85%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: elegantEase }}
      >
        <AnimatePresence>
          {deliverables.map((del, idx) => {
            const Icon = del.icon;
            const isActive = activeDeliverables.includes(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 4 }}
                transition={{ duration: 0.6, ease: elegantEase }}
                className={`flex flex-col items-center gap-0.5 px-1 py-0.5 md:px-2 md:py-1.5 transition-colors duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30'
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              >
                <Icon className={`w-2.5 h-2.5 md:w-4 md:h-4 transition-colors duration-500 ${isActive ? 'text-purple-300' : 'text-slate-600'}`} />
                <span className={`text-[6px] md:text-[10px] font-medium transition-colors duration-500 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                  {del.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Status Badge - Top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: elegantEase }}
        className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 bg-slate-800/70 backdrop-blur-sm border border-purple-500/20 px-1.5 md:px-3 py-0.5 md:py-1.5 flex items-center gap-1 md:gap-2 shadow-lg"
      >
        <motion.span
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
        />
        <span className="text-[7px] md:text-xs font-medium text-slate-300">KI-Audit wird durchgeführt</span>
      </motion.div>
    </div>
  );
};
