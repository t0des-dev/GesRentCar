'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Shield, CreditCard, Bell, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils';
import api from '@/shared/services/client';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Components
import SettingsTabs from './settings/SettingsTabs';
import { ProfileSettings, SecuritySettings } from './settings/AccountSections';
import { PaymentSettings, NotificationSettings, AuditLogSettings } from './settings/SystemSections';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const storedUser = localStorage.getItem('vectoria_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfileForm({ name: parsed.name, email: parsed.email });
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.put('/user/profile', profileForm);
      localStorage.setItem('vectoria_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMessage({ type: 'error', text: msg || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/user/password', passwordForm);
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMessage({ type: 'error', text: msg || 'Erreur lors de la modification.' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Mon Profil', icon: UserIcon },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'audit', label: "Journal d'Audit", icon: RefreshCw },
  ];

  return (
    <div className='flex flex-col lg:flex-row gap-12'>
      <SettingsTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='flex-1 max-w-3xl'>
        <AnimatePresence mode='wait'>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={cn('mb-8 p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm', message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700')}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className='bg-white rounded-[40px] border border-slate-200/60 shadow-sm p-10'>
          {activeTab === 'profile' && <ProfileSettings form={profileForm} setForm={setProfileForm} onSubmit={handleUpdateProfile} loading={loading} />}
          {activeTab === 'security' && <SecuritySettings form={passwordForm} setForm={setPasswordForm} onSubmit={handleUpdatePassword} loading={loading} />}
          {activeTab === 'payments' && <PaymentSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'audit' && <AuditLogSettings />}
        </div>
      </div>
    </div>
  );
}
