"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, Search, LogOut, ChevronDown, X
} from "lucide-react";
import { cn } from "@/shared/utils";
import { useState, useMemo } from "react";

interface AdminSidebarProps {
  groups: any[];
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
  onLogout: () => void;
  user: any;
}

export default function AdminSidebar({ 
  groups, pathname, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, onLogout, user 
}: AdminSidebarProps) {
  const [search, setSearch] = useState("");
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  const filteredGroups = useMemo(() => {
    if (!search) return groups;
    return groups.map(group => {
      const filteredItems = group.items.filter((item: any) => 
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.subItems?.some((sub: any) => sub.label.toLowerCase().includes(search.toLowerCase()))
      );
      return { ...group, items: filteredItems };
    }).filter(g => g.items.length > 0);
  }, [groups, search]);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border relative">
      {/* Header Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-ink-1 italic">V</span>
          </div>
          {(!isCollapsed || isMobileOpen) && (
             <span className="font-bold text-ink-1 tracking-tight">Vectoria<span className="text-gold">Admin</span></span>
          )}
        </Link>
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto p-2 text-ink-3 hover:text-ink-1 md:hidden">
             <X size={20} />
          </button>
        )}
      </div>

      {/* Collapse Toggle (Desktop only) */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-20 w-7 h-7 bg-white border-2 border-border rounded-full hidden md:flex items-center justify-center text-ink-2 hover:text-gold hover:border-gold transition-all z-30 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
        </button>
      )}

      {/* Search Bar */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" size={14} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-gold transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="mb-6">
            {(!isCollapsed || isMobileOpen) && (
               <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 px-3 mb-2">{group.title}</p>
            )}
            
            <div className="space-y-1">
              {group.items.map((item: any) => {
                const isActive = pathname === item.href || item.subItems?.some((sub:any) => pathname === sub.href);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openMenus.includes(item.label) || isActive;

                return (
                  <div key={item.label}>
                    {hasSubItems ? (
                      <button 
                        onClick={() => {
                          if (isCollapsed && !isMobileOpen) setIsCollapsed(false);
                          toggleMenu(item.label);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                          isActive ? "bg-gold/10 text-gold font-bold" : "text-ink-2 hover:bg-surface-1 font-semibold",
                          isCollapsed && !isMobileOpen ? "justify-center" : ""
                        )}
                      >
                        <item.icon size={18} className={isActive ? "text-gold" : "text-ink-3"} />
                        {(!isCollapsed || isMobileOpen) && (
                           <>
                             <span className="text-sm flex-1 text-left">{item.label}</span>
                             <ChevronDown size={14} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
                           </>
                        )}
                      </button>
                    ) : (
                      <Link 
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                          isActive ? "bg-gold/10 text-gold font-bold" : "text-ink-2 hover:bg-surface-1 font-semibold",
                          isCollapsed && !isMobileOpen ? "justify-center" : ""
                        )}
                      >
                        <item.icon size={18} className={isActive ? "text-gold" : "text-ink-3"} />
                        {(!isCollapsed || isMobileOpen) && (
                           <span className="text-sm flex-1 text-left">{item.label}</span>
                        )}
                      </Link>
                    )}

                    {/* SubItems */}
                    {hasSubItems && (!isCollapsed || isMobileOpen) && (
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 pl-4 border-l border-border mt-1 space-y-1"
                          >
                            {item.subItems.map((sub: any) => {
                              const isSubActive = pathname === sub.href;
                              return (
                                <Link 
                                  key={sub.label} 
                                  href={sub.href}
                                  className={cn(
                                    "block px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                                    isSubActive ? "text-gold bg-gold/5" : "text-ink-3 hover:text-ink-1 hover:bg-surface-1"
                                  )}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-border bg-surface-0/50">
        {isCollapsed && !isMobileOpen ? (
          <button onClick={onLogout} className="w-full flex items-center justify-center p-2 rounded-xl text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors" title="Déconnexion">
            <LogOut size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center text-sm font-bold text-gold shrink-0">
               {user?.name?.charAt(0) || "A"}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-1 truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 truncate">{user?.role || "Administrateur"}</p>
             </div>
             <button onClick={onLogout} className="p-2 text-ink-3 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all shrink-0">
               <LogOut size={16} />
             </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-72 z-[101] md:hidden"
      >
        {SidebarContent}
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-50"
      >
        {SidebarContent}
      </motion.aside>
    </>
  );
}
