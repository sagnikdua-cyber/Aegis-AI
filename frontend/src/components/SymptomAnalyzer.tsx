"use client";
import React, { useState } from 'react';
import { Mic, Send, AlertCircle, CheckCircle, Activity, Pill, User, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { SymptomAnalysisResponse, HospitalInfo } from '@/types';
import RiskIndicator from './RiskIndicator';
import EmergencyAlert from './EmergencyAlert';
import Scene from './three/Scene';
import HumanBody from './three/HumanBody';
import { cn } from '@/utils/cn';

export default function SymptomAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResponse | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyHospitals, setEmergencyHospitals] = useState<HospitalInfo[]>([]);

  const [aiError, setAiError] = useState(false);

  const fetchEmergencyResources = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await api.get<HospitalInfo[]>(`/symptoms/nearby-hospitals?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          setEmergencyHospitals(res.data);
        } catch (e) {
          console.error("Failed to fetch emergency hospitals", e);
        }
      });
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const triggerSOS = async (risk: string, symptoms: string[]) => {
    const storedProfile = localStorage.getItem('aegis_user_profile');
    const contactPhone = storedProfile ? JSON.parse(storedProfile).emergency_contact_phone : null;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          await api.post('/symptoms/alert-emergency-contact', {
            location: `${pos.coords.latitude}, ${pos.coords.longitude}`,
            risk_level: risk,
            contact_phone: contactPhone || "Emergency Services",
            symptoms: symptoms
          });
          console.log("SOS Alert Broadcasted");
        } catch (e) {
          console.error("SOS Broadcast failed", e);
        }
      });
    }
  };

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    setAiError(false);
    try {
      const response = await api.post<SymptomAnalysisResponse>('/symptoms/analyze-symptoms', { 
        symptoms_text: text 
      });
      const data = response.data;
      
      // The backend catches Gemini quota errors and returns a 200 OK with this fallback.
      if (
        data.predicted_conditions?.includes("Error in AI assessment") || 
        data.predicted_conditions?.includes("AI Service Unavailable") ||
        data.risk_level === "Unknown"
      ) {
        setAiError(true);
        setLoading(false);
        return;
      }

      setResult(data);

      let userCoords = null;
      if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          userCoords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) {
          console.warn("Geolocation failed or timed out, proceeding without location", e);
        }
      }

      if (data.risk_level.toLowerCase() === 'high' || data.risk_level.toLowerCase() === 'critical') {
        if (userCoords) {
           try {
             const res = await api.get<HospitalInfo[]>(`/symptoms/nearby-hospitals?lat=${userCoords.latitude}&lng=${userCoords.longitude}`);
             setEmergencyHospitals(res.data);
           } catch (e) {
             console.error("Failed to fetch emergency hospitals", e);
           }
        } else {
          fetchEmergencyResources();
        }
        setShowEmergency(true);
        triggerSOS(data.risk_level, data.extracted_symptoms);
      }

      const reportRes = await api.post('/symptoms/generate-structured-report', {
        symptoms: data.extracted_symptoms.join(", "),
        risk_level: data.risk_level,
        location: userCoords
      });

      localStorage.setItem('aegis_latest_report', JSON.stringify(reportRes.data));
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);

    } catch (error) {
      console.error("Analysis failed", error);
      setAiError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <EmergencyAlert 
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
        riskLevel={result?.risk_level || 'High'}
        instructions={result?.extracted_symptoms.map(s => `Monitor ${s}`) || []}
        hospitals={emergencyHospitals}
      />

      {/* AI Error Modal in Red and Black Theme */}
      <AnimatePresence>
        {aiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-black/90 border-2 border-red-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" />
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">
                    System Unavailable
                  </h3>
                  <p className="text-gray-400 font-medium text-sm leading-relaxed">
                    AI Analysis is currently unavailable due to high network traffic or API limits. 
                    <br/><br/>
                    <strong className="text-white uppercase tracking-wider text-xs">Please consult a medical expert or emergency services immediately.</strong>
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-red-900/50">
                  <button
                    onClick={() => setAiError(false)}
                    className="w-full py-4 px-6 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600 hover:border-red-500 rounded-xl font-bold uppercase tracking-[0.2em] transition-all text-xs"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            AI <span className="text-cyan-400">Analysis.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium tracking-wide uppercase text-sm">
            Neural Diagnostic Engine v4.0 - describing symptoms for autonomous clinical assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: 3D Model and Interaction */}
          <div className="relative h-[600px] glass-card rounded-[3rem] neon-border bg-black/40 overflow-hidden">
            <Scene>
              <HumanBody onPartClick={(part) => setText(prev => prev + ` Problem in ${part}. `)} />
            </Scene>
            
            <div className="absolute top-8 left-8 p-6 glass-panel rounded-2xl neon-border border-cyan-500/20 bg-black/60 pointer-events-none">
              <div className="flex items-center gap-3 mb-2">
                <Scan className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Neural Scan Active</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select region for target analysis</p>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex gap-4">
              <div className="flex-1 glass-panel rounded-2xl p-4 flex items-center gap-4 bg-black/60 border-white/5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 italic">Tracking Biometrics...</span>
              </div>
            </div>
          </div>

          {/* Right Side: Input and Results */}
          <div className="space-y-8">
            <div className="glass-card p-10 neon-border bg-black/40 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 opacity-20 animate-scan" />
              
              <div className="mb-8">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Symptom Input Telemetry</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Initialize diagnostic report by describing symptoms..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleVoiceInput}
                  className={cn(
                    "p-5 rounded-2xl transition-all border",
                    isListening 
                      ? 'bg-cyan-500 text-black border-cyan-400 animate-pulse' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  )}
                >
                  <Mic className={cn("w-6 h-6", isListening && "scale-110")} />
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !text}
                  className="flex-1 py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition-all shadow-2xl shadow-cyan-500/20 uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? "INITIALIZING SCAN..." : "RUN NEURAL ANALYSIS"} 
                  <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="glass-card p-8 border-cyan-500/30 flex items-center gap-8 bg-black/60 backdrop-blur-2xl">
                    <RiskIndicator riskLevel={result.risk_level} />
                    <div className="h-12 w-[1px] bg-white/10" />
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Risk Level Verified</p>
                      <p className="text-xl font-black italic uppercase text-white tracking-tight">{result.risk_level}</p>
                    </div>
                  </div>

                  <div className="glass-card p-8 neon-border bg-black/60 backdrop-blur-2xl overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-black uppercase tracking-[0.2em] text-xs text-white italic">Potential Diagnostics</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.predicted_conditions.map((cond, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-xs uppercase tracking-tight italic">
                          <CheckCircle className="w-4 h-4 text-cyan-500" /> {cond}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full py-12 flex flex-col items-center justify-center text-center p-12 rounded-[2rem] border border-dashed border-white/10 bg-black/20"
                >
                  <Activity className="w-12 h-12 text-gray-800 mb-6 animate-pulse-slow" />
                  <h3 className="text-sm font-black text-gray-700 uppercase tracking-[0.3em]">Awaiting Uplink</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
