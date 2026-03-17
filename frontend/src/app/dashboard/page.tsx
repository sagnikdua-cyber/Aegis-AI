'use client';

import React, { useEffect, useState } from 'react';
import UserProfile from "@/components/UserProfile";
import MedicalSummary from "@/components/MedicalSummary";
import FirstAidSteps from "@/components/FirstAidSteps";
import HospitalFinder from "@/components/HospitalFinder";
import { LayoutDashboard, Clock, ShieldCheck, HeartPulse, Activity, Zap, Shield, Radio, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from '@/components/three/Scene';
import Heartbeat from '@/components/three/Heartbeat';
import { cn } from '@/utils/cn';

export default function DashboardPage() {
  const [report, setReport] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('aegis_latest_report');
    if (stored) {
      setReport(JSON.parse(stored));
    }
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shadow-[0_0_30px_rgba(45,212,191,0.1)]">
              <LayoutDashboard className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                <Radio className="w-3 h-3 animate-pulse" /> Network: Encrypted
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                Medical <span className="text-neon-cyan underline decoration-white/10 underline-offset-8">Command.</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Tactical health telemetry for active monitoring.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Status</p>
               <p className="text-xs font-black text-neon-cyan uppercase">All Systems Optimal</p>
             </div>
             <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(45,212,191,1)]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-10">
            {report ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                {/* 3D Visualizer Card */}
                <div className="relative h-[300px] glass-card rounded-[3rem] neon-border border-neon-cyan/30 bg-black/40 overflow-hidden group">
                  <Scene>
                    <Heartbeat />
                  </Scene>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-8 left-8 p-6 glass-panel rounded-2xl bg-black/60 border-neon-cyan/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-2 text-neon-cyan">
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Live Bio-Feed</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Stable Sinus Rhythm Detected<br/>Normal Range / 72 BPM</p>
                  </div>
                  
                  <div className="absolute bottom-8 right-8">
                    <div className="px-6 py-3 rounded-full bg-neon-cyan text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-neon-cyan/20 cursor-default">
                      Active Intelligence
                    </div>
                  </div>
                </div>

                <MedicalSummary summary={report} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FirstAidSteps steps={report.first_aid_steps} severity={report.risk_level} />
                  
                  <div className="space-y-10">
                    <div className="p-10 glass-card neon-border border-neon-cyan/20 bg-black/40 backdrop-blur-3xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-cyan opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity" />
                      <ShieldCheck className="w-12 h-12 text-neon-cyan mb-8" />
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Immunity Core</h3>
                      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-8 leading-relaxed">Algorithmic resistance score based on biometric history.</p>
                      
                      <div className="flex items-end gap-3">
                        <span className="text-6xl font-black text-white italic tracking-tighter">8.4</span>
                        <span className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3">/ Defense Index</span>
                      </div>
                    </div>
                    
                    <div className="p-8 glass-card border-neon-cyan/10 bg-neon-cyan/5 flex flex-col gap-4">
                       <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.3em] italic">Tactical Next Step</span>
                       <p className="text-white font-bold leading-relaxed">{report.recommended_action}</p>
                       <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                         Acknowledge Action <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <HospitalFinder initialHospitals={report.nearby_hospitals} />
                </div>
              </motion.div>
            ) : (
              <div className="p-20 rounded-[4rem] border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-10 border border-white/10 ring-8 ring-white/[0.02]">
                    <Activity className="w-12 h-12 text-gray-700 animate-pulse" />
                 </div>
                 <h2 className="text-3xl font-black text-gray-400 mb-4 uppercase italic tracking-tighter">Command Standby.</h2>
                 <p className="text-gray-600 max-w-sm font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-10">
                    Deploy AI Symptom Analysis to initialize your medical command center and generate actionable intelligence.
                 </p>
                 <a href="/symptoms" className="px-10 py-4 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-black uppercase text-xs tracking-widest transition-all rounded-2xl shadow-2xl shadow-neon-cyan/20">
                    Start Diagnosis
                 </a>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 space-y-10">
            <UserProfile />
            
            <div className="glass-card p-10 neon-border border-white/5 bg-black/40 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
                    <Clock className="text-neon-cyan w-6 h-6" /> Logs
                 </h3>
                 <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em] px-3 py-1 bg-neon-cyan/10 rounded-full">RT-Sync</span>
              </div>
              
              <div className="space-y-6">
                 {[
                   { title: "Dashboard Hydrated", meta: "System Sync", color: "bg-green-500" },
                   { title: "Encryption Secure", meta: "Protocol v2.4", color: "bg-blue-500" },
                   { title: "Bio-Link Active", meta: "Sensor Patch", color: "bg-neon-cyan" }
                 ].map((log, i) => (
                   <div key={i} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                      <div>
                         <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{log.title}</p>
                         <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em]">{log.meta}</p>
                      </div>
                      <div className={cn("w-2 h-2 rounded-full", log.color)} />
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-500/20 flex items-center justify-between group cursor-pointer hover:neon-border transition-all">
               <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-tighter italic mb-1">SOS Ready</h4>
                  <p className="text-red-500 font-bold text-[9px] uppercase tracking-widest">Immediate Broadcast</p>
               </div>
               <Zap className="w-6 h-6 text-red-500 group-hover:scale-125 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
