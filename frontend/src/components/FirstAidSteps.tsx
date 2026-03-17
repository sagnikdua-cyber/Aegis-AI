'use client';

import { ShieldCheck, AlertTriangle, AlertCircle, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface FirstAidStepsProps {
  steps: string[];
  severity: string;
}

export default function FirstAidSteps({ steps, severity }: FirstAidStepsProps) {
  const isCritical = severity.toLowerCase().includes('critical') || severity.toLowerCase().includes('high');

  return (
    <div className={cn(
      "glass-panel p-8 border-2 relative overflow-hidden",
      isCritical ? "border-red-500/40 bg-red-950/10" : "border-neon-cyan/40 bg-neon-cyan/5"
    )}>
      {/* Visual Indicator Line */}
      <div className={cn(
        "absolute top-0 left-0 w-2 h-full",
        isCritical ? "bg-red-500" : "bg-neon-cyan"
      )} />

      <div className="flex items-center justify-between mb-10 pl-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl border",
            isCritical ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"
          )}>
            {isCritical ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Immediate Protocol</h3>
            <p className={cn(
              "text-[9px] font-black uppercase tracking-[0.3em]",
              isCritical ? "text-red-400" : "text-neon-cyan"
            )}>Status: {severity.toUpperCase()}</p>
          </div>
        </div>
        
        <Activity className={cn(
          "w-6 h-6 opacity-20",
          isCritical ? "text-red-500 animate-pulse" : "text-neon-cyan"
        )} />
      </div>
      
      <div className="space-y-4 pl-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-6 group hover:translate-x-1 transition-transform"
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all",
              isCritical 
                ? "bg-red-500/10 border-red-500/30 text-red-400 group-hover:bg-red-500 group-hover:text-white" 
                : "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan group-hover:bg-neon-cyan group-hover:text-black"
            )}>
              {index + 1}
            </div>
            <div className="space-y-1 py-1">
              <p className="text-gray-200 font-bold text-sm leading-relaxed group-hover:text-white transition-colors">
                {step}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {isCritical && (
        <div className="mt-10 p-6 rounded-[2rem] bg-red-600 border border-red-500 shadow-2xl shadow-red-900/40 relative overflow-hidden group/alert ml-4">
           <Zap className="absolute top-0 right-0 p-4 w-20 h-20 text-white opacity-10 group-hover/alert:scale-110 transition-transform duration-700" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertCircle className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest mb-1 italic">Tactical Alert</p>
                <p className="text-[11px] text-white/90 font-bold leading-tight">
                  IMMEDIATE EVACUATION OR PARAMEDIC INTERVENTION REQUIRED. 
                  MAINTAIN COMMUNICATIONS.
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
