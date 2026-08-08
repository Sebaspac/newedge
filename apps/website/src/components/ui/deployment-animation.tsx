import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, User, Zap, CheckCircle, MessageCircle, MessageSquare } from "lucide-react";

interface UserNode {
  id: string;
  x: number;
  y: number;
  delay: number;
  connected: boolean;
}

interface ConnectionLine {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export const DeploymentAnimation: React.FC = () => {
  const [userNodes, setUserNodes] = useState<UserNode[]>([]);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [deploymentPhase, setDeploymentPhase] = useState(0);
  const [trainedCount, setTrainedCount] = useState(0);

  // Exact geometric center position (percentage)
  const centerX = 50;
  const centerY = 50;
  
  // Radius offsets for precise line connections (in percentage)
  // Hub: w-20/24/28 → ~10-14% of container, use ~6% to hit edge
  // Node: w-10/12 → ~5-6% of container, use ~2.5% to hit edge
  const hubRadius = 6; // Hub edge offset
  const nodeRadius = 2.5; // User node edge offset

  // Calculate edge-to-edge line coordinates
  const getLineCoords = (nodeX: number, nodeY: number) => {
    const angle = Math.atan2(nodeY - centerY, nodeX - centerX);
    return {
      x1: centerX + hubRadius * Math.cos(angle),
      y1: centerY + hubRadius * Math.sin(angle),
      x2: nodeX - nodeRadius * Math.cos(angle),
      y2: nodeY - nodeRadius * Math.sin(angle),
    };
  };

  useEffect(() => {
    // Generate user nodes in a circle around the center
    const nodeCount = 8;
    const radius = 32;
    const nodes: UserNode[] = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
      return {
        id: `user-${i}`,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        delay: i * 0.3,
        connected: false,
      };
    });
    setUserNodes(nodes);

    // Animation cycle
    const runCycle = () => {
      setDeploymentPhase(1);
      setTrainedCount(0);
      setActiveConnections([]);

      // Connect users one by one
      nodes.forEach((node, index) => {
        setTimeout(() => {
          setActiveConnections((prev) => [...prev, node.id]);
          setTrainedCount((prev) => prev + 1);
        }, 500 + index * 400);
      });

      // Complete deployment
      setTimeout(() => {
        setDeploymentPhase(2);
      }, 500 + nodes.length * 400 + 500);

      // Reset for next cycle
      setTimeout(() => {
        setDeploymentPhase(0);
        setActiveConnections([]);
        setTrainedCount(0);
      }, 500 + nodes.length * 400 + 3000);
    };

