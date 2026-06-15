"use client";

import { AlertTriangle, Car, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface MaintenanceAlertsProps {
  alerts?: { vehicle: string; plate: string; days: number }[];
}

export default function MaintenanceAlerts({ alerts }: MaintenanceAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-gradient-to-br from-red-500/20 to-red-500/10 border-2 border-red-400/40 rounded-2xl p-8 mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-red-500/30 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-400" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-red-600 tracking-tight">Alertes de Maintenance Critique</h2>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-white rounded-xl p-5 border-2 border-red-200 shadow-md hover:shadow-lg hover:shadow-red-200/30 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <Car size={20} className="text-red-500" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-red-900 text-sm truncate">{alert.vehicle}</p>
              <p className="text-xs font-bold uppercase text-red-400 tracking-wider">{alert.plate}</p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-red-500 text-white text-xs font-black px-3 py-2 rounded-lg flex items-center gap-1 flex-shrink-0"
            >
              <Zap size={14} strokeWidth={2} />
              {alert.days}j
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
