'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Shield, UserCog, Car, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';
import { authService } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Identifiants incorrects ou serveur injoignable.');
        setLoading(false);
      } else {
        // Rediriger vers un routeur de redirection ou le dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('Une erreur inattendue est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo / Branding */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <Car size={32} strokeWidth={2} />
          </div>
          <h1 className={styles.logoText}>Vectoria</h1>
          <p className={styles.tagline}>Premium Car Rental ERP</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className={styles.form}>
          <h2 className={styles.title}>Connexion</h2>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={14} /> Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vectoria.com"
              required
              autoComplete="email"
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
              autoComplete="current-password"
              className={styles.input}
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <span className={styles.spinner}>
                <Loader2 size={18} className={styles.spinIcon} />
                Connexion en cours...
              </span>
            ) : (
              <span className={styles.spinner}>
                <LogIn size={18} />
                Se connecter
              </span>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Pas encore de compte ?{' '}
            <a href="/register" className="text-primary hover:underline font-semibold">
              S'inscrire
            </a>
          </p>
        </form>

        {/* Aide rapide */}
        <div className={styles.hints}>
          <p className={styles.hintTitle}>Comptes de démonstration :</p>
          <button
            className={styles.hintBtn}
            onClick={() => { setEmail('admin@vectoria.com'); setPassword('Admin2026!'); }}
          >
            <Shield size={14} /> Admin
          </button>
          <button
            className={styles.hintBtn}
            onClick={() => { setEmail('agent@vectoria.com'); setPassword('Agent2026!'); }}
          >
            <UserCog size={14} /> Agent
          </button>
        </div>
      </div>
    </div>
  );
}
