import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Target, CheckCircle2, Search, BarChart3, User } from 'lucide-react';

interface AuditItem {
  id: number;
  label: string;
  checked: boolean;
}

interface LeadSegment {
  id: number;
  label: string;
  color: string;
  score: number;
}

export const CRMAuditAnimation = () => {
  const [scanY, setScanY] = useState(0);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    { id: 1, label: 'CRM-Struktur analysiert', checked: false },
    { id: 2, label: 'Bottlenecks identifiziert', checked: false },
    { id: 3, label: 'Lead-Segmente definiert', checked: false },
    { id: 4, label: 'Scoring-Modell erstellt', checked: false },
  ]);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [segments] = useState<LeadSegment[]>([
    { id: 1, label: 'Hot', color: 'bg-red-500', score: 85 },
    { id: 2, label: 'Warm', color: 'bg-orange-500', score: 65 },
    { id: 3, label: 'Cold', color: 'bg-blue-500', score: 35 },
    { id: 4, label: 'New', color: 'bg-green-500', score: 50 },
  ]);

  useEffect(() => {
    // Scanning animation
    const scanInterval = setInterval(() => {
      setScanY(prev => (prev + 2) % 100);
    }, 50);

    // Checklist progress
    const checkInterval = setInterval(() => {
      setCurrentCheck(prev => {
        const next = prev + 1;
        if (next <= auditItems.length) {
          setAuditItems(items => 
            items.map((item, idx) => 
              idx < next ? { ...item, checked: true } : item
            )
          );
        }
        return next > auditItems.length ? 0 : next;
      });
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-blue-950/40 via-gray-900 to-cyan-950/30 overflow-hidden rounded-3xl border border-blue-500/30" style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(0, 0, 0)' }}>
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        style={{ top: `${scanY}%` }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Central database hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative w-24 h-24 md:w-32 md:h-32"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner ring */}
          <motion.div
            className="absolute inset-3 rounded-full border border-cyan-500/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/30">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px rgba(59, 130, 246, 0.3)', '0 0 40px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.3)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Database className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </motion.div>
          </div>

          {/* Orbiting data points */}
          {segments.map((segment, i) => {
            const angle = (i * 90 + Date.now() / 50) % 360;
            const radius = 55;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <motion.div
                key={segment.id}
                className={`absolute w-6 h-6 rounded-full ${segment.color}/30 border border-white/20 flex items-center justify-center`}
                style={{ 
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                <User className="w-3 h-3 text-white" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lead segments visualization */}
      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 space-y-2 max-w-[130px]">
        {segments.map((segment, i) => (
          <motion.div
            key={segment.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 + 1 }}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${segment.color}`} />
            <span className="text-xs text-gray-200">{segment.label}</span>
            <motion.div
              className={`h-1.5 ${segment.color}/40 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: segment.score * 0.4 }}
              transition={{ delay: i * 0.3 + 1.5, duration: 1 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Audit checklist */}
      <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 space-y-2 max-w-[150px]">
        <div className="text-xs text-blue-300 mb-2 flex items-center gap-2">
          <Search className="w-3 h-3" />
          CRM-Audit
        </div>
        {auditItems.map((item, i) => (
          <motion.div
            key={item.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <motion.div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                item.checked 
                  ? 'border-green-500 bg-green-500/20' 
                  : 'border-gray-500/50'
              }`}
              animate={item.checked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {item.checked && <CheckCircle2 className="w-3 h-3 text-green-400" />}
            </motion.div>
            <span className={`text-xs ${item.checked ? 'text-white' : 'text-gray-300'}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Status indicators */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-blue-300">Analyse läuft</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-300">Segmente: 4</span>
        </div>
      </motion.div>

      {/* Status badge */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30"
        style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', transform: 'translate3d(-50%, 0, 0)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs text-gray-200">Phase 1 • Strategie & Konzeption</span>
        </div>
      </motion.div>
    </div>
  );
};
