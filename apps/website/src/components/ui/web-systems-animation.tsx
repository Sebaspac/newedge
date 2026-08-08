import { motion, AnimatePresence } from "framer-motion";
import { Globe, Layout, Link2, Plug, Shield, AlertTriangle, Check } from "lucide-react";
import { useState, useEffect } from "react";

// Professional easing curve
const elegantEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const WebSystemsAnimation = () => {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Web-Architektur", checked: false },
    { id: 2, label: "CMS & Datenlogik", checked: false },
    { id: 3, label: "System-Integration", checked: false },
    { id: 4, label: "Skalierbarkeit", checked: false },
  ]);
  const [activeDeliverables, setActiveDeliverables] = useState<number[]>([]);
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const deliverables = [
    { icon: Layout, label: "CMS" },
    { icon: Link2, label: "API-Layer" },
    { icon: Plug, label: "Integration" },
    { icon: Shield, label: "Sicherheit" },
  ];

  const problems = [
    { label: "Isolierte Website", delay: 0.6 },
    { label: "Keine System-Anbindung", delay: 0.8 },
  ];

  // Reduced nodes for cleaner look
  const nodes = [
    { x: -35, y: -30 },
    { x: 35, y: -30 },
    { x: -35, y: 30 },
    { x: 35, y: 30 },
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

    // Slower pulse animation for nodes
    const pulseInterval = setInterval(() => {
      setPulseNodes((prev) => {
        if (prev.length >= nodes.length) return [];
        return [...prev, prev.length];
      });
    }, 1800);

    return () => {
      clearTimeout(initTimer);
      clearInterval(checkInterval);
      clearInterval(deliverableInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[240px] md:h-[400px] lg:h-[450px] bg-gradient-to-br from-yellow-950/90 via-amber-900/80 to-orange-900/90 overflow-hidden border border-yellow-500/20">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(253, 224, 71, 0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(253, 224, 71, 0.2) 1px, transparent 1px)`,
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

      {/* Central Hub with Network Nodes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Network Lines */}
        <svg className="absolute w-28 h-28 md:w-40 md:h-40" style={{ left: '-56px', top: '-56px' }}>
          {nodes.map((node, idx) => (
            <motion.line
              key={idx}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${node.x}px)`}
              y2={`calc(50% + ${node.y}px)`}
              stroke={pulseNodes.includes(idx) ? "#fde047" : "#fbbf24"}
              strokeWidth="1"
              strokeDasharray="4 2"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: pulseNodes.includes(idx) ? 0.6 : 0.2 }}
              transition={{ duration: 0.8, ease: elegantEase }}
            />
          ))}
        </svg>

        {/* Network Nodes */}
        {nodes.map((node, idx) => (
          <motion.div
            key={idx}
            className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
            style={{ left: `calc(50% + ${node.x}px - 4px)`, top: `calc(50% + ${node.y}px - 4px)` }}
            animate={{
              scale: pulseNodes.includes(idx) ? [1, 1.2, 1] : 1,
              backgroundColor: pulseNodes.includes(idx) ? "#fde047" : "#fbbf24",
            }}
            transition={{ duration: 0.8, ease: elegantEase }}
          />
        ))}

        {/* Outer Ring - slower */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.4, ease: elegantEase },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-dashed border-yellow-400/20"
        />

        {/* Inner Ring - slower */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInitialized ? 1 : 0, rotate: -360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.5, ease: elegantEase },
            rotate: { duration: 45, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-16 h-16 md:w-28 md:h-28 rounded-full border border-amber-400/30"
        />

        {/* Core - subtle pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 0 20px rgba(253, 224, 71, 0.3)",
              "0 0 35px rgba(251, 191, 36, 0.4)",
              "0 0 20px rgba(253, 224, 71, 0.3)",
            ],
          }}
          transition={{ 
            opacity: { duration: 0.4 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center z-10"
        >
          <Globe className="w-6 h-6 md:w-10 md:h-10 text-white" />
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
                ? "bg-yellow-500/20 border border-yellow-500/30"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <motion.div
              animate={item.checked ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4, ease: elegantEase }}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                item.checked ? "bg-yellow-500" : "bg-white/20"
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
                    ? "bg-gradient-to-br from-yellow-500 to-amber-500"
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
                    ? "text-amber-300"
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
        className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2 bg-yellow-500/20 border border-yellow-500/20 px-2 md:px-3 py-0.5 md:py-1.5"
      >
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400"
        />
        <span className="text-[8px] md:text-xs text-gray-200 font-medium">
          Plattform-Architektur wird aufgebaut
        </span>
      </motion.div>
    </div>
  );
};
