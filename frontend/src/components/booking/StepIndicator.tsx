"use client";

import { cn } from "@/lib/utils";
import { Check, Car, Calendar, Shield, User, PenTool, CreditCard, Info } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { label: "Véhicule", icon: Car },
  { label: "Période", icon: Calendar },
  { label: "Options", icon: Shield },
  { label: "Détails", icon: User },
  { label: "Signature", icon: PenTool },
  { label: "Paiement", icon: CreditCard },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative mb-12">
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-primary to-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        />
      </div>
      <div className="flex items-center justify-between mt-6 overflow-x-auto pb-4 hide-scrollbar">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={s.label} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div 
                onClick={() => i < currentStep && onStepClick(i)}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer", 
                  isCompleted ? "bg-slate-900 border-slate-900 text-white shadow-lg" : 
                  isActive ? "border-primary text-primary bg-primary/5 scale-110 shadow-xl shadow-primary/10" : 
                  "border-slate-200 text-slate-400 bg-white"
                )}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-colors", 
                isActive ? "text-primary" : isCompleted ? "text-slate-900" : "text-slate-400"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
