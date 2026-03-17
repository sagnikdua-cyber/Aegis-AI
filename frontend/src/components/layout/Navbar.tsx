"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Home, User, Activity, ShieldAlert, LayoutDashboard, Zap, ZapOff } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/onboarding", icon: User },
  { name: "Symptoms", href: "/symptoms", icon: Activity },
  { name: "Injuries", href: "/injuries", icon: ShieldAlert },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on landing, auth, and onboarding pages
  const hiddenRoutes = ['/', '/auth', '/onboarding'];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 md:top-8 left-0 w-full z-[100] flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto w-[95%] md:w-auto max-w-5xl glass-panel flex items-center justify-between md:justify-center gap-4 md:gap-10 px-5 md:px-8 py-3 md:py-4 neon-border bg-black/40 backdrop-blur-3xl rounded-full border-white/10 shadow-3xl shadow-black/50">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 md:w-10 md:h-10 group-hover:rotate-[360deg] transition-transform duration-1000">
             <div className="absolute inset-0 bg-neon-cyan/20 blur-xl group-hover:bg-neon-cyan/40 transition-colors rounded-full" />
             <Image src="/logo.png" alt="AegisAI" fill className="object-contain relative z-10" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-black tracking-tighter text-lg md:text-xl text-white leading-none">
              AEGIS<span className="text-neon-cyan">AI</span>
            </span>
            <span className="text-[6px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Tactical Med-OS</span>
          </div>
        </Link>

        <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-5 py-3 rounded-2xl flex items-center gap-3 transition-all relative group overflow-hidden",
                  isActive ? "bg-white/5 text-neon-cyan" : "text-gray-500 hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-neon-cyan/5 -z-10"
                  />
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </motion.nav>
  );
}
