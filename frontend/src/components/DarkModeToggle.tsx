"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl bg-surface-1 border border-border hover:border-gold/40 flex items-center justify-center transition-colors"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, scale: 0, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-gold" />
        ) : (
          <Sun className="h-5 w-5 text-gold" />
        )}
      </motion.div>
    </motion.button>
  );
}
