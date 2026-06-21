'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserPlus, Car, AlertCircle, Loader2, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/context';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConf) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, passwordConf);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
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
            className="space-y-3 pt-6"
          >
            {[
              { icon: CheckCircle, label: "Inscription simple et rapide" },
              { icon: Car, label: "Accès à la flotte premium" },
              { icon: Mail, label: "Support client dédié" }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <benefit.icon size={18} />
                </div>
                <span className="font-medium">{benefit.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 pt-12 border-t border-white/20"
        >
          <p className="text-white/80 italic font-light text-sm leading-relaxed">
            "Chez Vectoria, chaque jour est une nouvelle aventure. Nous mettions la luxe à votre portée."
          </p>
        </motion.div>
      </motion.div>

      {/* Right Side — Register Form */}
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
            className="bg-white rounded-2xl shadow-xl shadow-primary/10 border-2 border-border p-10 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-ink-1 mb-2">Inscription</h2>
              <p className="text-ink-3 text-sm">Créez votre compte Vectoria en quelques étapes</p>
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
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <User size={14} className="text-gold" /> Nom Complet
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
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
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password_conf" className="flex items-center gap-1.5 text-xs font-bold text-ink-3 uppercase tracking-wider">
                  <Lock size={14} className="text-gold" /> Confirmer
                </label>
                <input
                  id="password_conf"
                  type="password"
                  value={passwordConf}
                  onChange={(e) => setPasswordConf(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-premium focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold rounded-lg mt-4 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  </>
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-ink-3 text-sm">
                Déjà un compte ?{' '}
                <a href="/login" className="font-bold text-gold hover:text-gold/90 transition-colors">
                  Se connecter
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
