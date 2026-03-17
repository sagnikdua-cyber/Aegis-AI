"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, Heart, Scan, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { InjuryDetectionResponse, HospitalInfo } from '@/types';
import FirstAidSteps from './FirstAidSteps';
import EmergencyAlert from './EmergencyAlert';
import Scene from './three/Scene';
import MedicalCross from './three/MedicalCross';
import { cn } from '@/utils/cn';

export default function InjuryDetector() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InjuryDetectionResponse | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyHospitals, setEmergencyHospitals] = useState<HospitalInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Unable to access the camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const analyzeInjury = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post<InjuryDetectionResponse>('/symptoms/detect-injury', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      setResult(data);

      const reportRes = await api.post('/symptoms/generate-structured-report', {
        symptoms: "Detected Injury: " + data.injury_type,
        risk_level: data.severity,
        detected_injuries: data.injury_type,
        location: null
      });

      localStorage.setItem('aegis_latest_report', JSON.stringify(reportRes.data));
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);

    } catch (error) {
      console.error("Injury detection failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <EmergencyAlert 
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
        riskLevel={result?.severity || 'High'}
        instructions={result?.recommended_actions || []}
        hospitals={emergencyHospitals}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Zap className="w-3 h-3" /> Emergency Core v2.0
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 text-white">
            Trauma <span className="text-red-500 underline decoration-white/10 underline-offset-8">Scan.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">
            Computer vision triage for immediate injury classification and first-aid synthesis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: 3D Visualization / Preview */}
          <div className="relative h-[600px] glass-card rounded-[3rem] neon-border border-red-500/30 bg-black/40 overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <div className="absolute inset-0 z-0">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 opacity-40 animate-scan z-10" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : file ? (
              <img src={URL.createObjectURL(file)} alt="Trauma Preview" className="w-full h-full object-cover grayscale opacity-40" />
            ) : (
              <Scene>
                <MedicalCross />
              </Scene>
            )}

            <div className="absolute top-8 left-8 flex flex-col gap-4">
              <div className="p-6 glass-panel rounded-2xl border-red-500/20 bg-black/60 pointer-events-none backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Scan className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Visual Uplink Active</span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Cross-referencing trauma<br/>database for classification</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4">
              <AnimatePresence>
                {isCameraActive && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 self-center z-20 shadow-[0_0_30px_rgba(239,68,68,0.5)] group"
                  >
                    <div className="w-full h-full bg-red-600 rounded-full group-hover:scale-90 transition-transform" />
                  </motion.button>
                )}
              </AnimatePresence>
              
              <div className="flex-1 glass-panel rounded-2xl p-4 flex items-center gap-4 bg-black/60 border-red-500/10 backdrop-blur-xl">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 italic">Emergency Broadcast Ready...</span>
              </div>
            </div>
          </div>

          {/* Right Side: Deployment Controls */}
          <div className="space-y-8">
            <div className="glass-card p-10 neon-border border-red-500/30 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 opacity-20" />
              
              <div className="space-y-6">
                {!file && !isCameraActive ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={startCamera}
                      className="p-10 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-red-500/30 transition-all group flex flex-col items-center gap-4"
                    >
                      <Camera className="w-10 h-10 text-gray-600 group-hover:text-red-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white">Live Camera</span>
                    </button>
                    <label className="p-10 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-red-500/30 transition-all group flex flex-col items-center gap-4 cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-600 group-hover:text-red-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white">Upload File</span>
                      <input type="file" className="hidden" onChange={(e) => {
                        const sFile = e.target.files?.[0];
                        if (sFile) setFile(sFile);
                      }} accept="image/*" />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Telemetry Received</h3>
                      <button onClick={() => { setFile(null); stopCamera(); }} className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors">Reset</button>
                    </div>
                    
                    <button 
                      onClick={analyzeInjury}
                      disabled={loading || (!file && !isCameraActive)}
                      className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all shadow-2xl shadow-red-900/40 uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      {loading ? (
                        <>
                          <Activity className="w-5 h-5 animate-spin" />
                          Classifying Trauma...
                        </>
                      ) : (
                        <>
                          Initialize Analysis
                          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="glass-card p-10 border-red-500/30 bg-red-950/20 backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                      <AlertTriangle className="w-16 h-16 text-red-500 opacity-20" />
                    </div>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-4">Urgent Diagnostics</p>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">{result.injury_type}</h3>
                    <div className="flex items-center gap-4">
                      <div className="px-6 py-2 rounded-full bg-red-500 text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20">
                        {result.severity} Priority
                      </div>
                    </div>
                  </div>

                  <FirstAidSteps steps={result.recommended_actions} severity={result.severity} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {!result && !loading && (
              <div className="p-10 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.02] text-center">
                <Heart className="w-12 h-12 text-gray-800 mx-auto mb-6" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">Awaiting Trauma Feed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
