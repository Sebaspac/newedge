import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Clock, AlertTriangle, FolderOpen, HelpCircle } from "lucide-react";

interface FloatingDocument {
  id: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  type: "pdf" | "cad" | "doc" | "folder";
}

export const ChallengesAnimation: React.FC = () => {
  const [documents, setDocuments] = useState<FloatingDocument[]>([]);
  const [searchPhase, setSearchPhase] = useState(0);
  const [searchPosition, setSearchPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Generate scattered documents
    const docs: FloatingDocument[] = [
      { id: "doc-1", x: 15, y: 20, rotation: -15, delay: 0, type: "pdf" },
      { id: "doc-2", x: 75, y: 25, rotation: 12, delay: 0.1, type: "cad" },
      { id: "doc-3", x: 25, y: 65, rotation: -8, delay: 0.2, type: "doc" },
      { id: "doc-4", x: 80, y: 70, rotation: 20, delay: 0.3, type: "folder" },
      { id: "doc-5", x: 45, y: 15, rotation: 5, delay: 0.4, type: "pdf" },
      { id: "doc-6", x: 60, y: 80, rotation: -12, delay: 0.5, type: "doc" },
      { id: "doc-7", x: 10, y: 45, rotation: 18, delay: 0.6, type: "cad" },
      { id: "doc-8", x: 85, y: 45, rotation: -5, delay: 0.7, type: "folder" },
    ];
    setDocuments(docs);

    // Animate search cursor moving around
    const searchPositions = [
      { x: 30, y: 30 },
      { x: 70, y: 25 },
      { x: 20, y: 60 },
      { x: 75, y: 65 },
      { x: 50, y: 40 },
    ];

    let posIndex = 0;
    const moveSearch = () => {
      setSearchPosition(searchPositions[posIndex]);
      setSearchPhase((prev) => (prev + 1) % 4);
      posIndex = (posIndex + 1) % searchPositions.length;
    };

    moveSearch();
    const interval = setInterval(moveSearch, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDocIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-400" />;
      case "cad":
        return <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400" />;
      case "folder":
        return <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-yellow-400" />;
      default:
        return <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full h-[240px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 rounded-2xl sm:rounded-3xl border border-red-500/30 overflow-hidden" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(0, 0, 0)' }}>
      {/* Chaotic background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="chaos-grid" width="24" height="24" patternUnits="userSpaceOnUse" className="sm:hidden">
              <path d="M 0 12 L 24 12 M 12 0 L 12 24" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" strokeDasharray="4 4" />
            </pattern>
            <pattern id="chaos-grid-md" width="40" height="40" patternUnits="userSpaceOnUse" className="hidden sm:block">
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" strokeDasharray="4 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chaos-grid)" className="sm:hidden" />
          <rect width="100%" height="100%" fill="url(#chaos-grid-md)" className="hidden sm:block" />
        </svg>
      </div>

      {/* Scattered documents */}
      {documents.map((doc) => (
        <motion.div
          key={doc.id}
          className="absolute"
          style={{ left: `${doc.x}%`, top: `${doc.y}%` }}
          initial={{ opacity: 0, scale: 0, rotate: doc.rotation }}
          animate={{ 
            opacity: 0.7, 
            scale: 1, 
            rotate: doc.rotation,
            y: [0, -5, 0, 5, 0],
          }}
          transition={{ 
            delay: doc.delay, 
            duration: 0.5,
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: doc.delay }
          }}
        >
          <div className="w-7 h-8 sm:w-8 sm:h-10 md:w-10 md:h-12 lg:w-12 lg:h-14 bg-white/10 border border-white/20 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(-50%, -50%, 0)' }}>
            {getDocIcon(doc.type)}
          </div>
        </motion.div>
      ))}

      {/* Animated search cursor */}
      <motion.div
        className="absolute z-10"
        animate={{
          left: `${searchPosition.x}%`,
          top: `${searchPosition.y}%`,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {/* Search circle */}
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-dashed border-orange-400/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Search icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500/80 to-red-600/80 rounded-full flex items-center justify-center border-2 border-orange-400/50 shadow-lg shadow-orange-500/30">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
          </div>

          {/* Question marks floating around */}
          <motion.div
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
            animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-0.5 -left-2 sm:-bottom-1 sm:-left-3"
            animate={{ y: [2, -2, 2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-red-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Status indicators */}
      <div className="absolute top-2 sm:top-3 md:top-4 lg:top-6 left-2 sm:left-3 md:left-4 lg:left-6 space-y-1.5 sm:space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 sm:gap-2 bg-red-900/40 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 border border-red-500/30"
          style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)', transform: 'translate3d(0, 0, 0)' }}
        >
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-red-400" />
          <div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-red-300">Suchzeit</div>
            <motion.div 
              className="text-[10px] sm:text-xs md:text-sm font-bold text-white"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ~2-3 Std/Tag
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1.5 sm:gap-2 bg-orange-900/40 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 border border-orange-500/30"
          style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)', transform: 'translate3d(0, 0, 0)' }}
        >
          <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-orange-400" />
          <div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-orange-300">Datensilos</div>
            <div className="text-[10px] sm:text-xs md:text-sm font-bold text-white">8+ Systeme</div>
          </div>
        </motion.div>
      </div>

      {/* Problem description badge */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 left-2 sm:left-3 md:left-4 lg:left-6 right-2 sm:right-3 md:right-4 lg:right-6">
        <motion.div 
          className="bg-red-900/50 rounded-md sm:rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-red-500/30"
          style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)', transform: 'translate3d(0, 0, 0)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-red-200 text-[10px] sm:text-xs md:text-sm">
              Fragmentiertes Wissen · Manuelle Suche · Wissenssilos
            </span>
          </div>
        </motion.div>
      </div>

      {/* Connecting lines (broken/dashed to show disconnection) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <motion.line
          x1="20%" y1="25%" x2="45%" y2="50%"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line
          x1="75%" y1="30%" x2="55%" y2="50%"
          stroke="#f97316"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.line
          x1="25%" y1="70%" x2="45%" y2="55%"
          stroke="#eab308"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.line
          x1="80%" y1="65%" x2="55%" y2="55%"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </svg>
    </div>
  );
};

export default ChallengesAnimation;