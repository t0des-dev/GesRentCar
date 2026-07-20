"use client";

import { useState } from "react";
import { ShieldCheck, Camera, Loader2, AlertTriangle, CheckCircle2, Wrench, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

import { API_URL as API } from "@/lib/api/config";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

type Detection = { part: string; issue: string; severity: string };
type Report = { integrity_score: number; detections: Detection[]; estimated_repair_cost: number };

export default function VehicleInspection() {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [plateInput, setPlateInput] = useState("");

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch(`${API}/ocr/analyze-damage`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json", 
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ plate: plateInput }),
      });
      const data = await res.json();
      setReport(data);
    } catch {
      setError("Impossible de contacter le service d'analyse.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-emerald-600 border-emerald-500 bg-emerald-50";
    if (s >= 60) return "text-amber-600 border-amber-500 bg-amber-50";
    return "text-red-600 border-red-500 bg-red-50";
  };

  const getSeverityStyle = (severity: string) => {
    const map: Record<string, string> = {
      Low: "badge-success",
      Medium: "badge-warning",
      High: "badge-destructive",
      None: "badge-neutral"
    };
    return map[severity] || map.None;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
            <ShieldCheck className="text-primary" size={22} />
            Inspection Véhicule
          </h2>
          <p className="text-slate-400 text-sm">Audit d'intégrité assisté par Vision IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Setup & Scan */}
        <div className="space-y-6">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-5">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Numéro de plaque</label>
              <input
                type="text"
                placeholder="ex: 1234-A-1"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value)}
                className="input-premium w-full px-5 py-3.5 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2.5 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 text-blue-600">
              <Info size={16} />
              <p className="text-[10px] font-semibold uppercase tracking-wider">L'inspection IA analyse l'extérieur pour détecter rayures et chocs.</p>
            </div>
          </div>

          <div 
            onClick={!analyzing ? handleAnalyze : undefined}
            className={cn(
              "aspect-square max-w-xs mx-auto rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group",
              analyzing ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-white"
            )}
          >
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div key="analyzing" className="flex flex-col items-center gap-3">
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
                    />
                  </div>
                  <Loader2 size={40} className="text-primary animate-spin" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Analyse IA...</p>
                </motion.div>
              ) : report ? (
                <motion.div key="done" className="text-center space-y-3">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">Audit Terminé</p>
                </motion.div>
              ) : (
                <motion.div key="idle" className="text-center space-y-3">
                  <Camera size={48} className="text-slate-200 group-hover:text-primary transition-colors" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Scanner le véhicule</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="btn-primary w-full flex items-center justify-center gap-2 text-[10px]"
          >
            {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {analyzing ? "Analyse en cours..." : "Lancer l'Inspection IA"}
          </button>
        </div>

        {/* Right Side: Report */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            {report ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm space-y-8"
              >
                {/* Integrity Score */}
                <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
                  <div className={cn(
                    "w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000",
                    getScoreColor(report.integrity_score)
                  )}>
                    <span className="text-3xl font-bold">{report.integrity_score}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-50">/ 100</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Score d'Intégrité</h4>
                    <p className="text-xl font-bold text-slate-900 leading-tight">
                      État global : <br />
                      <span className={cn(getScoreColor(report.integrity_score).split(' ')[0])}>
                        {report.integrity_score >= 85 ? "Excellent" : report.integrity_score >= 60 ? "Correct" : "Dégradé"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Detections List */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                    <Wrench size={12} className="text-primary" />
                    Points d'attention
                  </h4>
                  <div className="space-y-2">
                    {report.detections.length > 0 ? report.detections.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                        <div>
                          <p className="font-semibold text-slate-900">{d.part}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase">{d.issue}</p>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest",
                          getSeverityStyle(d.severity)
                        )}>
                          {d.severity}
                        </div>
                      </div>
                    )) : (
                      <div className="py-6 text-center text-slate-300 italic text-sm">Aucun dommage détecté.</div>
                    )}
                  </div>
                </div>

                {/* Estimated Cost */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Coût estimé des réparations</p>
                    <p className="text-sm text-slate-500">Calculé via intelligence artificielle</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {fmt(report.estimated_repair_cost)} DH
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 space-y-5"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle size={28} />
                </div>
                <p className="text-slate-500 font-medium max-w-xs">{error}</p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-100 rounded-2xl"
              >
                <ShieldCheck size={48} className="text-slate-100 mb-4" />
                <p className="text-slate-300 font-semibold uppercase tracking-widest text-[10px]">En attente d'analyse...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
