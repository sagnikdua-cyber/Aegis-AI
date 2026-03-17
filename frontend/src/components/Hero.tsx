"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Shield, Activity, MapPin, PhoneCall } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });
      gsap.from(".hero-card", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden px-4">
      {/* Abstract Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hero-title">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-200">AI-Powered Emergency Support</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 hero-title">
          Aegis <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 hero-title max-w-2xl mx-auto">
          Intelligent emergency health assistant providing instant risk analysis, 
          first-aid guidance, and life-saving location services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <button className="hero-card group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left">
            <Activity className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Analyze Symptoms</h3>
            <p className="text-sm text-gray-500">Describe your symptoms via text or voice for instant risk assessment.</p>
          </button>
          
          <button className="hero-card group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left">
            <MapPin className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Find Help</h3>
            <p className="text-sm text-gray-500">Locate the nearest hospital, trauma center, or pharmacy instantly.</p>
          </button>

          <button className="hero-card group p-6 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-left">
            <PhoneCall className="w-8 h-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2 text-red-400">SOS Mode</h3>
            <p className="text-sm text-red-900/60">One-tap emergency alert to your primary contacts and location sharing.</p>
          </button>
        </div>
      </div>
    </section>
  );
}
