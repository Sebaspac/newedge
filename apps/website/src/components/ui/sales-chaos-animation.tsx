import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, AlertTriangle, XCircle, Database, MousePointer2, User } from 'lucide-react';

interface LeadCard {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  status: 'hot' | 'cold' | 'unknown';
  label: string;
}

export const SalesChaosAnimation = () => {
  const [leads, setLeads] = useState<LeadCard[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const initialLeads: LeadCard[] = [
      { id: 1, x: 18, y: 22, rotation: -15, delay: 0, status: 'unknown', label: 'Lead #127' },
      { id: 2, x: 72, y: 18, rotation: 12, delay: 0.2, status: 'hot', label: 'Anfrage offen' },
      { id: 3, x: 22, y: 68, rotation: -8, delay: 0.4, status: 'cold', label: '3 Wochen alt' },
      { id: 4, x: 68, y: 62, rotation: 18, delay: 0.6, status: 'unknown', label: 'Kein Status' },
      { id: 5, x: 45, y: 28, rotation: -5, delay: 0.8, status: 'hot', label: 'Follow-up?' },
      { id: 6, x: 78, y: 42, rotation: 10, delay: 1, status: 'cold', label: 'Vergessen' },
    ];
    setLeads(initialLeads);

    // Slower cursor movement for professional feel
    const cursorInterval = setInterval(() => {
      const positions = [
        { x: 30, y: 35 },
        { x: 70, y: 25 },
        { x: 25, y: 65 },
        { x: 75, y: 60 },
        { x: 50, y: 45 },
        { x: 85, y: 40 },
      ];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setCursorPos(randomPos);
    }, 1800);

    return () => clearInterval(cursorInterval);
  }, []);

  const getStatusColor = (status: LeadCard['status']) => {
    switch (status) {
      case 'hot': return 'border-orange-500/50 bg-orange-500/10';
      case 'cold': return 'border-blue-400/30 bg-blue-400/5';
      case 'unknown': return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getStatusIcon = (status: LeadCard['status']) => {
    switch (status) {
      case 'hot': return <AlertTriangle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-orange-400" />;
      case 'cold': return <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-blue-400" />;
      case 'unknown': return <XCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full h-[240px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-gradient-to-br from-red-950/40 via-gray-900 to-orange-950/30 overflow-hidden rounded-2xl sm:rounded-3xl border border-red-500/30" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(0, 0, 0)' }}>
      {/* Chaotic grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          transform: 'skewY(-2deg)',
        }}
      />

      {/* Scattered lead cards */}
      {leads.map((lead) => (
        <motion.div
          key={lead.id}
          className={`absolute w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 p-1.5 sm:p-2 rounded-md sm:rounded-lg border ${getStatusColor(lead.status)}`}
          style={{ left: `${lead.x}%`, top: `${lead.y}%`, WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(-50%, -50%, 0)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            scale: 1,
            rotate: [lead.rotation - 3, lead.rotation + 3, lead.rotation - 3],
            y: [0, -5, 0],
          }}
          transition={{
            delay: lead.delay,
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-gray-400" />
            {getStatusIcon(lead.status)}
          </div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 truncate">{lead.label}</p>
        </motion.div>
      ))}

      {/* Frantic cursor with stress */}
      <motion.div
        className="absolute z-20"
        style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
        animate={{ 
          x: [0, 5, -5, 0],
          y: [0, -5, 5, 0],
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        {/* Stress circle */}
        <motion.div
          className="absolute -inset-4 sm:-inset-5 md:-inset-6 rounded-full border-2 border-red-500/40"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <MousePointer2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400 drop-shadow-lg" />
        
        {/* Question marks */}
        <motion.span
          className="absolute -top-3 -right-1.5 sm:-top-4 sm:-right-2 text-red-400 text-[10px] sm:text-xs font-bold"
          animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ?
        </motion.span>
        <motion.span
          className="absolute -top-1.5 -left-3 sm:-top-2 sm:-left-4 text-orange-400 text-xs sm:text-sm font-bold"
          animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          !
        </motion.span>
      </motion.div>

      {/* CRM Window with problems */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-28 md:w-32 lg:w-40 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-red-500/30 bg-red-950/30"
        style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(-50%, -50%, 0)' }}
        animate={{ 
          boxShadow: ['0 0 20px rgba(239, 68, 68, 0.1)', '0 0 30px rgba(239, 68, 68, 0.2)', '0 0 20px rgba(239, 68, 68, 0.1)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-red-400" />
          <span className="text-[10px] sm:text-xs text-red-300">CRM Status</span>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1">
            <XCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-red-400" />
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300">Daten unvollständig</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-orange-400" />
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300">8 Follow-ups offen</span>
          </div>
        </div>
      </motion.div>

      {/* Broken connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { x1: "20%", y1: "30%", x2: "45%", y2: "45%" },
          { x1: "75%", y1: "25%", x2: "55%", y2: "45%" },
          { x1: "25%", y1: "75%", x2: "45%", y2: "55%" },
          { x1: "80%", y1: "70%", x2: "55%", y2: "55%" },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(239, 68, 68, 0.3)"
            strokeWidth="1"
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: [0, 0.5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </svg>

      {/* Status indicators */}
      <motion.div
        className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full bg-red-500/10 border border-red-500/30"
        style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', transform: 'translate3d(0, 0, 0)' }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <AlertTriangle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-red-400" />
          <span className="text-[8px] sm:text-[10px] md:text-xs text-red-300">Follow-ups: 8+ verpasst</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30"
        style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', transform: 'translate3d(0, 0, 0)' }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-orange-400" />
          <span className="text-[8px] sm:text-[10px] md:text-xs text-orange-300">Lead-Scoring: 0%</span>
        </div>
      </motion.div>

      {/* Problem description badge */}
      <motion.div
        className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-red-500/10 border border-red-500/30"
        style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(-50%, 0, 0)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 flex-shrink-0"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-200 whitespace-nowrap">Manueller Vertrieb • Kein System</span>
        </div>
      </motion.div>
    </div>
  );
};