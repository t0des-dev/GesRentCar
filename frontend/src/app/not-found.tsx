import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
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
          Page introuvable
        </h1>
        <p className="mt-4 text-surface-600 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gold-500 text-white font-medium rounded-lg hover:bg-gold-600 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/flotte"
            className="px-6 py-3 border border-surface-300 text-surface-700 font-medium rounded-lg hover:bg-surface-100 transition-colors"
          >
            Voir la flotte
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
