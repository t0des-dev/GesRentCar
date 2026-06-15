"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export default function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  backHref = "/admin",
  backLabel = "Dashboard",
  children,
}: AdminPageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Link
            href={backHref}
            className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-black uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> {backLabel}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 font-medium italic mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </motion.header>
  );
}
