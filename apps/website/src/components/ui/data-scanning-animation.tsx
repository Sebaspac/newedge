import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileSearch, BarChart3, PieChart, TrendingUp, Database } from "lucide-react";

interface ScanLine {
  id: string;
  y: number;
}

interface DataPoint {
  id: string;
  x: number;
  y: number;
  type: "circle" | "square" | "triangle";
  color: string;
}

const colors = ["#CCFF00", "#CCFF00", "#CCFF00", "#CCFF00", "#22d3ee"];

export const DataScanningAnimation: React.FC = () => {
  const [scanLines, setScanLines] = useState<ScanLine[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Generate initial data points
    const initialPoints: DataPoint[] = Array.from({ length: 12 }, (_, i) => ({
      id: `point-${i}`,
      x: 20 + Math.random() * 60,
      y: 15 + Math.random() * 70,
      type: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as "circle" | "square" | "triangle",
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setDataPoints(initialPoints);

    // Scanning animation loop
    const scanInterval = setInterval(() => {
      const newScanLine: ScanLine = {
        id: `scan-${Date.now()}`,
        y: 0,
      };
      setScanLines((prev) => [...prev, newScanLine]);
      setIsAnalyzing(true);
      setProgress(0);

      // Animate progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);

      setTimeout(() => {
        setScanLines((prev) => prev.filter((line) => line.id !== newScanLine.id));
        setIsAnalyzing(false);
      }, 2000);
    }, 3000);

    // Initial scan
    const initialScan: ScanLine = { id: `scan-init`, y: 0 };
    setScanLines([initialScan]);
    setIsAnalyzing(true);
    setTimeout(() => {
      setScanLines([]);
      setIsAnalyzing(false);
    }, 2000);

    return () => clearInterval(scanInterval);
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-800/30 to-purple-900/30 rounded-3xl border border-purple-500/30 backdrop-blur-sm overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Data points */}
      {dataPoints.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isAnalyzing ? [0.3, 1, 0.3] : 0.6, 
            scale: 1,
          }}
          transition={{ 
            delay: index * 0.05,
            duration: isAnalyzing ? 1 : 0.3,
            repeat: isAnalyzing ? Infinity : 0,
          }}
          className="absolute w-3 h-3 md:w-4 md:h-4"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
        >
          {point.type === "circle" && (
            <div 
              className="w-full h-full rounded-full"
              style={{ backgroundColor: point.color, boxShadow: `0 0 10px ${point.color}` }}
            />
          )}
          {point.type === "square" && (
            <div 
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: point.color, boxShadow: `0 0 10px ${point.color}` }}
            />
          )}
          {point.type === "triangle" && (
            <div 
              className="w-0 h-0"
              style={{ 
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: `12px solid ${point.color}`,
                filter: `drop-shadow(0 0 6px ${point.color})`,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Scanning lines */}
      <AnimatePresence>
        {scanLines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ top: "0%", opacity: 0.8 }}
            animate={{ top: "100%", opacity: [0.8, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.6)" }}
          />
        ))}
      </AnimatePresence>

      {/* Central analysis hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={isAnalyzing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isAnalyzing ? Infinity : 0 }}
        >
          <div className="relative">
          {/* Rotating outer ring */}
          <motion.div
            className="absolute -inset-4 md:-inset-6 rounded-full border-2 border-dashed border-purple-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={isAnalyzing ? {
              boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.3)",
                "0 0 40px rgba(34, 211, 238, 0.6)",
                "0 0 20px rgba(34, 211, 238, 0.3)",
              ],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Main icon */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-cyan-400/50">
            <Search className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
          </div>
          
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        </motion.div>
      </div>

      {/* Analysis metrics - left side */}
      <div className="absolute left-4 md:left-6 top-4 md:top-6 space-y-2 md:space-y-3">
        {[
          { icon: FileSearch, label: "Documents", value: "847" },
          { icon: Database, label: "Data Points", value: "12.4k" },
          { icon: BarChart3, label: "Patterns", value: "156" },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-purple-500/30"
          >
            <metric.icon className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] md:text-xs text-purple-300">{metric.label}</div>
              <motion.div 
                className="text-xs md:text-sm font-bold text-white"
                animate={isAnalyzing ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: isAnalyzing ? Infinity : 0 }}
              >
                {metric.value}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini charts - right side */}
      <div className="absolute right-4 md:right-6 top-4 md:top-6 space-y-2 md:space-y-3">
        {[PieChart, TrendingUp].map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="w-10 h-10 md:w-12 md:h-12 bg-purple-800/40 backdrop-blur-md rounded-lg border border-purple-500/30 flex items-center justify-center"
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <div className="bg-purple-900/50 backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-3 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-purple-200 text-xs md:text-sm">
                {isAnalyzing ? "Scanning..." : "Ready"}
              </span>
            </div>
            <span className="text-cyan-400 text-xs md:text-sm font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 md:h-2 bg-purple-800/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScanningAnimation;
