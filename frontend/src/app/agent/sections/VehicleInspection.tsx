"use client";

import { useState } from "react";
import { ShieldCheck, Camera, Loader2, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import styles from "../sections.module.css";

const API = "http://localhost:8000/api";
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
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setReport(data);
    } catch {
      setError("Impossible de contacter le service d'analyse.");
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = (s: number) => s >= 85 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";
  const severityColor: Record<string, string> = { None: "#10b981", Low: "#f59e0b", Medium: "#f97316", High: "#ef4444" };

  return (
    <div>
      <h2 className={styles.sectionTitle}><ShieldCheck size={18} /> Inspection Véhicule</h2>
      <p className={styles.hint}>Analysez l'état du véhicule lors d'une prise en charge ou restitution.</p>

      {/* Saisie plaque */}
      <div className={styles.sectionCard}>
        <label className={styles.label}>Numéro de plaque</label>
        <input
          type="text"
          placeholder="ex: 1234-A-1"
          value={plateInput}
          onChange={(e) => setPlateInput(e.target.value)}
          className={styles.input}
        />
      </div>

      {/* Zone de capture simulée */}
      <div className={styles.scanTarget} onClick={!analyzing ? handleAnalyze : undefined}>
        {analyzing ? (
          <div className={styles.scannerAnimate}>
            <div className={styles.scannerLine} />
            <Loader2 size={32} className={styles.spinIcon} />
            <p>Analyse IA en cours...</p>
          </div>
        ) : report ? (
          <div className={styles.scanDone}>
            <CheckCircle2 size={40} color="#10b981" />
            <p>Analyse terminée</p>
          </div>
        ) : (
          <div className={styles.scanIdle}>
            <Camera size={48} />
            <p>Appuyer pour lancer l'inspection</p>
          </div>
        )}
      </div>

      <button className={styles.btnPrimary} onClick={handleAnalyze} disabled={analyzing}>
        {analyzing
          ? <><Loader2 size={16} className={styles.spinIcon} /> Analyse en cours...</>
          : <><Camera size={16} /> Lancer l'Inspection IA</>}
      </button>

      {error && <div className={styles.errorBox}><AlertTriangle size={15} /> {error}</div>}

      {/* Rapport */}
      {report && (
        <div className={styles.reportCard}>
          {/* Score */}
          <div className={styles.scoreCircleWrap}>
            <div className={styles.scoreCircle} style={{ borderColor: scoreColor(report.integrity_score) }}>
              <span style={{ color: scoreColor(report.integrity_score) }}>{report.integrity_score}</span>
              <small>/100</small>
            </div>
            <div>
              <p className={styles.scoreLabelMain}>Score d'Intégrité</p>
              <p className={styles.scoreSub} style={{ color: scoreColor(report.integrity_score) }}>
                {report.integrity_score >= 85 ? "Excellent" : report.integrity_score >= 60 ? "Correct" : "Dégradé"}
              </p>
            </div>
          </div>

          {/* Détections */}
          <h4 className={styles.detectionTitle}><Wrench size={15} /> Détections</h4>
          <div className={styles.detectionList}>
            {report.detections.map((d, i) => (
              <div key={i} className={styles.detectionRow}>
                <div>
                  <p className={styles.detPart}>{d.part}</p>
                  <p className={styles.detIssue}>{d.issue}</p>
                </div>
                <span className={styles.severityBadge} style={{
                  background: `${severityColor[d.severity]}18`,
                  color: severityColor[d.severity],
                }}>
                  {d.severity}
                </span>
              </div>
            ))}
          </div>

          {/* Coût estimé */}
          <div className={styles.costBox}>
            <span>Coût de réparation estimé</span>
            <strong>{report.estimated_repair_cost.toLocaleString("fr-FR")} DH</strong>
          </div>
        </div>
      )}
    </div>
  );
}
