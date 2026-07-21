'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Shield, Car, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Sparkles, KeyRound, Crown, Star } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/context';
import { motion, AnimatePresence } from 'framer-motion';
import { notifyInfo } from "@/components/Notifications";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const role = user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "agent") router.push("/agent");
      else router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const u = await login(email, password);
      const role = u?.role;
      if (role === "admin") router.push("/admin");
      else if (role === "agent") router.push("/agent");
      else router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Identifiants incorrects ou serveur injoignable.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: string) => {
    setLoading(true);
    setError('');
    const passwords: Record<string, string> = {
      admin: 'Admin2026!',
      agent: 'Agent2026!',
      client: 'Client2026!',
    };
    try {
      const u = await login(`${role}@vectoria.com`, passwords[role]);
      const r = u?.role;
      if (r === "admin") router.push("/admin");
      else if (r === "agent") router.push("/agent");
      else router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || `Compte démo ${role} non disponible.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-0 pt-16">
      {/* ── Left Side — Hero Panel ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary via-primary/95 to-primary/80 relative overflow-hidden flex-col justify-between p-12"
      >
        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '56px 56px'
          }} />
        </div>

        {/* Top content */}
        <div className="relative z-10 space-y-8">
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center"
          >
            <Car size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold text-white leading-tight font-serif">
              Bienvenue sur <span className="text-gold">Vectoria</span>
            </h1>
            <p className="text-lg text-white/80 font-light leading-relaxed">
              Votre destination premium pour la location de voitures de luxe au Maroc.
            </p>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 pt-6"
          >
            {[
              { icon: Crown, label: "Flotte de véhicules premium" },
              { icon: Shield, label: "Paiement sécurisé & confidentiel" },
              { icon: Star, label: "Service client 24h/24" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-white/90">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-6 relative z-10 pt-12 border-t border-white/20"
        >
          {[
            { value: "15K+", label: "Véhicules" },
            { value: "50+", label: "Destinations" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-white/60 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right Side — Login Form ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[55%] flex items-center justify-center px-6 lg:px-12 py-12"
      >
        <div className="w-full max-w-md">

          {/* Branding (Mobile only) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:hidden text-center mb-10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Car size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-normal text-ink-1 font-display italic mb-1">Vectoria</h1>
            <p className="text-ink-3 text-sm font-medium">Premium Car Rental</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="premium-glass rounded-2xl shadow-2xl p-10 lg:p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-ink-1 mb-1">Connexion</h2>
              <p className="text-ink-3 text-sm">Connectez-vous pour continuer</p>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Mail size={14} className="text-gold" /> Email
                </label>
                <div className={`relative transition-all ${focusedField === 'email' ? 'ring-2 ring-gold/20 rounded-xl' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="votre@email.com"
                    required
                    autoComplete="email"
                    className="input-premium w-full pl-11 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                    <Lock size={14} className="text-gold" /> Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => notifyInfo("Fonctionnalité de récupération en cours de développement.")}
                    className="text-xs text-gold hover:text-gold/80 font-semibold transition-colors"
                  >
                    Oublié ?
                  </button>
                </div>
                <div className={`relative transition-all ${focusedField === 'password' ? 'ring-2 ring-gold/20 rounded-xl' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="input-premium w-full pl-11 pr-11 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 hover:text-gold transition-colors focus:outline-none"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-gold border-gold'
                      : 'border-border hover:border-ink-3'
                  }`}
                >
                  {rememberMe && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-ink-3 select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                  Se souvenir de moi
                </span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 font-bold rounded-xl mt-1 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Se connecter
                    <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Book without account */}
            <Link
              href="/booking"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-gradient-to-r from-gold to-gold/80 text-ink-1 font-bold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all"
            >
              <KeyRound size={16} />
              Réserver sans compte
              <ArrowRight size={16} />
            </Link>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-ink-4 font-medium">Connexion démo rapide</span>
              </div>
            </div>

            {/* Demo Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Admin", role: "admin", icon: Shield, color: "text-violet-600", bg: "bg-violet-50 border-violet-200 hover:bg-violet-100" },
                { label: "Agent", role: "agent", icon: Car, color: "text-sky-600", bg: "bg-sky-50 border-sky-200 hover:bg-sky-100" },
                { label: "Client", role: "client", icon: Mail, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
              ].map((demo) => (
                <motion.button
                  key={demo.role}
                  type="button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => demoLogin(demo.role)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all disabled:opacity-50 ${demo.bg}`}
                >
                  <demo.icon size={18} className={demo.color} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${demo.color}`}>{demo.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-ink-3 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-bold text-gold hover:text-gold/80 transition-colors">
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
