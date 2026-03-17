"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Phone, ExternalLink, Activity, Pill, Search, Radar, Shield } from 'lucide-react';
import api from '@/utils/api';
import { HospitalInfo, PharmacyInfo } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

// Dynamic import for Leaflet (prevents SSR errors)
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-[2.5rem] flex flex-col items-center justify-center text-neon-cyan/40 border border-white/10">
    <Radar className="w-12 h-12 mb-4 animate-spin-slow" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initializing Satellite Link...</span>
  </div>
});

interface HospitalFinderProps {
  initialHospitals?: HospitalInfo[];
}

export default function HospitalFinder({ initialHospitals = [] }: HospitalFinderProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<HospitalInfo[]>(initialHospitals);
  const [pharmacies, setPharmacies] = useState<PharmacyInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const locateAndSearch = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);
        
        try {
          const [hRes, pRes] = await Promise.all([
            api.get<HospitalInfo[]>(`/symptoms/nearby-hospitals?lat=${latitude}&lng=${longitude}`),
            api.get<PharmacyInfo[]>(`/symptoms/nearby-pharmacies?lat=${latitude}&lng=${longitude}`)
          ]);
          setHospitals(hRes.data);
          setPharmacies(pRes.data);
        } catch (error) {
          console.error("Error fetching nearby facilities:", error);
        } finally {
          setLoading(false);
        }
      }, (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* Header Panel */}
      <div className="glass-panel p-8 border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <Radar className="w-32 h-32 text-neon-cyan" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-neon-cyan/10 rounded-2xl text-neon-cyan border border-neon-cyan/20">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Geospatial Locator</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Satellite Analysis • Nearby Medical Assets</p>
            </div>
          </div>
          
          <button 
            onClick={locateAndSearch}
            disabled={loading}
            className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-neon-cyan transition-all shadow-2xl shadow-neon-cyan/20 group/btn"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />}
            {loading ? "Scanning Sector..." : "Sync Local Coordinates"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {coords && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl shadow-black/50"
          >
            <MapComponent 
              userCoords={coords} 
              hospitals={hospitals} 
              pharmacies={pharmacies} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Hospitals Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Strategic Health Assets</h3>
          </div>
          
          <div className="space-y-4">
            {hospitals.length > 0 ? hospitals.map((h, i) => (
              <motion.div 
                key={`h-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-red-500/30 transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-red-400 transition-colors">{h.name}</h4>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">{h.address}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    {h.distance}
                  </div>
                </div>
                
                <a 
                  href={h.map_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition-all text-gray-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10 hover:border-red-500"
                >
                  <Navigation className="w-4 h-4" /> Engage Navigation
                </a>
              </motion.div>
            )) : !loading && <div className="p-10 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-gray-600 font-black text-[10px] uppercase tracking-widest italic">No Assets Detected in Vector</div>}
          </div>
        </div>

        {/* Pharmacies Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Tactical Supply Chains</h3>
          </div>
          
          <div className="space-y-4">
            {pharmacies.length > 0 ? pharmacies.map((p, i) => (
              <motion.div 
                key={`p-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-green-500/30 transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-green-400 transition-colors">{p.name}</h4>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">{p.address}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-800/20 text-green-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    {p.distance}
                  </div>
                </div>
                
                <a 
                  href={p.map_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-green-500 hover:text-white transition-all text-gray-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10 hover:border-green-500"
                >
                  <Navigation className="w-4 h-4" /> Engage Navigation
                </a>
              </motion.div>
            )) : !loading && <div className="p-10 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-gray-600 font-black text-[10px] uppercase tracking-widest italic">No Supply Chain Detected</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
