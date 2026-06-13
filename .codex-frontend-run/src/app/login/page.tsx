'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Shield, UserCog, Car, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects ou serveur injoignable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-0">
      {/* Left Side — Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden flex-col justify-between p-12"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center"
          >
            <Car size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold text-white leading-tight font-serif">
              Bienvenue à <span className="text-gold">Vectoria</span>
            </h1>
            <p className="text-lg text-white/85 font-light leading-relaxed">
              Accédez à votre tableau de bord de gestion de flotte premium et explorez les meilleures voitures de luxe.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 pt-6"
          >
            {[
              { icon: Shield, label: "Sécurité premium" },
              { icon: Mail, label: "Support 24/7" },
              { icon: Car, label: "Flotte mondiale" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <feature.icon size={18} />
                </div>
                <span className="font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-6 relative z-10 pt-12"
        >
          {[
            { value: "15K+", label: "Véhicules" },
            { value: "50+", label: "Destinations" },
            { value: "98%", label: "Satisfaction" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-white/70 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12"
      >
        <div className="w-full max-w-md">
          
          {/* Branding (Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:hidden text-center mb-10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Car size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-ink-1 font-serif mb-1">Vectoria</h1>
            <p className="text-ink-3 text-sm font-medium">Premium Car Rental</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl shadow-primary/10 border-2 border-border p-10 lg:p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-ink-1 mb-2">Connexion</h2>
              <p className="text-ink-3 text-sm">Accédez à votre compte Vectoria</p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Mail size={14} className="text-gold" /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Lock size={14} className="text-gold" /> Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                id="login-btn"
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold rounded-lg mt-2 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Se connecter
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-ink-3 text-sm">
                Pas encore de compte ?{' '}
                <a href="/register" className="font-bold text-gold hover:text-gold/90 transition-colors">
                  S'inscrire
                </a>
              </p>
            </div>
          </motion.div>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 pt-8 border-t border-border text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-4">Comptes de démonstration :</p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-1 border-2 border-border text-ink-2 font-bold text-xs uppercase tracking-wider hover:border-gold hover:bg-gold/5 transition-all"
                onClick={() => { setEmail('admin@vectoria.com'); setPassword('Admin2026!'); }}
              >
                <Shield size={14} /> Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-1 border-2 border-border text-ink-2 font-bold text-xs uppercase tracking-wider hover:border-gold hover:bg-gold/5 transition-all"
                onClick={() => { setEmail('agent@vectoria.com'); setPassword('Agent2026!'); }}
              >
                <UserCog size={14} /> Agent
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
