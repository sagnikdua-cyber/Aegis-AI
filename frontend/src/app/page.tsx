"use client";

import Hero from '@/components/layout/Hero';
import { Activity, ShieldAlert, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    title: "AI Symptom Analysis",
    description: "Advanced neural networks to identify and prioritize health risks in seconds.",
    icon: Search,
    color: "text-cyan-400",
    href: "/symptoms"
  },
  {
    title: "Emergency Response",
    description: "One-touch SOS with automated telemetry and location broadcasting.",
    icon: ShieldAlert,
    color: "text-red-500",
    href: "/emergency"
  },
  {
    title: "Smart Hospital Finder",
    description: "Real-time proximity matching with navigation and facility status.",
    icon: MapPin,
    color: "text-blue-500",
    href: "/emergency"
  },
  {
    title: "Injury Classification",
    description: "Computer vision analysis of injuries with step-by-step first aid guides.",
    icon: Activity,
    color: "text-green-400",
    href: "/injuries"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      
      {/* Features Grid */}
      <section className="py-24 px-6 container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Features
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Equipped with proprietary medical intelligence to protect you anywhere, anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", bounce: 0.4 }}
              className="h-full"
            >
              <motion.div
                animate={{ y: [0, -45, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.2
                }}
                className="glass-card p-8 cursor-default group hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 neon-border hover:neon-glow flex flex-col h-full"
              >
                <feature.icon className={`w-12 h-12 mb-6 transition-transform group-hover:scale-110 duration-500 ${feature.color}`} />
                <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Futuristic Background Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden -z-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
      </div>
    </main>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
