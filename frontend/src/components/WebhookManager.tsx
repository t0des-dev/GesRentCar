"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Plus,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Zap,
  ToggleLeft,
  ToggleRight,
  Play,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/shared/utils";

type WebhookEvent = "reservation.created" | "reservation.cancelled" | "payment.received" | "vehicle.returned" | "maintenance.due";

interface WebhookEntry {
  id: number;
  name: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  lastTriggered: string | null;
  failureCount: number;
}

const EVENT_LABELS: Record<WebhookEvent, string> = {
  "reservation.created": "Réservation créée",
  "reservation.cancelled": "Réservation annulée",
  "payment.received": "Paiement reçu",
  "vehicle.returned": "Véhicule retourné",
  "maintenance.due": "Maintenance prévue",
};

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>([
    { id: 1, name: "Slack Notifications", url: "https://hooks.slack.com/services/T00/B00/xxx", events: ["reservation.created", "payment.received"], active: true, lastTriggered: "2026-07-08 14:30", failureCount: 0 },
    { id: 2, name: "CRM Sync", url: "https://api.crm.com/webhook", events: ["reservation.created", "reservation.cancelled"], active: true, lastTriggered: "2026-07-08 12:15", failureCount: 2 },
    { id: 3, name: "Analytics", url: "https://analytics.example.com/ingest", events: ["payment.received", "vehicle.returned"], active: false, lastTriggered: null, failureCount: 12 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleDelete = (id: number) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const handleTest = (id: number) => {
    setTestingId(id);
    setTimeout(() => setTestingId(null), 1500);
  };

  const handleAdd = (data: { name: string; url: string; events: WebhookEvent[] }) => {
    setWebhooks(prev => [
      { id: Date.now(), ...data, active: true, lastTriggered: null, failureCount: 0 },
      ...prev,
    ]);
    setShowForm(false);
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Webhook size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Webhooks</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{webhooks.length} configuré(s)</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {webhooks.map((wh) => (
            <motion.div
              key={wh.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "p-4 rounded-xl border transition-all group",
                wh.active ? "border-border bg-surface-0" : "border-border bg-surface-1 opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggle(wh.id)} className="shrink-0">
                  {wh.active ? (
                    <ToggleRight size={24} className="text-primary" />
                  ) : (
                    <ToggleLeft size={24} className="text-ink-3" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-1 text-sm">{wh.name}</p>
                    {wh.failureCount > 5 && (
                      <span className="px-1.5 py-0.5 bg-red-50 rounded text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-0.5">
                        <AlertTriangle size={8} /> Erreurs
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest truncate mt-0.5 flex items-center gap-1">
                    <ExternalLink size={9} />
                    {wh.url}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {wh.events.map(evt => (
                      <span key={evt} className="px-1.5 py-0.5 bg-surface-2 rounded text-[9px] font-bold text-ink-3 uppercase tracking-widest">
                        {EVENT_LABELS[evt]}
                      </span>
                    ))}
                  </div>
                  {wh.lastTriggered && (
                    <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest mt-1.5">
                      Dernier déclenchement: {wh.lastTriggered} · {wh.failureCount} échec(s)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTest(wh.id)}
                    disabled={testingId === wh.id}
                    className="p-2 rounded-lg text-ink-3 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Tester"
                  >
                    {testingId === wh.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(wh.id)}
                    className="p-2 rounded-lg text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && <WebhookForm onAdd={handleAdd} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

function WebhookForm({ onAdd, onClose }: { onAdd: (data: { name: string; url: string; events: WebhookEvent[] }) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);

  const toggleEvent = (evt: WebhookEvent) => {
    setSelectedEvents(prev =>
      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || selectedEvents.length === 0) return;
    onAdd({ name, url, events: selectedEvents });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Nouveau Webhook</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon Webhook"
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Événements</label>
            <div className="space-y-1.5">
              {(Object.entries(EVENT_LABELS) as [WebhookEvent, string][]).map(([evt, label]) => (
                <button
                  key={evt}
                  type="button"
                  onClick={() => toggleEvent(evt)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all text-xs",
                    selectedEvents.includes(evt)
                      ? "border-primary/30 bg-primary/5 text-primary"
                      : "border-border bg-surface-1 text-ink-2 hover:bg-surface-2"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    selectedEvents.includes(evt) ? "bg-primary border-primary" : "border-border"
                  )}>
                    {selectedEvents.includes(evt) && <Check size={10} className="text-white" />}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 bg-surface-2 hover:bg-surface-3 transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors">
              Créer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
