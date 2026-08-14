import { motion, AnimatePresence, type Transition } from "framer-motion";
import { useState, useEffect } from "react";
import { Target, AlertTriangle, CheckCircle2, Users, Map, Compass, Heart, Route } from "lucide-react";

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

// Professional easing curve
const elegantEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const BrandStrategyAnimation = () => {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, label: "Marktanalyse", checked: false },
    { id: 2, label: "Positionierung definiert", checked: false },
    { id: 3, label: "Brand Core entwickelt", checked: false },
    { id: 4, label: "Roadmap erstellt", checked: false },
  ]);
  const [activeDeliverables, setActiveDeliverables] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const deliverables = [
    { icon: Users, label: "Personas" },
    { icon: Map, label: "Positioning Map" },
    { icon: Compass, label: "Differentiation" },
    { icon: Heart, label: "Brand Core" },
    { icon: Route, label: "Roadmap" },
  ];

  const problems = [
    { label: "Keine Positionierung", delay: 0.6 },
    { label: "Inkonsistente Kommunikation", delay: 0.8 },
  ];

  useEffect(() => {
    // Staggered initialization
    const initTimer = setTimeout(() => setIsInitialized(true), 400);

    // Slower checklist animation
    const checkInterval = setInterval(() => {
      setCurrentCheck(prev => {
        const next = (prev + 1) % 5;
        if (next > 0 && next <= 4) {
          setChecklist(list => 
            list.map((item, idx) => 
              idx === next - 1 ? { ...item, checked: true } : item
            )
          );
        }
        if (next === 0) {
          setChecklist(list => list.map(item => ({ ...item, checked: false })));
        }
        return next;
      });
    }, 3500);

    // Slower deliverables animation
    const deliverableInterval = setInterval(() => {
      setActiveDeliverables(prev => {
        if (prev.length >= 5) return [];
        return [...prev, prev.length];
      });
    }, 2800);

    return () => {
      clearTimeout(initTimer);
      clearInterval(checkInterval);
      clearInterval(deliverableInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[240px] md:h-[400px] lg:h-[450px] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/20">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Problems Section - Left */}
      <motion.div 
        className="absolute left-3 md:left-6 lg:left-8 top-[20%] md:top-1/4 space-y-1.5 md:space-y-3 max-w-[120px] md:max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, ease: elegantEase }}
      >
        {problems.map((problem, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isInitialized ? 1 : 0, x: isInitialized ? 0 : -20 }}
            transition={{ delay: problem.delay, duration: 0.6, ease: elegantEase }}
            className="flex items-center gap-1 md:gap-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 px-1.5 md:px-3 py-1 md:py-2"
          >
            <AlertTriangle className="w-2.5 h-2.5 md:w-4 md:h-4 text-red-400 flex-shrink-0" />
            <span className="text-[8px] md:text-sm text-red-300 font-medium leading-tight">{problem.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Central Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Rotating Rings - much slower */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.4, ease: elegantEase },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-16 h-16 md:w-40 md:h-40"
        >
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: -360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.5, ease: elegantEase },
            rotate: { duration: 45, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-12 h-12 md:w-32 md:h-32"
        >
          <div className="absolute inset-0 rounded-full border border-purple-500/30" />
        </motion.div>

        {/* Center Target Icon - subtle pulse */}
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
          className="relative w-10 h-10 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10"
        >
          <Target className="w-5 h-5 md:w-10 md:h-10 text-white" />
        </motion.div>

        {/* Orbiting Data Points - reduced to 2, slower */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInitialized ? 1 : 0, rotate: 360 }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.6 + i * 0.2, ease: elegantEase },
              rotate: { duration: 24, repeat: Infinity, ease: "linear", delay: i * 12 }
            }}
            className="absolute w-16 h-16 md:w-40 md:h-40"
            style={{ transformOrigin: "center center" }}
          >
            <motion.div 
              className="absolute w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
              style={{ 
                top: 0, 
                left: '50%', 
                transform: 'translateX(-50%)' 
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Solution Checklist - Right */}
      <motion.div 
        className="absolute right-3 md:right-6 lg:right-8 top-[20%] md:top-1/4 space-y-1.5 md:space-y-2 max-w-[130px] md:max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: elegantEase }}
      >
        <div className="bg-slate-800/60 backdrop-blur-sm border border-indigo-500/20 p-1.5 md:p-4 shadow-lg">
          <h4 className="text-[7px] md:text-xs font-bold text-indigo-300 mb-1 md:mb-2 uppercase tracking-wide">Strategie-Prozess</h4>
          <div className="space-y-1 md:space-y-2">
            {checklist.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + idx * 0.1, duration: 0.5, ease: elegantEase }}
                className="flex items-center gap-1 md:gap-2"
              >
                <motion.div
                  animate={item.checked ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.4, ease: elegantEase }}
                >
                  <CheckCircle2 
                    className={`w-2.5 h-2.5 md:w-4 md:h-4 transition-colors duration-500 flex-shrink-0 ${
                      item.checked ? 'text-emerald-400' : 'text-slate-600'
                    }`} 
                  />
                </motion.div>
                <span className={`text-[8px] md:text-sm transition-colors duration-500 leading-tight ${
                  item.checked ? 'text-slate-200 font-medium' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Deliverables - Bottom */}
      <motion.div 
        className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5 md:gap-2"
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
                initial={{ opacity: 0, y: 15 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 5 }}
                transition={{ duration: 0.6, ease: elegantEase }}
                className={`flex flex-col items-center gap-0.5 px-1 md:px-2 py-0.5 md:py-1.5 transition-colors duration-500 ${
                  isActive 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30' 
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              >
                <Icon className={`w-2.5 h-2.5 md:w-4 md:h-4 transition-colors duration-500 ${isActive ? 'text-indigo-300' : 'text-slate-600'}`} />
                <span className={`text-[6px] md:text-[10px] font-medium transition-colors duration-500 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                  {del.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: elegantEase }}
        className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 bg-slate-800/70 backdrop-blur-sm border border-indigo-500/20 px-1.5 md:px-3 py-0.5 md:py-1.5 flex items-center gap-1 md:gap-2 shadow-lg"
      >
        <motion.span 
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
        />
        <span className="text-[7px] md:text-xs font-medium text-slate-300">Strategische Roadmap wird erstellt</span>
      </motion.div>
    </div>
  );
};
