"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Save, Activity, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import Scene from '@/components/three/Scene';
import DNAHelix from '@/components/three/DNAHelix';
import { cn } from '@/utils/cn';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await api.post('/user/profile', {
        name: formData.name,
        age: parseInt(formData.age),
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        allergies: [],
        chronic_diseases: [],
        medications: []
      });
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Profile saving error", err);
      setError("Data synchronization failed. Please check medical telemetry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      <Scene>
        <DNAHelix />
      </Scene>
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-10 gap-2">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 w-12 rounded-full transition-all duration-500",
                step === i ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="glass-card p-10 neon-border bg-black/40 backdrop-blur-3xl"
          >
            <div className="mb-10 text-center">
              <div className="relative mb-6 inline-block">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" 
                />
                <div className="relative w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group overflow-hidden">
                  <motion.div
                    animate={step === 1 ? { scale: [1, 1.1, 1] } : { rotate: 360 }}
                    transition={step === 1 ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    {step === 1 ? <Fingerprint className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" /> : <Activity className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />}
                  </motion.div>
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" 
                    animate={{ y: [0, 64, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                {step === 1 ? 'Bio-Identity' : 'Emergency Telemetry'}
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {step === 1 ? 'Step_01: Biological Profile Initialization' : 'Step_02: SOS Network Configuration'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Biological Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="Enter Full Name"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Current Age</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="Age"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Next of Kin / Contact Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="Guardian Name"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Emergency Uplink (Phone)</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {step === 2 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 rounded-2xl border border-white/10 hover:bg-white/5 text-gray-400 font-black text-xs uppercase tracking-[0.2em] transition-all"
                  >
                    Previous
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {step === 1 ? 'Configure Telemetry' : 'Complete Sync'}
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
