'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Activity, ShieldCheck, Zap, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MedicalSummaryProps {
  summary: {
    patient_summary: string;
    risk_level: string;
    possible_conditions: string[];
    recommended_action: string;
    emergency_instructions?: string[];
    next_steps?: string[];
  };
}

export default function MedicalSummary({ summary }: MedicalSummaryProps) {
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }) + ' • ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    const reportText = `AEGIS-AI MEDICAL INTELLIGENCE REPORT\nTIMESTAMP: ${dateTime}\n\n[ PATIENT DATA ]\n${summary.patient_summary}\n\n[ RISK LEVEL ]\n${summary.risk_level.toUpperCase()}\n\n[ FINDINGS ]\n${summary.possible_conditions.join(', ')}\n\n[ DEPLOYMENT ADVICE ]\n${summary.recommended_action}`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aegis_Report_${Date.now()}.txt`;
    a.click();
  };

  const isHighRisk = summary.risk_level.toLowerCase().includes('critical') || 
                    summary.risk_level.toLowerCase().includes('high');

  return (
    <div className="glass-card p-10 neon-border border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden group">
      {/* Background Decals */}
      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-1000">
         <FileText className="w-64 h-64 text-neon-cyan" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-neon-cyan/10 rounded-2xl text-neon-cyan border border-neon-cyan/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Diagnostic Brief</h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Clock className="w-3 h-3" /> {dateTime || 'SYNCING...'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Download className="w-4 h-4" /> Export Telemetry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-8">
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group/quote">
              <div className="absolute -top-3 -left-3 p-2 bg-black border border-white/10 rounded-lg text-neon-cyan">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed italic font-medium">
                "{summary.patient_summary}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Risk Priority</span>
                <span className={cn(
                  "text-xl font-black uppercase italic tracking-tighter",
                  isHighRisk ? "text-red-500" : "text-neon-cyan"
                )}>
                  {summary.risk_level}
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Neural Match</span>
                <span className="text-xl font-black text-white uppercase italic tracking-tighter">
                  {summary.possible_conditions.length} Found
                </span>
              </div>
            </div>

            {summary.possible_conditions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Associated Classifications</h4>
                <div className="flex flex-wrap gap-3">
                  {summary.possible_conditions.map((cond, i) => (
                    <div key={i} className="px-4 py-2 rounded-xl bg-neon-cyan/5 border border-neon-cyan/10 text-neon-cyan text-[10px] font-black uppercase tracking-widest">
                      {cond}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="p-8 rounded-[2rem] bg-neon-cyan/10 border border-neon-cyan/20 group/advice h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 text-neon-cyan">
                  <Zap className="w-5 h-5 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Directive</span>
                </div>
                <p className="text-white font-bold leading-relaxed mb-8">
                  {summary.recommended_action}
                </p>
              </div>
              
              <button className="w-full py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neon-cyan transition-all group-hover/advice:translate-y-[-4px]">
                Protocol Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-cyan opacity-20 animate-scan" />
    </div>
  );
}
