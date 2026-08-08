import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  FileText,
  Image,
  Mail,
  Smartphone,
  CheckCircle2
} from "lucide-react";

interface TemplateCard {
  id: string;
  Icon: React.ElementType;
  label: string;
  color: string;
  delay: number;
}

export const ContentCreationAnimation: React.FC = () => {
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);
  const [colorRotation, setColorRotation] = useState(0);

  const templates: TemplateCard[] = [
    { id: "post", Icon: Image, label: "Post", color: "from-pink-500 to-purple-500", delay: 0 },
    { id: "ad", Icon: Smartphone, label: "Ad", color: "from-purple-500 to-indigo-500", delay: 0.5 },
    { id: "newsletter", Icon: Mail, label: "Newsletter", color: "from-indigo-500 to-blue-500", delay: 1 },
    { id: "landing", Icon: FileText, label: "Landingpage", color: "from-blue-500 to-cyan-500", delay: 1.5 },
  ];

  useEffect(() => {
    // Animate templates docking
    const templateInterval = setInterval(() => {
      setActiveTemplates((prev) => {
        if (prev.length >= templates.length) {
          return [];
        }
        return [...prev, templates[prev.length].id];
      });
    }, 1200);

    // Rotate color palette
    const colorInterval = setInterval(() => {
      setColorRotation((prev) => (prev + 1) % 360);
    }, 50);

    return () => {
      clearInterval(templateInterval);
      clearInterval(colorInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-900/20 via-violet-900/20 to-fuchsia-900/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="content-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#content-grid)" />
        </svg>
      </div>

      {/* Template cards flying in from left */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 space-y-3 md:space-y-4">
        {templates.map((template, idx) => {
          const isActive = activeTemplates.includes(template.id);
          const IconComponent = template.Icon;
          return (
            <motion.div
              key={template.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ 
                x: isActive ? 0 : -100, 
                opacity: isActive ? 1 : 0 
              }}
              transition={{ duration: 0.5, delay: template.delay }}
              className="flex items-center gap-2"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-[10px] md:text-xs text-purple-200 font-medium">{template.label}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Central design system hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Rotating color ring */}
          <motion.div
            className="w-36 h-36 md:w-44 md:h-44 rounded-full"
            style={{
              background: `conic-gradient(from ${colorRotation}deg, #ec4899, #CCFF00, #3b82f6, #06b6d4, #10b981, #eab308, #ef4444, #ec4899)`,
              opacity: 0.3,
            }}
          />
          
          {/* Inner rings */}
          <div className="absolute inset-3 rounded-full border border-purple-400/40" />
          <div className="absolute inset-6 rounded-full border border-purple-400/60" />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.4)", 
                  "0 0 40px rgba(168, 85, 247, 0.6)", 
                  "0 0 20px rgba(168, 85, 247, 0.4)"
                ] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Palette className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </motion.div>
          </div>

          {/* Connection lines to templates */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {templates.map((template, idx) => {
              const isActive = activeTemplates.includes(template.id);
              const angle = -90 + idx * 30;
              const startX = 72;
              const startY = 72;
              const endX = -60;
              const endY = -60 + idx * 30;
              
              return (
                <motion.line
                  key={template.id}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(168, 85, 247, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isActive ? 1 : 0,
                    opacity: isActive ? 0.6 : 0
                  }}
                  transition={{ duration: 0.5, delay: template.delay }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-purple-500/30"
        >
          <FileText className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
          <div>
            <div className="text-[10px] md:text-xs text-purple-300">Templates</div>
            <div className="text-xs md:text-sm font-bold text-white">{activeTemplates.length}/4 erstellt</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-fuchsia-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-fuchsia-500/30"
        >
          <Palette className="w-3 h-3 md:w-4 md:h-4 text-fuchsia-400" />
          <div>
            <div className="text-[10px] md:text-xs text-fuchsia-300">Design-System</div>
            <div className="text-xs md:text-sm font-bold text-white">Aktiv</div>
          </div>
        </motion.div>
      </div>

      {/* Status badge */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <motion.div 
          className="bg-purple-900/50 backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-3 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-purple-200 text-xs md:text-sm">
              Phase 2: Kreation & Content-Bibliothek
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentCreationAnimation;
