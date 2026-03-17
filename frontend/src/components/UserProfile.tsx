'use client';

import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Plus, Trash2, Save, CheckCircle, RefreshCcw, Fingerprint, Activity, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { UserProfile as UserProfileType } from '@/types';
import { cn } from '@/utils/cn';

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileType>({
    name: "Sagnik",
    age: 26,
    gender: "Male",
    allergies: ["Penicillin"],
    chronic_diseases: ["None"],
    medications: ["Vitamin D"],
    emergency_contact_name: "John Doe",
    emergency_contact_phone: "+1 (555) 000-1111"
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<UserProfileType>(`/user/profile`);
        if (response.data && response.data.name) {
           setProfile(response.data);
           localStorage.setItem('aegis_user_profile', JSON.stringify(response.data));
        } else {
           setProfile({
             name: "", 
             age: 0,
             gender: "Not Specified",
             allergies: [],
             chronic_diseases: [],
             medications: [],
             emergency_contact_name: "",
             emergency_contact_phone: ""
           });
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/user/profile', profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      localStorage.setItem('aegis_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    } finally {
      setLoading(false);
    }
  };

  const addField = (field: 'allergies' | 'chronic_diseases' | 'medications') => {
    const val = prompt(`Add ${field.replace('_', ' ')}:`);
    if (val) {
      setProfile(prev => ({ ...prev, [field]: [...prev[field], val] }));
    }
  };

  const removeField = (field: 'allergies' | 'chronic_diseases' | 'medications', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-neon-cyan/10 rounded-2xl text-neon-cyan border border-neon-cyan/20">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Biometric Profile</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {profile.name.toUpperCase()}-0932</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className={cn(
              "p-4 rounded-xl transition-all shadow-lg",
              success ? "bg-green-500 text-black" : "bg-white/5 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/10"
            )}
          >
            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 
             success ? <CheckCircle className="w-5 h-5" /> : 
             <Save className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="p-8 glass-card border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Full Name</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-cyan focus:bg-white/5 outline-none transition-all font-bold italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Age / YR</label>
              <input 
                type="number" 
                value={profile.age} 
                onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-cyan focus:bg-white/5 outline-none transition-all font-bold italic"
              />
            </div>
          </div>
        </div>

        <div className="p-8 glass-panel border-red-500/20 bg-red-950/10">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Activity className="w-3 h-3" /> Allergies
             </h3>
             <button onClick={() => addField('allergies')} className="p-2 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 transition-all">
                <Plus className="w-3 h-3" />
             </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {profile.allergies.map((a, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black flex items-center gap-3 uppercase tracking-widest shadow-lg shadow-red-950/20"
                >
                   {a}
                   <Trash2 onClick={() => removeField('allergies', i)} className="w-3 h-3 cursor-pointer opacity-40 hover:opacity-100 hover:text-white transition-all" />
                </motion.div>
              ))}
            </AnimatePresence>
            {profile.allergies.length === 0 && <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">No Data Logged</p>}
          </div>
        </div>

        <div className="p-8 glass-panel border-neon-cyan/20 bg-neon-cyan/5">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.3em] flex items-center gap-2">
               <Heart className="w-3 h-3" /> Medications
             </h3>
             <button onClick={() => addField('medications')} className="p-2 rounded-lg bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-all">
                <Plus className="w-3 h-3" />
             </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {profile.medications.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black flex items-center gap-3 uppercase tracking-widest shadow-lg shadow-cyan-950/20"
                >
                   {m}
                   <Trash2 onClick={() => removeField('medications', i)} className="w-3 h-3 cursor-pointer opacity-40 hover:opacity-100 hover:text-white transition-all" />
                </motion.div>
              ))}
            </AnimatePresence>
            {profile.medications.length === 0 && <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">No Data Logged</p>}
          </div>
        </div>

        {/* SOS Contact Section - Ultra Urgent Style */}
        <div className="p-8 rounded-[2.5rem] bg-red-600 border border-red-500 shadow-2xl shadow-red-900/40 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
             <ShieldAlert className="w-32 h-32 text-white" />
           </div>
           
           <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Emergency Proxy</h3>
           </div>
           
           <div className="space-y-4 relative z-10">
              <input 
                type="text" 
                placeholder="Trustee Name"
                value={profile.emergency_contact_name || ''} 
                onChange={e => setProfile({...profile, emergency_contact_name: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-white/30 text-sm focus:bg-black/40 outline-none transition-all font-bold italic"
              />
              <input 
                type="text" 
                placeholder="+1 000 000 0000"
                value={profile.emergency_contact_phone || ''} 
                onChange={e => setProfile({...profile, emergency_contact_phone: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-white/30 text-sm focus:bg-black/40 outline-none transition-all font-bold italic"
              />
           </div>
           <p className="mt-4 text-[9px] text-white/60 font-black uppercase tracking-widest italic relative z-10">
             Authorized responder for medical telemetry.
           </p>
        </div>
      </div>
    </div>
  );
}
