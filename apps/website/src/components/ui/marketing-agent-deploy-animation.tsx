import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Instagram, 
  Facebook, 
  Mail, 
  Calendar, 
  BarChart3,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface ChannelNode {
  id: string;
  Icon: React.ElementType;
  label: string;
  angle: number;
  connected: boolean;
  color: string;
}

export const MarketingAgentDeployAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [channels, setChannels] = useState<ChannelNode[]>([
    { id: "instagram", Icon: Instagram, label: "Instagram", angle: 0, connected: false, color: "text-pink-400" },
    { id: "facebook", Icon: Facebook, label: "Facebook", angle: 72, connected: false, color: "text-blue-400" },
    { id: "email", Icon: Mail, label: "E-Mail", angle: 144, connected: false, color: "text-green-400" },
    { id: "calendar", Icon: Calendar, label: "Planung", angle: 216, connected: false, color: "text-purple-400" },
    { id: "analytics", Icon: BarChart3, label: "Analytics", angle: 288, connected: false, color: "text-cyan-400" },
  ]);
  const [deploymentPhase, setDeploymentPhase] = useState<"initializing" | "deploying" | "complete">("initializing");
  const [sparkles, setSparkles] = useState<{ id: string; channelId: string; progress: number }[]>([]);

  const hubRadius = 6;
  const nodeRadius = 2.5;
  const orbitRadius = 35;

  useEffect(() => {
    // Sequential channel connection
    let currentIndex = 0;
    
    const connectChannel = () => {
      if (currentIndex < channels.length) {
        setDeploymentPhase("deploying");
        
        // Add sparkle animation
        const channelId = channels[currentIndex].id;
        setSparkles((prev) => [...prev, { id: `sparkle-${Date.now()}`, channelId, progress: 0 }]);
        
        // Connect channel after sparkle reaches it
        setTimeout(() => {
          setChannels((prev) =>
            prev.map((ch, idx) =>
              idx === currentIndex ? { ...ch, connected: true } : ch
            )
          );
          currentIndex++;
          
          if (currentIndex >= channels.length) {
            setTimeout(() => setDeploymentPhase("complete"), 500);
          }
        }, 600);
      } else {
        // Reset animation
        currentIndex = 0;
        setChannels((prev) => prev.map((ch) => ({ ...ch, connected: false })));
        setSparkles([]);
        setDeploymentPhase("initializing");
      }
    };

    const interval = setInterval(connectChannel, 1200);
    connectChannel();

    return () => clearInterval(interval);
  }, []);

  const getChannelPosition = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + Math.cos(rad) * orbitRadius,
      y: 50 + Math.sin(rad) * orbitRadius,
    };
  };

  const connectedCount = channels.filter((ch) => ch.connected).length;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-900/20 via-green-900/15 to-blue-900/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="deploy-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deploy-grid)" />
        </svg>
      </div>

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {channels.map((channel) => {
          const pos = getChannelPosition(channel.angle);
          const hubEdgeX = 50 + Math.cos((channel.angle - 90) * Math.PI / 180) * hubRadius;
          const hubEdgeY = 50 + Math.sin((channel.angle - 90) * Math.PI / 180) * hubRadius;
          const nodeEdgeX = pos.x - Math.cos((channel.angle - 90) * Math.PI / 180) * nodeRadius;
          const nodeEdgeY = pos.y - Math.sin((channel.angle - 90) * Math.PI / 180) * nodeRadius;

          return (
            <motion.line
              key={channel.id}
              x1={`${hubEdgeX}%`}
              y1={`${hubEdgeY}%`}
              x2={`${nodeEdgeX}%`}
              y2={`${nodeEdgeY}%`}
              stroke={channel.connected ? "rgba(34, 197, 94, 0.6)" : "rgba(168, 85, 247, 0.3)"}
              strokeWidth="2"
              strokeDasharray={channel.connected ? "0" : "4 4"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: channel.connected ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Flying sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => {
          const channel = channels.find((ch) => ch.id === sparkle.channelId);
          if (!channel) return null;
          const pos = getChannelPosition(channel.angle);
          
          return (
            <motion.div
              key={sparkle.id}
              className="absolute z-20"
              initial={{ left: "50%", top: "50%", scale: 0 }}
              animate={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
                scale: [0, 1.5, 1, 0]
              }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Channel nodes */}
      {channels.map((channel) => {
        const pos = getChannelPosition(channel.angle);
        const IconComponent = channel.Icon;
        
        return (
          <motion.div
            key={channel.id}
            className="absolute z-10"
            style={{ 
              left: `${pos.x}%`, 
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                channel.connected 
                  ? "bg-green-500/20 border-green-400/60" 
                  : "bg-white/10 border-white/20"
              }`}
              animate={channel.connected ? { 
                scale: [1, 1.1, 1],
                boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.5)", "0 0 10px rgba(34, 197, 94, 0.3)"]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${channel.connected ? "text-green-400" : channel.color}`} />
              
              {/* Check mark */}
              <AnimatePresence>
                {channel.connected && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Label */}
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className={`text-[9px] md:text-[10px] ${channel.connected ? "text-green-300" : "text-gray-400"}`}>
                {channel.label}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Central hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Outer pulse ring */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              deploymentPhase === "complete" ? "bg-green-500/20" : "bg-purple-500/20"
            }`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: "80px", height: "80px", margin: "-8px" }}
          />
          
          {/* Hub circle */}
          <motion.div 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg ${
              deploymentPhase === "complete"
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/40"
                : "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/40"
            }`}
            animate={{ 
              boxShadow: deploymentPhase === "complete"
                ? ["0 0 20px rgba(34, 197, 94, 0.4)", "0 0 40px rgba(34, 197, 94, 0.6)", "0 0 20px rgba(34, 197, 94, 0.4)"]
                : ["0 0 20px rgba(168, 85, 247, 0.4)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.4)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-purple-500/30"
        >
          <Bot className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
          <div>
            <div className="text-[10px] md:text-xs text-purple-300">Kanäle verbunden</div>
            <div className="text-xs md:text-sm font-bold text-white">{connectedCount}/5</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-2 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border ${
            deploymentPhase === "complete" 
              ? "bg-green-900/40 border-green-500/30"
              : "bg-indigo-900/40 border-indigo-500/30"
          }`}
        >
          <Sparkles className={`w-3 h-3 md:w-4 md:h-4 ${deploymentPhase === "complete" ? "text-green-400" : "text-indigo-400"}`} />
          <div>
            <div className={`text-[10px] md:text-xs ${deploymentPhase === "complete" ? "text-green-300" : "text-indigo-300"}`}>Status</div>
            <div className="text-xs md:text-sm font-bold text-white">
              {deploymentPhase === "initializing" && "Initialisierung"}
              {deploymentPhase === "deploying" && "Deployment..."}
              {deploymentPhase === "complete" && "Automatisiert"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 w-24 md:w-32">
        <div className="text-[10px] md:text-xs text-gray-400 mb-1">Fortschritt</div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              deploymentPhase === "complete" ? "bg-green-500" : "bg-purple-500"
            }`}
            animate={{ width: `${(connectedCount / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Status badge */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <motion.div 
          className={`backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-3 border ${
            deploymentPhase === "complete"
              ? "bg-green-900/50 border-green-500/30"
              : "bg-purple-900/50 border-purple-500/30"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-2 h-2 rounded-full ${deploymentPhase === "complete" ? "bg-green-400" : "bg-purple-400"}`}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={`text-xs md:text-sm ${deploymentPhase === "complete" ? "text-green-200" : "text-purple-200"}`}>
              {deploymentPhase === "complete" 
                ? "Phase 3: Marketing-Agent vollständig aktiv"
                : "Phase 3: Agent-Deployment läuft..."}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketingAgentDeployAnimation;
