"use client";

import { useState, useCallback } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import toast from "react-hot-toast";

interface ImportResult {
  imported: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

export default function ImportPage() {
  const { user, checking } = useAuthGuard("admin");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return;

    const parsed = lines.map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );

    setHeaders(parsed[0]);
    setPreview(parsed.slice(1, 6));
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      setResult(null);
      setProgress(0);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(f);
    },
    [parseCSV]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.name.endsWith(".csv")) {
        handleFile(f);
      } else {
        toast.error("Veuillez sélectionner un fichier CSV.");
      }
    },
    [handleFile]
  );

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/vehicles/import", formData, {
        headers: { "Content-Type": undefined },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      setResult(res.data);
      if (res.data.imported > 0) {
        toast.success(`${res.data.imported} véhicule(s) importé(s) !`);
      }
      if (res.data.skipped > 0) {
        toast(`${res.data.skipped} doublon(s) ignoré(s).`, { icon: "⚠️" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      toast.error(`Erreur: ${msg}`);
    } finally {
      setImporting(false);
    }
  };

  if (checking) return null;

  return (
    <>
      <AdminPageHeader
        icon={FileSpreadsheet}
        title="Import CSV"
        subtitle="Importez votre inventaire de véhicules en masse."
        backLabel="Retour Flotte"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("csv-input")?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 text-center ${
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-slate-300 dark:border-slate-600 hover:border-primary/50 bg-surface-1"
          }`}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                dragOver ? "bg-primary text-white" : "bg-primary/10 text-primary"
              }`}
            >
              <Upload size={28} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {file ? file.name : "Glissez votre fichier CSV ici"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} Ko — Cliquez pour changer`
                  : "ou cliquez pour parcourir"}
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <AnimatePresence>
          {preview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Aperçu — 5 premières lignes
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-1">
                        {headers.map((h, i) => (
                          <th
                            key={i}
                            className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, ri) => (
                        <tr
                          key={ri}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-4 py-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Import en cours... {progress}%
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Lancer l&apos;import
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {importing && (
                <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-0 p-6 space-y-4"
            >
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Résultat de l&apos;import
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4">
                  <CheckCircle className="text-emerald-500" size={24} />
                  <div>
                    <p className="text-2xl font-black text-emerald-600">
                      {result.imported}
                    </p>
                    <p className="text-xs text-emerald-500 uppercase tracking-wider font-semibold">
                      Importés
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4">
                  <AlertTriangle className="text-amber-500" size={24} />
                  <div>
                    <p className="text-2xl font-black text-amber-600">
                      {result.skipped}
                    </p>
                    <p className="text-xs text-amber-500 uppercase tracking-wider font-semibold">
                      Doublons ignorés
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4">
                  <XCircle className="text-red-500" size={24} />
                  <div>
                    <p className="text-2xl font-black text-red-600">
                      {result.errors.length}
                    </p>
                    <p className="text-xs text-red-500 uppercase tracking-wider font-semibold">
                      Erreurs
                    </p>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-lg px-3 py-2"
                    >
                      <span className="font-mono text-xs mt-0.5">
                        Ligne {err.row}:
                      </span>
                      <span>{err.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
