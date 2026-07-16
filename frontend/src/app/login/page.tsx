'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Shield, Car, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects ou serveur injoignable.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      const u = await login(`${role}@vectoria.com`, 'password123');
      const r = u?.role;
      if (r === "admin") router.push("/admin");
      else if (r === "agent") router.push("/agent");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || `Compte démo ${role} non disponible.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px] mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25 border border-white/10">
            <Car size={26} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vectoria</h1>
          <p className="text-white/40 text-sm mt-1 font-medium">Premium Car Rental</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-8 shadow-2xl"
        >
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Bienvenue</h2>
            <p className="text-white/40 text-sm">Connectez-vous pour continuer</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
              <div className={`relative group ${focusedField === 'email' ? 'ring-2 ring-primary/30' : ''} rounded-xl transition-all`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                  className="w-full h-12 pl-12 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/25 text-sm font-medium outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => notifyInfo("Fonctionnalité de récupération en cours de développement.")}
                  className="text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                >
                  Oublié ?
                </button>
              </div>
              <div className={`relative group ${focusedField === 'password' ? 'ring-2 ring-primary/30' : ''} rounded-xl transition-all`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 pl-12 pr-12 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/25 text-sm font-medium outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-primary border-primary'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-white/40 select-none">Se souvenir de moi</span>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Sparkles size={12} className="text-gold/60" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Connexion démo rapide</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Admin", role: "admin", icon: Shield, bg: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20", text: "text-violet-400" },
                { label: "Agent", role: "agent", icon: Car, bg: "bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20", text: "text-sky-400" },
                { label: "Client", role: "client", icon: Mail, bg: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20", text: "text-emerald-400" },
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
                  <demo.icon size={18} className={demo.text} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${demo.text}`}>{demo.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Register */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-white/30 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
