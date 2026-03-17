"use client";
import React, { useState } from 'react';
import { ShoppingBag, Search, ExternalLink, MapPin, Navigation, Pill } from 'lucide-react';
import api from '@/utils/api';
import { PharmacyInfo } from '@/types';

interface MedicineFinderProps {
  initialPharmacies?: PharmacyInfo[];
}

export default function MedicineFinder({ initialPharmacies = [] }: MedicineFinderProps) {
  const [pharmacies, setPharmacies] = useState<PharmacyInfo[]>(initialPharmacies);
  const [loading, setLoading] = useState(false);

  const findPharmacies = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await api.get<PharmacyInfo[]>(`/symptoms/nearby-pharmacies?lat=${latitude}&lng=${longitude}`);
          setPharmacies(response.data);
        } catch (error) {
          console.error("Error fetching pharmacies:", error);
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
    <div className="w-full">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 italic">
              <Pill className="text-green-500 w-8 h-8" /> Nearby Pharmacies
            </h2>
            <p className="text-gray-400">Discover medical stores and drugstores near your location</p>
          </div>
          <button 
            onClick={findPharmacies}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 transition-all text-white font-bold flex items-center gap-3 shadow-lg shadow-green-900/20 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Nearby"} <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.length > 0 ? pharmacies.map((p, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{p.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold border border-green-800/50">
                    {p.distance}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  {p.address}
                </p>
              </div>
              
              <a 
                href={p.map_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/10 group-hover:border-green-500/50"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>
          )) : !loading && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 italic">Tap "Search Nearby" to find pharmacies and medical stores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
