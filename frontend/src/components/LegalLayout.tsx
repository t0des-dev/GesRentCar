"use client";

import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <div 
              className={`sticky top-32 space-y-6 transition-all duration-500 ease-out ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`}
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
            </div>
          </div>

          <div className="lg:col-span-8">
            <div 
              className={`bg-white rounded-3xl border border-slate-100/80 shadow-sm p-10 md:p-16 prose prose-slate prose-lg max-w-none transition-all duration-500 delay-200 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
