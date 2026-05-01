'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserPlus, Car, AlertCircle, Loader2, User } from 'lucide-react';
import styles from '../login/page.module.css'; // Reusing login styles for consistency
import { authService } from '@/lib/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const { user } = await authService.register({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConf 
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <Car size={32} strokeWidth={2} />
          </div>
          <h1 className={styles.logoText}>Vectoria</h1>
          <p className={styles.tagline}>Premium Car Rental ERP</p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <h2 className={styles.title}>Inscription</h2>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              <User size={14} /> Nom Complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={14} /> Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@example.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={14} /> Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password_conf" className={styles.label}>
              <Lock size={14} /> Confirmer le mot de passe
            </label>
            <input
              id="password_conf"
              type="password"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <span className={styles.spinner}>
                <Loader2 size={18} className={styles.spinIcon} />
                Création en cours...
              </span>
            ) : (
              <span className={styles.spinner}>
                <UserPlus size={18} />
                S'inscrire
              </span>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Déjà un compte ?{' '}
            <a href="/login" className="text-primary hover:underline font-semibold">
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
