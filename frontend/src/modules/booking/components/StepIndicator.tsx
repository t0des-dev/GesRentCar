"use client";

import { cn } from "@/shared/utils";
import { Check, Car, Calendar, Shield, User, PenTool, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  const [celebratingStep, setCelebratingStep] = useState<number | null>(null);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (currentStep > prevStepRef.current) {
      const timer = setTimeout(() => setCelebratingStep(currentStep - 1), 10);
      const clear = setTimeout(() => setCelebratingStep(null), 1010);
      prevStepRef.current = currentStep;
      return () => { clearTimeout(timer); clearTimeout(clear); };
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-4">
          Étape {currentStep + 1}/{STEPS.length}
        </span>
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i <= currentStep ? "bg-primary" : "bg-surface-2",
                i === currentStep ? "w-6" : "w-3"
              )}
            />
          ))}
        </div>
      </div>

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
          const isCelebrating = celebratingStep === i;

          return (
            <div key={s.label} className="flex flex-col items-center group">
              <div className="relative">
                <motion.div
                  onClick={() => { if (isCompleted) onStepClick(i); }}
                  whileHover={isCompleted ? { scale: 1.05 } : {}}
                  animate={isCelebrating ? { scale: [1, 1.2, 1] } : {}}
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground cursor-pointer shadow-sm"
                      : isActive
                        ? "border-primary text-primary bg-surface-0 scale-110 shadow-sm"
                        : "border-surface-2 text-ink-4 bg-surface-0 cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={isCelebrating ? { scale: 0, rotate: -180 } : {}}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <Icon size={16} />
                  ) : (
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  )}
                </motion.div>

                <AnimatePresence>
                  {isCelebrating && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((pi) => (
                        <motion.div
                          key={pi}
                          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [1, 1, 0],
                            scale: [0, 1, 0.5],
                            x: (pi % 2 === 0 ? 1 : -1) * (10 + pi * 5),
                            y: -10 - pi * 5,
                          }}
                          transition={{ duration: 0.8, delay: pi * 0.05, ease: "easeOut" }}
                          className="absolute w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: ["#D4AF37", "#1a365d", "#10B981", "#F59E0B"][pi % 4],
                          }}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex flex-col items-center">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                    isActive ? "text-primary" : isCompleted ? "text-ink-1" : "text-ink-4"
                  )}
                >
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
