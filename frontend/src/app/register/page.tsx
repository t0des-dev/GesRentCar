'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, UserPlus, Car, AlertCircle, Loader2, User, CheckCircle,
  Eye, EyeOff, Shield, Zap, Crown, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/modules/auth/context/context';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Faible', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Moyen', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Bon', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Fort', color: 'bg-emerald-500' };
  return { score, label: 'Excellent', color: 'bg-emerald-600' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password.length > 0 && password === passwordConf;
  const passwordsMismatch = passwordConf.length > 0 && password !== passwordConf;

  const passwordRequirements = [
    { met: password.length >= 8, label: '8 caractères minimum' },
    { met: /[A-Z]/.test(password), label: 'Une majuscule' },
    { met: /[0-9]/.test(password), label: 'Un chiffre' },
    { met: /[^A-Za-z0-9]/.test(password), label: 'Un caractère spécial' },
  ];

  const canSubmit = name && email && password && passwordConf && acceptedTerms && !loading;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!name || !email || !password || !passwordConf) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== passwordConf) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptedTerms) {
      setError('Veuillez accepter les conditions d\'utilisation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password, passwordConf);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-0 pt-16">
      {/* Left Side — Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary via-primary/95 to-primary/80 relative overflow-hidden flex-col justify-between p-12"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
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
              Rejoignez <span className="text-gold">Vectoria</span>
            </h1>
            <p className="text-lg text-white/85 font-light leading-relaxed">
              Créez votre compte et explorez les meilleures voitures de luxe du monde.
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 pt-6"
          >
            {[
              { icon: Zap, label: "Inscription en 30 secondes" },
              { icon: Crown, label: "Accès à la flotte premium" },
              { icon: Shield, label: "Sécurité & confidentialité" }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <benefit.icon size={20} />
                </div>
                <span className="font-medium text-white/90">{benefit.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-6 relative z-10 pt-12 border-t border-white/20"
        >
          {[
            { value: "15K+", label: "Véhicules" },
            { value: "50+", label: "Destinations" },
            { value: "98%", label: "Satisfaction" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-white/60 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side — Register Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[55%] flex items-center justify-center px-6 lg:px-12 py-12"
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

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="premium-glass rounded-2xl shadow-2xl p-10 lg:p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-ink-1 mb-2">Créer un compte</h2>
              <p className="text-ink-3 text-sm">Rejoignez l'aventure Vectoria</p>
            </div>

            {/* Error Alert */}
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
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <User size={14} className="text-gold" /> Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  autoComplete="name"
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.score ? passwordStrength.color : 'bg-surface-2'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-semibold ml-2 ${
                        passwordStrength.score <= 1 ? 'text-red-500' :
                        passwordStrength.score <= 2 ? 'text-orange-500' :
                        passwordStrength.score <= 3 ? 'text-amber-500' :
                        'text-emerald-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            req.met ? 'bg-emerald-500' : 'bg-surface-3'
                          }`} />
                          <span className={req.met ? 'text-emerald-600' : 'text-ink-4'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password_conf" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Lock size={14} className="text-gold" /> Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password_conf"
                    type={showPasswordConf ? "text" : "password"}
                    value={passwordConf}
                    onChange={(e) => setPasswordConf(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className={`input-premium w-full pr-10 focus:ring-2 transition-colors ${
                      passwordsMatch ? 'focus:border-emerald-500 focus:ring-emerald-500/20' :
                      passwordsMismatch ? 'focus:border-red-500 focus:ring-red-500/20' :
                      'focus:border-gold focus:ring-gold/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConf(!showPasswordConf)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-gold transition-colors focus:outline-none"
                    aria-label={showPasswordConf ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPasswordConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {passwordConf.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      passwordsMatch ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Les mots de passe correspondent</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} />
                        <span>Les mots de passe ne correspondent pas</span>
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-gold focus:ring-gold/50 cursor-pointer w-4 h-4"
                />
                <label htmlFor="terms" className="text-xs text-ink-3 leading-relaxed cursor-pointer">
                  J'accepte les{' '}
                  <a href="/terms" className="text-gold hover:underline font-medium" target="_blank">
                    conditions d'utilisation
                  </a>
                  {' '}et la{' '}
                  <a href="/privacy" className="text-gold hover:underline font-medium" target="_blank">
                    politique de confidentialité
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { y: -2 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className={`w-full py-3.5 font-bold rounded-xl mt-2 transition-all flex items-center justify-center gap-2 ${
                  canSubmit
                    ? 'bg-gradient-to-r from-gold to-gold/90 text-ink-1 hover:shadow-lg hover:shadow-gold/30'
                    : 'bg-surface-2 text-ink-4 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    S'inscrire
                    <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-ink-4">ou</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2.5 px-4 border-2 border-border rounded-xl text-sm font-medium text-ink-2 hover:border-ink-3 hover:bg-surface-1 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="py-2.5 px-4 border-2 border-border rounded-xl text-sm font-medium text-ink-2 hover:border-ink-3 hover:bg-surface-1 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-ink-3 text-sm">
                Déjà un compte ?{' '}
                <Link href="/login" className="font-bold text-gold hover:text-gold/80 transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
