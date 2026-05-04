"use client";

import { LayoutDashboard, PlusCircle, ClipboardList, ShieldCheck } from "lucide-react";
import styles from "../page.module.css";

interface AgentSidebarProps {
  activeTab: string;
  setTab: (id: string) => void;
}

const TABS = [
  { id: "home",         label: "Accueil",    icon: LayoutDashboard },
  { id: "new",          label: "Nouvelle",   icon: PlusCircle },
  { id: "reservations", label: "Locations",  icon: ClipboardList },
  { id: "inspection",   label: "Inspection", icon: ShieldCheck },
];

export default function AgentSidebar({ activeTab, setTab }: AgentSidebarProps) {
  return (
    <nav className={styles.tabs}>
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
          onClick={() => setTab(id)}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
