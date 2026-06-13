"use client";

import { motion, Reorder } from "framer-motion";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
  active: boolean;
}

interface SectionReorderProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export default function SectionReorder({ sections, onChange }: SectionReorderProps) {
  return (
    <Reorder.Group 
      axis="y" 
      values={sections} 
      onReorder={onChange}
      className="space-y-3"
    >
      {sections.map((section) => (
        <Reorder.Item 
          key={section.id} 
          value={section}
          className={cn(
            "flex items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-primary/20 transition-all",
            !section.active && "opacity-50"
          )}
        >
          <GripVertical size={18} className="text-slate-300" />
          <div className="flex-1">
            <h4 className="text-sm font-black text-slate-900">{section.label}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Section ID: {section.id}</p>
          </div>
          <button 
            onClick={() => {
              const newSections = sections.map(s => s.id === section.id ? { ...s, active: !s.active } : s);
              onChange(newSections);
            }}
            className={cn(
              "p-2 rounded-xl transition-all",
              section.active ? "text-primary bg-primary/5" : "text-slate-300 bg-slate-50"
            )}
          >
            {section.active ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
