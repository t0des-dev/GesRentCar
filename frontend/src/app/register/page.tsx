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
import { useTranslation } from "@/shared/hooks/useTranslation";

function getPasswordStrength(password: string, t: (k: string) => string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: t('register_strength_weak'), color: 'bg-red-500' };
  if (score <= 2) return { score, label: t('register_strength_medium'), color: 'bg-orange-500' };
  if (score <= 3) return { score, label: t('register_strength_good'), color: 'bg-amber-500' };
  if (score <= 4) return { score, label: t('register_strength_strong'), color: 'bg-emerald-500' };
  return { score, label: t('register_strength_excellent'), color: 'bg-emerald-600' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useTranslation();
  
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

  const passwordStrength = useMemo(() => getPasswordStrength(password, t), [password, t]);
  const passwordsMatch = password.length > 0 && password === passwordConf;
  const passwordsMismatch = passwordConf.length > 0 && password !== passwordConf;

  const passwordRequirements = [
    { met: password.length >= 8, label: t('register_req_length') },
    { met: /[A-Z]/.test(password), label: t('register_req_uppercase') },
    { met: /[0-9]/.test(password), label: t('register_req_number') },
    { met: /[^A-Za-z0-9]/.test(password), label: t('register_req_special') },
  ];

  const canSubmit = name && email && password && passwordConf && acceptedTerms && !loading;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!name || !email || !password || !passwordConf) {
      setError(t('validation_name_required'));
      return;
    }
    if (password !== passwordConf) {
      setError(t('profile_password_mismatch'));
      return;
    }
    if (!acceptedTerms) {
      setError(t('register_accept_terms') + ' ' + t('register_terms_link'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password, passwordConf);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
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
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-2">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{t("register_hero_badge")}</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight font-serif">
              {t("register_hero_title")} <span className="text-gold">{t("register_hero_title_accent")}</span>
            </h1>
            <p className="text-lg text-white/85 font-light leading-relaxed">
              {t("register_hero_subtitle")}
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
              { icon: Zap, label: t("quick_booking") },
              { icon: Crown, label: t("feat_fleet_title") },
              { icon: Shield, label: t("safety") }
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
            { value: "15K+", label: t("stat_clients") },
            { value: "50+", label: t("nav_locations") },
            { value: "98%", label: t("about_stat_satisfaction_label") }
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
              <h2 className="text-2xl font-bold text-ink-1 mb-2">{t("register_title")}</h2>
              <p className="text-ink-3 text-sm">{t("register_subtitle")}</p>
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
                  <User size={14} className="text-gold" /> {t("register_name_label")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("register_name_placeholder")}
                  required
                  autoComplete="name"
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Mail size={14} className="text-gold" /> {t("register_email_label")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("register_email_placeholder")}
                  required
                  autoComplete="email"
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Lock size={14} className="text-gold" /> {t("register_password_label")}
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                  <Lock size={14} className="text-gold" /> {t("register_confirm_password_label")}
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
                    aria-label={showPasswordConf ? "Hide password" : "Show password"}
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
                        <span>{t("profile_password_success")}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} />
                        <span>{t("profile_password_mismatch")}</span>
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
                  {t("register_accept_terms")}{' '}
                  <Link href="/terms" className="text-gold hover:underline font-medium" target="_blank">
                    {t("register_terms_link")}
                  </Link>
                  {' '}&{' '}
                  <Link href="/privacy" className="text-gold hover:underline font-medium" target="_blank">
                    {t("footer_privacy")}
                  </Link>
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
                    {t("register_loading")}
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    {t("register_submit")}
                    <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-ink-3 text-sm">
                {t("register_already_account")}{' '}
                <Link href="/login" className="font-bold text-gold hover:text-gold/80 transition-colors">
                  {t("register_login_link")}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