    runCycle();
    const interval = setInterval(runCycle, 500 + nodes.length * 400 + 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-800/30 to-purple-900/30 rounded-3xl border border-purple-500/30 backdrop-blur-sm overflow-hidden">
      {/* Network grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="network-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="rgba(168, 85, 247, 0.5)" />
              <path d="M 0 30 L 60 30 M 30 0 L 30 60" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      {/* Connection lines - precise edge to edge */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {userNodes.map((node) => {
          const coords = getLineCoords(node.x, node.y);
          return (
            <motion.line
              key={`line-${node.id}`}
              x1={`${coords.x1}%`}
              y1={`${coords.y1}%`}
              x2={`${coords.x2}%`}
              y2={`${coords.y2}%`}
              stroke={activeConnections.includes(node.id) ? "#22d3ee" : "rgba(168, 85, 247, 0.2)"}
              strokeWidth={activeConnections.includes(node.id) ? 2 : 1}
              strokeDasharray={activeConnections.includes(node.id) ? "0" : "4 4"}
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{
                pathLength: activeConnections.includes(node.id) ? 1 : 0.3,
                opacity: activeConnections.includes(node.id) ? 1 : 0.3,
              }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Message icon animations flying along connection lines - edge to edge */}
      <AnimatePresence>
        {activeConnections.map((nodeId) => {
          const node = userNodes.find((n) => n.id === nodeId);
          if (!node) return null;
          const coords = getLineCoords(node.x, node.y);
          return (
            <motion.div
              key={`message-${nodeId}`}
              className="absolute flex items-center justify-center"
              initial={{ 
                left: `${coords.x1}%`, 
                top: `${coords.y1}%`, 
                x: "-50%", 
                y: "-50%", 
                opacity: 1, 
                scale: 0.8 
              }}
              animate={{
                left: [`${coords.x1}%`, `${coords.x2}%`],
                top: [`${coords.y1}%`, `${coords.y2}%`],
                x: "-50%",
                y: "-50%",
                opacity: [1, 1, 0],
                scale: [0.8, 1, 0.6],
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 fill-cyan-400/30" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* User nodes */}
      {userNodes.map((node, index) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: node.delay, duration: 0.3 }}
        >
          <motion.div
            className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              activeConnections.includes(node.id)
                ? "bg-gradient-to-br from-cyan-500 to-purple-600 border-cyan-400 shadow-lg"
                : "bg-purple-800/40 border-purple-500/30"
            }`}
            animate={
              activeConnections.includes(node.id)
                ? { boxShadow: ["0 0 0px rgba(34, 211, 238, 0)", "0 0 20px rgba(34, 211, 238, 0.5)", "0 0 10px rgba(34, 211, 238, 0.3)"] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <User className={`w-5 h-5 md:w-6 md:h-6 ${activeConnections.includes(node.id) ? "text-white" : "text-purple-300"}`} />
            
            {/* Check mark for connected users */}
            <AnimatePresence>
              {activeConnections.includes(node.id) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ))}

      {/* Central hub */}
      <div 
        className="absolute"
        style={{ left: `${centerX}%`, top: `${centerY}%`, transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          animate={deploymentPhase === 2 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Rotating ring */}
            <motion.div
              className="absolute -inset-4 md:-inset-6 rounded-full border-2 border-dashed border-purple-400/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow:
                  deploymentPhase === 2
                    ? ["0 0 20px rgba(34, 211, 238, 0.3)", "0 0 50px rgba(34, 211, 238, 0.6)", "0 0 30px rgba(34, 211, 238, 0.4)"]
                    : ["0 0 10px rgba(168, 85, 247, 0.3)", "0 0 25px rgba(168, 85, 247, 0.5)", "0 0 15px rgba(168, 85, 247, 0.3)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Main hub icon */}
            <div
              className={`relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-2xl border-4 transition-all duration-500 ${
                deploymentPhase === 2
                  ? "bg-gradient-to-br from-green-500 to-cyan-600 border-green-400/50"
                  : "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400/50"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {deploymentPhase === 2 ? (
                  <CheckCircle className="block w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
                ) : (
                  <MessageCircle className="block w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
                )}
              </div>
            </div>

            {/* Pulsing ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-purple-400/30"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "center center" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-purple-500/30"
        >
          <Users className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] md:text-xs text-purple-300">Users Trained</div>
            <div className="text-xs md:text-sm font-bold text-white">
              {trainedCount} / {userNodes.length}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-purple-500/30"
        >
          <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
          <div>
            <div className="text-[10px] md:text-xs text-purple-300">Status</div>
            <div className="text-xs md:text-sm font-bold text-white">
              {deploymentPhase === 0 ? "Initializing" : deploymentPhase === 1 ? "Deploying..." : "Complete"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <div className="bg-purple-900/50 backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-3 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${deploymentPhase === 2 ? "bg-green-400" : "bg-cyan-400 animate-pulse"}`} />
              <span className="text-purple-200 text-xs md:text-sm">
                {deploymentPhase === 2 ? "Deployment Complete" : "Rolling out to users..."}
              </span>
            </div>
            <span className="text-cyan-400 text-xs md:text-sm font-mono">
              {Math.round((trainedCount / userNodes.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 md:h-2 bg-purple-800/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${deploymentPhase === 2 ? "bg-gradient-to-r from-green-400 to-cyan-500" : "bg-gradient-to-r from-cyan-400 to-purple-500"}`}
              initial={{ width: "0%" }}
              animate={{ width: `${(trainedCount / userNodes.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentAnimation;
