import { motion, AnimatePresence } from "framer-motion";
import { Video, Film, Camera, Sparkles, AlertTriangle, Check, Clapperboard } from "lucide-react";
import { useState, useEffect } from "react";

// Professional easing curve
const elegantEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const ContentProductionAnimation = () => {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Konzeption", checked: false },
    { id: 2, label: "Produktion", checked: false },
    { id: 3, label: "Post-Production", checked: false },
    { id: 4, label: "Delivery", checked: false },
  ]);
  const [activeDeliverables, setActiveDeliverables] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const deliverables = [
    { icon: Video, label: "Videos" },
    { icon: Sparkles, label: "Motion" },
    { icon: Camera, label: "Creatives" },
    { icon: Clapperboard, label: "Reels" },
  ];

  const problems = [
    { label: "Keine Kapazitäten", delay: 0.6 },
    { label: "Inkonsistente Qualität", delay: 0.8 },
  ];

  useEffect(() => {
    // Staggered initialization
    const initTimer = setTimeout(() => setIsInitialized(true), 400);

    // Slower checklist animation
    const checkInterval = setInterval(() => {
      setCurrentCheck((prev) => {
        const next = prev + 1;
        if (next <= checklist.length) {
          setChecklist((list) =>
            list.map((item, idx) =>
              idx < next ? { ...item, checked: true } : item
            )
          );
        }
        return next > checklist.length ? 0 : next;
      });
    }, 3500);

    // Slower deliverables animation
    const deliverableInterval = setInterval(() => {
      setActiveDeliverables((prev) => {
        if (prev.length >= deliverables.length) return [];
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
    <div className="relative w-full h-[240px] md:h-[400px] lg:h-[450px] bg-gradient-to-br from-blue-950/90 via-cyan-900/80 to-blue-900/90 overflow-hidden border border-blue-500/20">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Problems - Left Side */}
      <motion.div 
        className="absolute left-3 md:left-6 lg:left-8 top-[20%] md:top-1/4 space-y-1.5 md:space-y-3 z-10 max-w-[120px] md:max-w-[180px]"
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
            <span className="text-[8px] md:text-sm text-red-300 font-medium leading-tight">
              {problem.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Central Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Outer Ring - slower */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.4, ease: elegantEase },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-dashed border-blue-400/20"
        />

        {/* Inner Ring - slower */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: -360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.5, ease: elegantEase },
            rotate: { duration: 45, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-16 h-16 md:w-28 md:h-28 rounded-full border border-cyan-400/30"
        />

        {/* Core - subtle pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 35px rgba(6, 182, 212, 0.4)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{ 
            opacity: { duration: 0.4 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center z-10"
        >
          <Film className="w-6 h-6 md:w-10 md:h-10 text-white" />
        </motion.div>
      </div>

      {/* Solution Checklist - Right Side */}
      <motion.div 
        className="absolute right-3 md:right-6 lg:right-8 top-[20%] md:top-1/4 space-y-1 md:space-y-2 z-10 max-w-[130px] md:max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: elegantEase }}
      >
        {checklist.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + idx * 0.1, duration: 0.5, ease: elegantEase }}
            className={`flex items-center gap-1 md:gap-2 px-1.5 md:px-3 py-1 md:py-2 transition-all duration-500 ${
              item.checked
                ? "bg-cyan-500/20 border border-cyan-500/30"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <motion.div
              animate={item.checked ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4, ease: elegantEase }}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                item.checked ? "bg-cyan-500" : "bg-white/20"
              }`}
            >
              {item.checked && <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />}
            </motion.div>
            <span
              className={`text-[8px] md:text-sm font-medium transition-colors duration-500 leading-tight ${
                item.checked ? "text-white" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Deliverables - Bottom */}
      <motion.div 
        className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialized ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: elegantEase }}
      >
        <AnimatePresence>
          {deliverables.map((del, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: activeDeliverables.includes(idx) ? 1 : 0.3,
                y: activeDeliverables.includes(idx) ? 0 : 5,
              }}
              transition={{ duration: 0.6, ease: elegantEase }}
              className="flex flex-col items-center gap-0.5 md:gap-1"
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-500 ${
                  activeDeliverables.includes(idx)
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                    : "bg-white/10"
                }`}
              >
                <del.icon
                  className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-500 ${
                    activeDeliverables.includes(idx)
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                />
              </div>
              <span
                className={`text-[7px] md:text-[10px] font-medium transition-colors duration-500 ${
                  activeDeliverables.includes(idx)
                    ? "text-cyan-300"
                    : "text-gray-500"
                }`}
              >
                {del.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: elegantEase }}
        className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2 bg-blue-500/20 border border-blue-500/20 px-2 md:px-3 py-0.5 md:py-1.5"
      >
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400"
        />
        <span className="text-[8px] md:text-xs text-gray-200 font-medium">
          Content Production
        </span>
      </motion.div>
    </div>
  );
};
