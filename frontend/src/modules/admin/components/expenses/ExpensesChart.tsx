"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Expense } from "@/types/admin";
import { fmt } from "@/shared/utils/format";

interface ExpensesChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  fuel: "#0ea5e9", // sky-500
  maintenance: "#f59e0b", // amber-500
  parts: "#8b5cf6", // violet-500
  insurance: "#ec4899", // pink-500
  rent: "#10b981", // emerald-500
  salary: "#6366f1", // indigo-500
  marketing: "#f43f5e", // rose-500
  utilities: "#64748b", // slate-500
  other: "#94a3b8" // slate-400
};

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "Carburant",
  maintenance: "Entretien",
  parts: "Pièces",
  insurance: "Assurance",
  rent: "Loyer",
  salary: "Salaires",
  marketing: "Marketing",
  utilities: "Électricité/Internet",
  other: "Autre"
};

export default function ExpensesChart({ expenses }: ExpensesChartProps) {
  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    
    expenses.forEach(exp => {
      if (!totals[exp.category]) totals[exp.category] = 0;
      totals[exp.category] += Number(exp.amount);
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name: CATEGORY_LABELS[name] || name,
        key: name,
        value
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by largest expense
  }, [expenses]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-semibold italic bg-slate-50 rounded-2xl border border-slate-100">
        Aucune donnée à afficher pour cette période.
      </div>
    );
  }

  return (
    <div className="card-premium p-6 h-full flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Repartition des depenses</h3>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.key] || CATEGORY_COLORS.other} />
              ))}
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${fmt(value)} DH`, "Montant"]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b', lineHeight: '24px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
