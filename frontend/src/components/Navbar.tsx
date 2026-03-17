'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, MapPin, AlertCircle, Home } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Symptoms', path: '/symptoms', icon: Activity },
  { name: 'Injuries', path: '/injuries', icon: AlertCircle },
  { name: 'Emergency', path: '/emergency', icon: AlertCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on landing, auth, and onboarding pages
  if (['/', '/auth', '/onboarding'].includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-8">
      <Link href="/dashboard" className="text-xl font-bold text-white mr-4">AegisAI</Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
