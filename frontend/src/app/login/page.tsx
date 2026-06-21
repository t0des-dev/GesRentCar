'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Shield, Car, AlertCircle, Loader2, Eye, EyeOff, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/context';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirection automatique des utilisateurs connectés
  useEffect(() => {
    if (!authLoading && user) {
      const role = user.role || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vectoria_user") || "{}").role : null);
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
      const role = u?.role || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vectoria_user") || "{}").role : null);
      if (role === "admin") router.push("/admin");
      else if (role === "agent") router.push("/agent");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects ou serveur injoignable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-0">
      {/* Left Side — Hero Section (with sliding gradient animation) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-primary/80 bg-[length:200%_200%] animate-gradient-shift relative overflow-hidden flex-col justify-between p-12"
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
            <h1 className="text-4xl font-normal text-ink-1 font-display italic mb-1">Vectoria</h1>
            <p className="text-ink-3 text-sm font-medium">Premium Car Rental</p>
          </motion.div>

          {/* Form Card (with premium Glassmorphism look) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="premium-glass rounded-2xl shadow-2xl p-10 lg:p-8 space-y-6 focus-within:border-gold/50 transition-all duration-300"
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
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                    <Lock size={14} className="text-gold" /> Mot de passe
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      alert("Fonctionnalité de récupération en cours de développement. Veuillez utiliser les comptes de démonstration pour le test."); 
                    }} 
                    className="text-xs font-semibold text-gold hover:text-gold-dark hover:underline transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="input-premium w-full pr-10 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-gold transition-colors focus:outline-none"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-gold focus:ring-gold/50 cursor-pointer w-4 h-4"
                />
                <label htmlFor="remember" className="text-xs font-medium text-ink-3 select-none cursor-pointer">
                  Se souvenir de moi
                </label>
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

            {/* Quick Demo Login */}
            <div className="pt-5 border-t border-border space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                <Sparkles size={14} className="text-gold animate-pulse" />
                Connexion rapide (Démo)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Admin', email: 'admin@vectoria.com', password: 'Admin2026!', color: 'border-amber-500/30 hover:border-amber-500 text-amber-600 hover:bg-amber-50/50 focus:ring-amber-500/20' },
                  { role: 'Agent', email: 'agent@vectoria.com', password: 'Agent2026!', color: 'border-blue-500/30 hover:border-blue-500 text-blue-600 hover:bg-blue-50/50 focus:ring-blue-500/20' },
                  { role: 'Client', email: 'client@vectoria.com', password: 'Client2026!', color: 'border-emerald-500/30 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-50/50 focus:ring-emerald-500/20' }
                ].map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 focus:ring-2 focus:outline-none cursor-pointer ${account.color}`}
                  >
                    <UserCheck size={14} />
                    <span>{account.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-ink-3 text-sm">
                Pas encore de compte ?{' '}
                <a href="/register" className="font-bold text-gold hover:text-gold-dark transition-colors">
                  S'inscrire
                </a>
              </p>
            </div>
          </motion.div>

          {/* Demo Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-ink-4">
              Sélectionnez un rôle ci-dessus pour pré-remplir automatiquement les identifiants de test.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

