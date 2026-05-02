"use client";

import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Header */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-8"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Shield size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {title}
              </h1>
              <p className="text-slate-500 font-medium">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
              <div className="h-1 w-20 bg-primary rounded-full" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[48px] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 prose prose-slate prose-lg max-w-none"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
