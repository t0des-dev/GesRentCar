/**
 * Safe number formatter — never throws on undefined/null/NaN.
 */
export function fmt(value: unknown, locale = "fr-FR"): string {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num)) return "0";
  return num.toLocaleString(locale);
}
