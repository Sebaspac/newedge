import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  Clock,
  MousePointer2,
  XCircle
} from "lucide-react";

interface FloatingIcon {
  id: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  Icon: React.ElementType;
  color: string;
}

export const MarketingChaosAnimation: React.FC = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const socialIcons: FloatingIcon[] = [
      { id: "ig-1", x: 15, y: 20, rotation: -15, delay: 0, Icon: Instagram, color: "text-pink-400" },
      { id: "fb-1", x: 75, y: 25, rotation: 12, delay: 0.1, Icon: Facebook, color: "text-blue-400" },
      { id: "mail-1", x: 25, y: 65, rotation: -8, delay: 0.2, Icon: Mail, color: "text-green-400" },
      { id: "cal-1", x: 80, y: 70, rotation: 20, delay: 0.3, Icon: Calendar, color: "text-purple-400" },
      { id: "ig-2", x: 45, y: 15, rotation: 5, delay: 0.4, Icon: Instagram, color: "text-pink-400" },
      { id: "mail-2", x: 60, y: 80, rotation: -12, delay: 0.5, Icon: Mail, color: "text-green-400" },
      { id: "fb-2", x: 10, y: 45, rotation: 18, delay: 0.6, Icon: Facebook, color: "text-blue-400" },
      { id: "cal-2", x: 85, y: 45, rotation: -5, delay: 0.7, Icon: Calendar, color: "text-purple-400" },
    ];
    setIcons(socialIcons);

    // Animate stressed cursor moving around frantically
    const positions = [
      { x: 20, y: 30 },
      { x: 70, y: 20 },
      { x: 30, y: 70 },
      { x: 80, y: 60 },
      { x: 50, y: 40 },
      { x: 15, y: 50 },
    ];

    let posIndex = 0;
    const moveCursor = () => {
      setCursorPosition(positions[posIndex]);
      posIndex = (posIndex + 1) % positions.length;
    };

    moveCursor();
    const interval = setInterval(moveCursor, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[240px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 rounded-2xl sm:rounded-3xl border border-red-500/30 overflow-hidden" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(0, 0, 0)' }}>
      {/* Chaotic background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="marketing-chaos-grid" width="24" height="24" patternUnits="userSpaceOnUse" className="sm:hidden">
              <path d="M 0 12 L 24 12 M 12 0 L 12 24" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" strokeDasharray="4 4" />
            </pattern>
            <pattern id="marketing-chaos-grid-md" width="40" height="40" patternUnits="userSpaceOnUse" className="hidden sm:block">
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" strokeDasharray="4 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#marketing-chaos-grid)" className="sm:hidden" />
          <rect width="100%" height="100%" fill="url(#marketing-chaos-grid-md)" className="hidden sm:block" />
        </svg>
      </div>

      {/* Scattered social media icons */}
      {icons.map((icon) => {
        const IconComponent = icon.Icon;
        return (
          <motion.div
            key={icon.id}
            className="absolute"
            style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
            initial={{ opacity: 0, scale: 0, rotate: icon.rotation }}
            animate={{ 
              opacity: 0.7, 
              scale: 1, 
              rotate: icon.rotation,
              y: [0, -8, 0, 8, 0],
              x: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              delay: icon.delay, 
              duration: 0.5,
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: icon.delay },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: icon.delay + 0.5 }
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)' }}>
              <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${icon.color}`} />
            </div>
          </motion.div>
        );
      })}

      {/* Frantic cursor */}
      <motion.div
        className="absolute z-10"
        animate={{
          left: `${cursorPosition.x}%`,
          top: `${cursorPosition.y}%`,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          {/* Stress circle */}
          <motion.div
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-dashed border-red-400/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Cursor icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500/80 to-orange-600/80 rounded-full flex items-center justify-center border-2 border-red-400/50 shadow-lg shadow-red-500/30">
              <MousePointer2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>

          {/* X marks showing confusion */}
          <motion.div
            className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1"
            animate={{ rotate: [0, 10, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-red-400" />
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
          <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-red-400" />
          <div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-red-300">Kanäle</div>
            <motion.div 
              className="text-[10px] sm:text-xs md:text-sm font-bold text-white"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              5 unkoordiniert
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
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-orange-400" />
          <div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-orange-300">Automation</div>
            <div className="text-[10px] sm:text-xs md:text-sm font-bold text-white">0%</div>
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
              Manuelles Marketing · Kein Template-System · Keine Automation
            </span>
          </div>
        </motion.div>
      </div>

      {/* Broken connection lines */}
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

export default MarketingChaosAnimation;