'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Phone, Navigation, X, Volume2, MoveRight, MapPin, ShieldAlert, Radio, Zap, Activity } from 'lucide-react';
import { HospitalInfo } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
  riskLevel: string;
  instructions: string[];
  hospitals: HospitalInfo[];
}

export default function EmergencyAlert({ isOpen, onClose, riskLevel, instructions, hospitals }: EmergencyAlertProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      speakInstructions();
    } else {
      document.body.style.overflow = 'unset';
      stopSpeaking();
    }
    return () => {
      document.body.style.overflow = 'unset';
      stopSpeaking();
    };
  }, [isOpen]);

  const speakInstructions = () => {
    if (!('speechSynthesis' in window)) return;
    const fullText = `Emergency Alert. Risk level is ${riskLevel}. Please follow these instructions. ${instructions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
      {/* Heavy pulsed background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.98 }}
        className="absolute inset-0 bg-red-950 animate-pulse-slow backdrop-blur-xl" 
      />
      
      {/* Decorative scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl bg-black rounded-[3rem] border-4 border-red-500/50 shadow-3xl shadow-red-900/50 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header - Tactical HUD Style */}
        <div className="p-10 bg-red-600 flex items-center justify-between border-b-8 border-black relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-scan" />
          
          <div className="flex items-center gap-8">
            <div className="p-5 bg-black rounded-2xl text-red-500 shadow-2xl animate-pulse">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <Radio className="w-4 h-4 text-white animate-ping" />
                 <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.5em]">Active Deployment Protocol v2.4</span>
               </div>
               <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Critical Burst</h2>
               <p className="text-red-100 font-bold text-xl uppercase tracking-[0.3em] mt-3 bg-black/20 w-fit px-4 py-1 rounded-lg border border-white/10">
                 {riskLevel} Priority Identified
               </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-5 rounded-2xl bg-black/20 hover:bg-black/60 text-white transition-all border border-white/20 hover:scale-95"
          >
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gradient-to-b from-red-950/20 to-black">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Tactical Instructions */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-10">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                    <Activity className="text-red-500 w-8 h-8" /> Life-Support Directives
                  </h3>
                  <button 
                    onClick={isSpeaking ? stopSpeaking : speakInstructions}
                    className={cn(
                        "px-6 py-3 rounded-xl border-2 flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest",
                        isSpeaking ? "bg-white text-red-600 border-white shadow-xl" : "bg-white/5 text-gray-500 border-white/10"
                    )}
                  >
                    <Volume2 className={cn("w-4 h-4", isSpeaking && "animate-pulse")} />
                    {isSpeaking ? 'Terminate Audio' : 'Initialize Audio Guide'}
                  </button>
               </div>
               
               <div className="space-y-6">
                  {instructions.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-8 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 items-start group hover:bg-white/[0.07] hover:border-red-500/30 transition-all"
                    >
                       <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-2xl shadow-red-900/40">
                         {i + 1}
                       </div>
                       <p className="text-2xl text-white font-bold leading-tight uppercase italic tracking-tighter pt-1">{step}</p>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Right: Asset Location */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-10">
               <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <MapPin className="text-neon-cyan w-8 h-8" />
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Asset Extraction</h3>
               </div>

               <div className="space-y-6">
                  {hospitals.slice(0, 2).map((h, i) => (
                    <div key={i} className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-red-500/40 transition-all group overflow-hidden relative">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                         <Navigation className="w-32 h-32" />
                       </div>
                       
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div>
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-red-400 transition-colors leading-none mb-2">{h.name}</h4>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{h.address || 'Vector Locked'}</p>
                          </div>
                          <div className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest">
                             {h.distance}
                          </div>
                       </div>
                       <a 
                         href={h.map_link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-4 w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl relative z-10"
                       >
                         <Navigation className="w-5 h-5" /> Engage Vector
                       </a>
                    </div>
                  ))}
               </div>

               <div className="p-10 rounded-[3rem] bg-red-600 border border-red-500 shadow-3xl shadow-red-900/50 relative overflow-hidden group/sos">
                  <Zap className="absolute top-0 right-0 p-6 w-32 h-32 text-white opacity-20 group-hover/sos:scale-110 transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse border border-white/30">
                       <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">SOS UPLINK</h4>
                      <p className="text-[10px] font-black text-red-100 uppercase tracking-[0.3em] mt-2">Active Broadcasting...</p>
                    </div>
                  </div>

                  <button className="w-full py-5 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] relative z-10 hover:bg-black/80 transition-all border border-white/10">
                    INITIATE EMERGENCY CALL
                  </button>
               </div>
            </div>
          </div>
        </div>
        
        {/* Footer info - Tactical Metadata */}
        <div className="p-6 bg-black text-center border-t-4 border-red-600/20">
           <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.6em] italic">Aegis Tactical Med-OS • Neural Link Secured • Deploying Assistance</p>
        </div>
      </motion.div>
    </div>
  );
}
