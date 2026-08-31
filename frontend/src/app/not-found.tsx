"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <p className="text-9xl font-serif text-gold-500 font-bold">404</p>
        <h1 className="mt-4 text-3xl font-bold text-surface-900">
          {t("not_found_title")}
        </h1>
        <p className="mt-4 text-surface-600 max-w-md mx-auto">
          {t("not_found_desc")}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gold-500 text-white font-medium rounded-lg hover:bg-gold-600 transition-colors"
          >
            {t("not_found_back_home")}
          </Link>
          <Link
            href="/flotte"
            className="px-6 py-3 border border-surface-300 text-surface-700 font-medium rounded-lg hover:bg-surface-100 transition-colors"
          >
            {t("not_found_fleet")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
