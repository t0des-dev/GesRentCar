"use client";

import { cn } from "@/shared/utils";
import { Check, Car, Calendar, Shield, User, PenTool, CreditCard } from "lucide-react";

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
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={s.label} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer",
                isCompleted
                  ? "bg-[var(--navy)] text-white"
                  : isActive
                  ? "bg-[var(--navy)] text-white ring-4 ring-[var(--navy)]/15"
                  : "bg-gray-100 text-gray-400"
              )}
              onClick={() => { if (isCompleted) onStepClick(i); }}
            >
              {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
            </div>
            <span className={cn(
              "text-[12px] font-semibold hidden sm:block ml-2",
              isActive ? "text-gray-900" : isCompleted ? "text-gray-600" : "text-gray-400"
            )}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "w-8 sm:w-14 h-px mx-2 sm:mx-3",
                i < currentStep ? "bg-[var(--navy)]" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
