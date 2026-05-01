"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import StorefrontManager from "@/components/StorefrontManager";
import styles from "../page.module.css";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function StorefrontPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',color:'#94a3b8'}}>Vérification...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/admin" style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <ChevronLeft size={16} /> Retour Dashboard
            </Link>
          </div>
          <h1 className={styles.title}>Configuration du Storefront</h1>
          <p className={styles.subtitle}>Gérez l'identité visuelle de votre instance ERP.</p>
        </div>
      </header>

      <div className={styles.section}>
        <StorefrontManager />
      </div>
    </div>
  );
}
