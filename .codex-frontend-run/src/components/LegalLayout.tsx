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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-6"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Shield size={28} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-slate-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
              <div className="h-0.5 w-16 bg-primary rounded-full" />
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-10 md:p-16 prose prose-slate prose-lg max-w-none"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
