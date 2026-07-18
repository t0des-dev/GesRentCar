"use client";

import { motion } from "framer-motion";
import { Mail, Shield, Edit, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-0 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-1 border-b-2 border-border">
            <tr>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-ink-3">Collaborateur</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-ink-3">Rôle & Accès</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-ink-3 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-border"
          >
            {users.map((u) => (
              <motion.tr
                key={u.id}
                variants={rowItem}
                className="hover:bg-surface-1 transition-colors group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-1 border-2 border-border flex items-center justify-center font-bold text-sm text-gold shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-serif text-ink-1 leading-tight">{u.name}</p>
                      <div className="flex items-center gap-1.5 text-ink-3 mt-0.5">
                        <Mail size={10} /><span className="text-[11px] font-bold">{u.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-bold uppercase text-[10px] tracking-wider",
                    u.role === 'admin' ? "bg-red-50 border-red-100 text-red-600" : "bg-blue-50 border-blue-100 text-blue-600"
                  )}>
                    <Shield size={12} strokeWidth={3} /> {u.role === 'admin' ? "Administrateur" : "Agent Fleet"}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={() => onEdit(u)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-surface-1 border-2 border-border rounded-xl text-ink-3 hover:text-gold hover:border-gold/40 transition-all"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(u.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-surface-1 border-2 border-border rounded-xl text-ink-3 hover:text-red-400 hover:border-red-400/40 transition-all"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
