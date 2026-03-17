"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Activity, Heart, ShieldPlus, Dna, Stethoscope, Thermometer, Pill, Cross, Syringe, Microscope, AlertCircle, Database, Network, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Scene from "@/components/three/Scene";
import Shield from "@/components/three/Shield";

const floatingIcons = [
  { icon: Heart, delay: 0.2, x: -250, y: -180 },
  { icon: Activity, delay: 0.4, x: 260, y: -150 },
  { icon: ShieldPlus, delay: 0.6, x: -220, y: 160 },
  { icon: Dna, delay: 0.8, x: 230, y: 180 },
  { icon: Stethoscope, delay: 1.0, x: -80, y: -250 },
  { icon: Thermometer, delay: 1.2, x: 150, y: -240 },
  { icon: Pill, delay: 1.4, x: -280, y: 0 },
  { icon: Cross, delay: 1.6, x: 280, y: 20 },
  { icon: Syringe, delay: 1.8, x: 80, y: 260 },
  { icon: Microscope, delay: 2.0, x: -150, y: 240 },
  { icon: AlertCircle, delay: 2.2, x: 180, y: -60 },
  { icon: Database, delay: 2.4, x: -120, y: -80 },
  { icon: Network, delay: 2.6, x: 200, y: 80 },
  { icon: Phone, delay: 2.8, x: -60, y: 180 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-32">
      {/* 3D Background */}
      <Scene>
        <Shield />
      </Scene>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center">
        
        {/* Logo Container */}
        <div className="relative flex justify-center items-center mb-8">
          {/* Floating Icons Coming Out of Exact Center of Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none flex items-center justify-center">
            {floatingIcons.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{ 
                  opacity: 0.6, 
                  x: item.x, 
                  y: item.y, 
                  scale: 1 
                }}
                transition={{ 
                  duration: 2, 
                  delay: item.delay,
                  ease: "circOut" 
                }}
                className="absolute transition-all duration-500"
              >
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item.delay
                  }}
                >
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400/50 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-cyan-400/40 bg-black/60 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.3)] group hover:scale-105 transition-transform duration-500 z-10"
          >
            <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500 animate-pulse-slow" />
            <div className="relative w-[85%] h-[85%] z-10 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="AegisAI Central Core" 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 z-10 relative"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-black tracking-[0.2em] text-cyan-200 uppercase">
            Aegis Intelligence v2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase leading-tight"
        >
          Your Intelligent <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-[length:200%_auto] animate-pulse-slow">
            Medical Guardian.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed px-4"
        >
          Experience the future of healthcare with AegisAI. Instant diagnostics, 
          real-time emergency telemetry, and autonomous medical assistance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto relative z-20"
        >
          <Link
            href="/auth"
            className="group relative px-10 py-4 w-full sm:w-auto bg-cyan-500 text-black font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 w-full">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold tracking-wider text-white"
          >
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden md:flex pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
