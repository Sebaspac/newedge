import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Database, Mail, Linkedin, CalendarCheck, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ChannelNode {
  id: number;
  Icon: LucideIcon;
  label: string;
  connected: boolean;
  color: string;
}

export const SalesAgentDeployAnimation = () => {
  const [channels, setChannels] = useState<ChannelNode[]>([
    { id: 1, Icon: Database, label: 'CRM', connected: false, color: 'blue' },
    { id: 2, Icon: Mail, label: 'E-Mail', connected: false, color: 'purple' },
    { id: 3, Icon: Linkedin, label: 'LinkedIn', connected: false, color: 'cyan' },
    { id: 4, Icon: CalendarCheck, label: 'Kalender', connected: false, color: 'green' },
    { id: 5, Icon: Phone, label: 'Telefon', connected: false, color: 'orange' },
  ]);
  const [deploymentPhase, setDeploymentPhase] = useState<'initializing' | 'deploying' | 'complete'>('initializing');
  const [sparkles, setSparkles] = useState<{ id: number; angle: number }[]>([]);

  useEffect(() => {
    // Sequential channel connection
    const connectChannel = (index: number) => {
      if (index >= channels.length) {
        setDeploymentPhase('complete');
        return;
      }
      
      setDeploymentPhase('deploying');
      
      setTimeout(() => {
        setChannels(prev => prev.map((ch, i) => 
          i === index ? { ...ch, connected: true } : ch
        ));
        
        // Add sparkle effect
        const newSparkle = { id: Date.now(), angle: (index * 72) };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
        
        connectChannel(index + 1);
      }, 1200);
    };

    const startTimeout = setTimeout(() => connectChannel(0), 1000);
    
    return () => clearTimeout(startTimeout);
  }, []);

  const getChannelPosition = (index: number, total: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const radius = 32;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  // Calculate line end position at node edge (not center)
  const getLineEndPosition = (index: number, total: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const radius = 32;
    const nodeRadius = 5; // Offset to stop at node edge
    return {
      x: 50 + (radius - nodeRadius) * Math.cos(angle),
      y: 50 + (radius - nodeRadius) * Math.sin(angle),
    };
  };

  const getColorClasses = (color: string, connected: boolean) => {
    if (!connected) return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    switch (color) {
      case 'blue': return 'border-blue-500/50 bg-blue-500/20 text-blue-400';
      case 'purple': return 'border-purple-500/50 bg-purple-500/20 text-purple-400';
      case 'cyan': return 'border-cyan-500/50 bg-cyan-500/20 text-cyan-400';
      case 'green': return 'border-green-500/50 bg-green-500/20 text-green-400';
      case 'orange': return 'border-orange-500/50 bg-orange-500/20 text-orange-400';
      default: return 'border-purple-500/50 bg-purple-500/20 text-purple-400';
    }
  };

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-950/40 via-gray-900 to-green-950/30 overflow-hidden rounded-3xl border border-purple-500/30 backdrop-blur-sm">
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

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {channels.map((channel, i) => {
          const endPos = getLineEndPosition(i, channels.length);
          return (
            <motion.line
              key={channel.id}
              x1="50%"
              y1="50%"
              x2={`${endPos.x}%`}
              y2={`${endPos.y}%`}
              stroke={channel.connected ? "rgba(34, 197, 94, 0.5)" : "rgba(168, 85, 247, 0.2)"}
              strokeWidth="2"
              strokeDasharray={channel.connected ? "0" : "4 4"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: channel.connected ? 1 : 0.3 }}
              transition={{ duration: 0.8 }}
            />
          );
        })}
      </svg>

      {/* Flying sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => {
          const endPos = getChannelPosition(
            channels.findIndex(c => c.connected && sparkle.angle === (channels.indexOf(c) * 72)),
            channels.length
          );
          return (
            <motion.div
              key={sparkle.id}
              className="absolute z-30"
              initial={{ left: '50%', top: '50%', opacity: 1, scale: 1 }}
              animate={{ 
                left: `${endPos.x}%`, 
                top: `${endPos.y}%`,
                opacity: [1, 1, 0],
                scale: [1, 1.5, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-4 h-4 text-green-400" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Channel nodes */}
      {channels.map((channel, i) => {
        const pos = getChannelPosition(i, channels.length);
        const colors = getColorClasses(channel.color, channel.connected);
        
        return (
          <motion.div
            key={channel.id}
            className={`absolute w-16 h-16 md:w-20 md:h-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border ${colors} backdrop-blur-sm flex flex-col items-center justify-center gap-1`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: channel.connected 
                ? '0 0 20px rgba(34, 197, 94, 0.3)' 
                : '0 0 0 transparent',
            }}
            transition={{ delay: i * 0.1 + 0.5 }}
          >
            <channel.Icon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[10px] md:text-xs">{channel.label}</span>
            {channel.connected && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Central agent hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative w-20 h-20 md:w-28 md:h-28"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Pulsing outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-500/50"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/30 to-green-500/30 flex items-center justify-center border border-purple-400/40">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px rgba(168, 85, 247, 0.4)', '0 0 40px rgba(34, 197, 94, 0.4)', '0 0 20px rgba(168, 85, 247, 0.4)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Bot className="w-8 h-8 md:w-12 md:h-12 text-purple-300" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Status indicators */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-300">
            Verbunden: {channels.filter(c => c.connected).length}/{channels.length}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-purple-300">
            {deploymentPhase === 'complete' ? 'Agent: Live' : 'Agent: Deploying...'}
          </span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 md:w-64">
        <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-green-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(channels.filter(c => c.connected).length / channels.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Status badge */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${deploymentPhase === 'complete' ? 'bg-green-500' : 'bg-purple-500'}`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs text-gray-200">Phase 3 • Technische Umsetzung</span>
        </div>
      </motion.div>
    </div>
  );
};
