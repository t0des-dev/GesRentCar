export function exportToCsv<T extends Record<string, unknown>>(data: T[], filename: string, headers?: string[]) {
  if (!data.length) return;

  const keys = headers || (Object.keys(data[0]) as string[]);
  const csvRows = [
    keys.join(","),
    ...data.map(row =>
      keys.map(k => {
        const val = String(row[k] ?? "");
        // Prevent CSV injection: prefix dangerous formula characters
        const safeVal = /^[=+\-@\t]/.test(val) ? `'${val}` : val;
        return safeVal.includes(",") || safeVal.includes('"') || safeVal.includes("\n")
          ? `"${safeVal.replace(/"/g, '""')}"`
          : safeVal;
      }).join(",")
    )
  ];

  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
