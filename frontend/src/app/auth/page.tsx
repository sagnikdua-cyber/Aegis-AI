"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import Scene from '@/components/three/Scene';
import Hologram from '@/components/three/Hologram';
import { cn } from '@/utils/cn';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(initMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = mode === 'signup' ? '/auth/register' : '/auth/login';
      const res = await api.post(endpoint, { email, password });
      
      localStorage.setItem('aegis_token', res.data.access_token);
      localStorage.setItem('aegis_user_id', res.data.user_id);

      if (mode === 'signup') {
        router.push('/onboarding');
      } else {
        try {
          const profileRes = await api.get('/user/profile');
          if (profileRes.data.name) {
             router.push('/dashboard');
          } else {
             router.push('/onboarding');
          }
        } catch (err) {
          router.push('/onboarding');
        }
      }
    } catch (err: any) {
      console.error("Auth error", err);
      if (err.response?.status === 404 && mode === 'login') {
         setError("No account previously found. Please register 1st.");
         setTimeout(() => setMode('signup'), 1500);
      } else {
         setError(err.response?.data?.detail || "Authentication failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === 'login' ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: mode === 'login' ? 100 : -100 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-10 neon-border bg-black/40 backdrop-blur-3xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" 
              />
              <div className="relative w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" 
                  animate={{ y: [0, 64, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>

            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
              AEGIS <span className="text-cyan-400">{mode === 'login' ? 'LOGIN' : 'SIGNUP'}</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
              {mode === 'login' ? 'Biometric Authentication Bypass' : 'Initializing Neural Medical Profile'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-xs text-center font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Access Email / ID</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium transition-all"
                  placeholder="user@aegis.io"
                />
                <div className="absolute top-0 right-4 h-full flex items-center">
                  <Zap className="w-4 h-4 text-gray-700" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Encryption Key / Pass</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 glass-panel rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium transition-all"
                  placeholder="••••••••"
                />
                <div className="absolute top-0 right-4 h-full flex items-center">
                  <Shield className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition-all shadow-2xl shadow-cyan-500/20 uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center group"
            >
              {loading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Authorize' : 'Initialize'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <button 
              type="button" 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors font-black uppercase tracking-[0.3em]"
            >
              {mode === 'login' ? 'Create New Profile_001' : 'Return to Authorization'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      <Scene>
        <Hologram />
      </Scene>
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" />

      <Suspense fallback={<div className="text-cyan-400 font-black animate-pulse uppercase tracking-[0.3em] text-xs">Initializing Secure Uplink...</div>}>
         <AuthContent />
      </Suspense>
    </main>
  );
}
