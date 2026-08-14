import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  CheckCircle2,
  Search,
  BarChart3,
  FileCheck
} from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export const StrategyPlanningAnimation: React.FC = () => {
  const [scanY, setScanY] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Prozesse analysiert", checked: false },
    { id: "2", label: "Bottlenecks identifiziert", checked: false },
    { id: "3", label: "KPIs definiert", checked: false },
    { id: "4", label: "Strategie entwickelt", checked: false },
  ]);
  const [currentCheck, setCurrentCheck] = useState(0);

  useEffect(() => {
    // Scanning animation
    const scanInterval = setInterval(() => {
      setScanY((prev) => (prev + 1) % 100);
    }, 30);

    // Checklist animation
    const checkInterval = setInterval(() => {
      setCurrentCheck((prev) => {
        const next = (prev + 1) % 5;
        setChecklist((items) =>
          items.map((item, idx) => ({
            ...item,
            checked: idx < next,
          }))
        );
        return next;
      });
    }, 1500);

    return () => {
      clearInterval(scanInterval);
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 rounded-3xl border border-blue-500/30 backdrop-blur-sm overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="strategy-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#strategy-grid)" />
        </svg>
      </div>

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        style={{ top: `${scanY}%` }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Central target */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Outer rings */}
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-blue-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-blue-400/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-blue-400/70"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40"
              animate={{ boxShadow: ["0 0 20px rgba(59, 130, 246, 0.4)", "0 0 40px rgba(59, 130, 246, 0.6)", "0 0 20px rgba(59, 130, 246, 0.4)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </motion.div>
          </div>

          {/* Orbiting data points */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-blue-400 rounded-full"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [Math.cos(i * Math.PI / 2) * 60, Math.cos(i * Math.PI / 2 + Math.PI * 2) * 60],
                y: [Math.sin(i * Math.PI / 2) * 60, Math.sin(i * Math.PI / 2 + Math.PI * 2) * 60],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Audit checklist */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-blue-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-blue-500/30 mb-3"
        >
          <FileCheck className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
          <span className="text-[10px] md:text-xs text-blue-200 font-semibold">Marketing-Audit</span>
        </motion.div>
        
        {checklist.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ 
                scale: item.checked ? [1, 1.2, 1] : 1,
                backgroundColor: item.checked ? "rgba(34, 197, 94, 0.8)" : "rgba(59, 130, 246, 0.3)"
              }}
              className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border border-blue-400/50"
            >
              {item.checked && <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />}
            </motion.div>
            <span className={`text-[10px] md:text-xs ${item.checked ? "text-green-300" : "text-blue-200/70"}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-blue-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-blue-500/30"
        >
          <Search className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
          <div>
            <div className="text-[10px] md:text-xs text-blue-300">Analyse</div>
            <div className="text-xs md:text-sm font-bold text-white">In Bearbeitung</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-indigo-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-indigo-500/30"
        >
          <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" />
          <div>
            <div className="text-[10px] md:text-xs text-indigo-300">Datenpunkte</div>
            <div className="text-xs md:text-sm font-bold text-white">42 erfasst</div>
          </div>
        </motion.div>
      </div>

      {/* Status badge */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <motion.div 
          className="bg-blue-900/50 backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-3 border border-blue-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-2 h-2 rounded-full bg-blue-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-blue-200 text-xs md:text-sm">
              Phase 1: Strategie & Konzeption aktiv
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StrategyPlanningAnimation;
