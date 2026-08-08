import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, FileText, MessageSquare, CheckCircle2, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TemplateCard {
  id: number;
  Icon: LucideIcon;
  label: string;
  color: string;
  delay: number;
}

export const OutreachCreationAnimation = () => {
  const [activeTemplates, setActiveTemplates] = useState<number[]>([]);
  const [sequenceStep, setSequenceStep] = useState(0);

  const templates: TemplateCard[] = [
    { id: 1, Icon: Mail, label: 'Cold E-Mail', color: 'purple', delay: 0 },
    { id: 2, Icon: Linkedin, label: 'LinkedIn', color: 'blue', delay: 0.5 },
    { id: 3, Icon: MessageSquare, label: 'Follow-up', color: 'cyan', delay: 1 },
    { id: 4, Icon: FileText, label: 'Nurturing', color: 'green', delay: 1.5 },
  ];

  useEffect(() => {
    // Activate templates sequentially
    const templateInterval = setInterval(() => {
      setActiveTemplates(prev => {
        if (prev.length >= templates.length) {
          return [];
        }
        return [...prev, prev.length + 1];
      });
    }, 1500);

    // Sequence step animation
    const sequenceInterval = setInterval(() => {
      setSequenceStep(prev => (prev + 1) % 5);
    }, 1000);

    return () => {
      clearInterval(templateInterval);
      clearInterval(sequenceInterval);
    };
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple': return { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' };
      case 'blue': return { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' };
      case 'cyan': return { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' };
      case 'green': return { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' };
      default: return { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' };
    }
  };

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-950/40 via-gray-900 to-indigo-950/30 overflow-hidden rounded-3xl border border-purple-500/30 backdrop-blur-sm">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Template cards */}
      {templates.map((template, i) => {
        const isActive = activeTemplates.includes(template.id);
        const colors = getColorClasses(template.color);
        const yPos = 20 + i * 18;
        
        return (
          <motion.div
            key={template.id}
            className={`absolute left-4 md:left-8 w-28 md:w-32 p-2 rounded-lg border ${colors.border} ${colors.bg} backdrop-blur-sm`}
            style={{ top: `${yPos}%` }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: 1, 
              x: isActive ? 20 : 0,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ delay: template.delay, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <template.Icon className={`w-4 h-4 ${colors.text}`} />
              <span className="text-xs text-gray-100">{template.label}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}

      {/* Central mail hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative w-24 h-24 md:w-32 md:h-32"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3), rgba(34, 211, 238, 0.3), rgba(168, 85, 247, 0.3))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-background/80 flex items-center justify-center border border-purple-500/30">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px rgba(168, 85, 247, 0.3)', '0 0 40px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.3)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mail className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Connection lines from templates to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {templates.map((template, i) => {
          const isActive = activeTemplates.includes(template.id);
          const yPos = 20 + i * 18;
          
          return (
            <motion.line
              key={template.id}
              x1="25%"
              y1={`${yPos + 2}%`}
              x2="50%"
              y2="50%"
              stroke={isActive ? "rgba(168, 85, 247, 0.5)" : "rgba(168, 85, 247, 0.2)"}
              strokeWidth="1"
              strokeDasharray={isActive ? "0" : "4 4"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isActive ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Sequence visualization */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2">
        <div className="text-xs text-purple-400 mb-3 flex items-center gap-2">
          <Send className="w-3 h-3" />
          E-Mail Sequenz
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <motion.div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                  sequenceStep >= step 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
                    : 'border-gray-500/50 text-gray-400'
                }`}
                animate={sequenceStep === step ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {step}
              </motion.div>
              {step < 4 && (
                <motion.div 
                  className="w-4 h-0.5 bg-purple-500/30"
                  animate={{ opacity: sequenceStep > step ? 1 : 0.3 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* LinkedIn integration badge */}
      <motion.div
        className="absolute bottom-24 right-4 md:right-8 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <Linkedin className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-300">LinkedIn verbunden</span>
        </div>
      </motion.div>

      {/* Status indicators */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-purple-300">Templates: {activeTemplates.length}/{templates.length}</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-300">Sequenzen: Aktiv</span>
        </div>
      </motion.div>

      {/* Status badge */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs text-gray-200">Phase 2 • Kreation & Content</span>
        </div>
      </motion.div>
    </div>
  );
};
