"use client";

import { Mail, Shield, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: any[];
  onEdit: (u: any) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborateur</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle & Accès</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm text-primary shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-tight">{u.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                        <Mail size={10} /><span className="text-[11px] font-bold">{u.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black uppercase text-[10px] tracking-widest",
                    u.role === 'admin' ? "bg-red-50 border-red-100 text-red-600" : "bg-blue-50 border-blue-100 text-blue-600"
                  )}>
                    <Shield size={12} strokeWidth={3} /> {u.role === 'admin' ? "Administrateur" : "Agent Fleet"}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(u)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all"><Edit size={16} /></button>
                    <button onClick={() => onDelete(u.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
