"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.back()}
      className="fixed top-4 left-4 md:top-6 md:left-6 z-[110] flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full glass-panel border border-white/10 bg-black/40 backdrop-blur-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors shadow-xl group"
      aria-label="Go back"
    >
      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
    </motion.button>
  );
}
