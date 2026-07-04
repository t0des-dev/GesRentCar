"use client";

import { cn } from "@/shared/utils";
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
    <div className="relative mb-12">
      <div className="absolute top-[22px] left-0 w-full h-[2px] bg-surface-2 z-0">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          className="h-full bg-primary transition-all duration-700"
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
                whileHover={i < currentStep ? { scale: 1.05 } : {}}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 cursor-pointer relative", 
                  isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                  isActive ? "border-primary text-primary bg-surface-0 scale-110 shadow-sm" : 
                  "border-border text-ink-4 bg-surface-0"
                )}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </motion.div>
              
              <div className="mt-3 flex flex-col items-center">
                <span className={cn(
                  "text-xs font-medium uppercase tracking-wider transition-all duration-300", 
                  isActive ? "text-primary" : isCompleted ? "text-ink-1" : "text-ink-4"
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
