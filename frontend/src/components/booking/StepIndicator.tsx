"use client";

import { cn } from "@/lib/utils";
import { Check, Car, Calendar, Shield, User, PenTool, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { label: "Véhicule", icon: Car },
  { label: "Période", icon: Calendar },
  { label: "Options", icon: Shield },
  { label: "Identité", icon: User },
  { label: "Signature", icon: PenTool },
  { label: "Paiement", icon: CreditCard },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative mb-16">
      {/* Premium Progress Journey Bar */}
      <div className="absolute top-[24px] left-0 w-full h-[2px] bg-slate-100 z-0">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"
        />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={s.label} className="flex flex-col items-center group">
              <motion.div 
                onClick={() => i < currentStep && onStepClick(i)}
                whileHover={i < currentStep ? { scale: 1.1 } : {}}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 cursor-pointer relative", 
                  isCompleted ? "bg-slate-900 border-slate-900 text-white shadow-xl" : 
                  isActive ? "border-primary text-primary bg-white scale-125 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]" : 
                  "border-slate-200 text-slate-300 bg-white"
                )}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                
                {isActive && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
              
              <div className="mt-4 flex flex-col items-center gap-1">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500", 
                  isActive ? "text-primary opacity-100" : isCompleted ? "text-slate-900 opacity-60" : "text-slate-300"
                )}>
                  Étape {i + 1}
                </span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap", 
                  isActive ? "text-slate-900 scale-110" : isCompleted ? "text-slate-900 opacity-80" : "text-slate-300"
                )}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
