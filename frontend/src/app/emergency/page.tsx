'use client';

import React from 'react';
import HospitalFinder from "@/components/HospitalFinder";
import { AlertCircle, Phone, Navigation, Shield, Zap, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import Scene from '@/components/three/Scene';
import Radar from '@/components/three/Radar';

export default function EmergencyPage() {
  return (
    <main className="min-h-screen relative pt-32 pb-20 overflow-hidden bg-background">
      <Scene>
        <Radar />
      </Scene>
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(239,68,68,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-16"
        >
          <div className="flex-1 glass-card p-10 neon-border border-red-500/50 bg-red-950/20 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-1000">
               <AlertCircle className="w-64 h-64 text-red-500" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <Radio className="w-3 h-3 animate-pulse" /> Emergency Broadcast Active
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">
                CRITICAL <span className="text-red-500">UPLINK.</span>
              </h2>
              <p className="text-red-200/60 font-bold mb-10 max-w-xl uppercase tracking-widest text-xs leading-relaxed">
                Autonomous emergency response protocol initiated. AegisAI is triangulating medical assets and broadcasting SOS packets to nearest response units.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <button className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] group">
                  <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                  Call Dispatch
                </button>
                <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-white/10 flex items-center gap-4 transition-all">
                  <Navigation className="w-6 h-6" /> 
                  Sync Location
                </button>
              </div>
            </div>

            {/* Scanning line effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 opacity-20 animate-scan" />
          </div>

          <div className="md:w-80 flex flex-col gap-6">
            <div className="glass-card p-8 border-red-500/20 bg-black/40 backdrop-blur-xl">
              <Shield className="w-10 h-10 text-red-500 mb-4" />
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-2 font-mono">Shield Protocol</h4>
              <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed font-mono">Encryption active. SOS telemetry is secure.</p>
            </div>
            <div className="glass-card p-8 border-cyan-500/20 bg-black/40 backdrop-blur-xl">
              <Zap className="w-10 h-10 text-cyan-400 mb-4" />
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-2 font-mono">Response ETA</h4>
              <p className="text-cyan-400 text-2xl font-black italic">--:-- MIN</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-2 neon-border border-white/10 bg-black/40 backdrop-blur-2xl"
        >
          <HospitalFinder />
        </motion.div>
      </div>
    </main>
  );
}
