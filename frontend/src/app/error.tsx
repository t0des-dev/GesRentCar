"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900">
          Une erreur est survenue
        </h1>
        <p className="mt-4 text-surface-600 max-w-md mx-auto">
          {error.message || "Une erreur inattendue s'est produite."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gold-500 text-white font-medium rounded-lg hover:bg-gold-600 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-surface-300 text-surface-700 font-medium rounded-lg hover:bg-surface-100 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
