'use client';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';

export default function Page() {
  const { user, token, logout, refreshUser } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    api('/auth/admin-exists').then((r) => setAdminExists(r.exists)).catch(() => setAdminExists(true));
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setProfileMessage('');
    try {
      await api('/users/me', { method: 'PATCH', token, body: JSON.stringify({ name, bio, avatarUrl }) });
      await refreshUser();
      setProfileMessage('Perfil atualizado.');
    } catch (err: any) {
      setProfileMessage(err.message || 'Não foi possível guardar o perfil.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function promote() {
    if (!token) return;
    setLoading(true);
    setMessage('');
    try {
      await api('/auth/promote-first-admin', { method: 'POST', token });
      setMessage('Pronto! Agora és administrador — sai e entra outra vez para veres o dashboard.');
      setAdminExists(true);
    } catch (err: any) {
      setMessage(err.message || 'Não foi possível tornar-te administrador.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold">Configurações</h1>

      <form onSubmit={saveProfile} className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
        <p className="text-sm font-medium">O teu perfil</p>
        <ImageUploader label="Foto de perfil" value={avatarUrl} onChange={setAvatarUrl} />
        <div>
          <label className="text-xs text-black/40 dark:text-white/40">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40 mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-black/40 dark:text-white/40">Email</label>
          <p className="text-sm font-medium py-3">{user?.email}</p>
        </div>
        <div>
          <label className="text-xs text-black/40 dark:text-white/40">Biografia</label>
          <textarea
            rows={3}
            placeholder="Fala um pouco sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40 mt-1"
          />
        </div>
        <button
          disabled={savingProfile}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-transform disabled:opacity-60"
        >
          {savingProfile ? 'A guardar...' : 'Guardar perfil'}
        </button>
        {profileMessage && <p className="text-xs text-black/60 dark:text-white/60">{profileMessage}</p>}
      </form>

      <button
        onClick={logout}
        className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-light dark:hover:bg-white/10 dark:bg-white/5 transition-colors"
      >
        <LogOut size={16} /> Sair da conta
      </button>

      {user?.role !== 'ADMIN' && !adminExists && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-3">
          <p className="text-sm font-medium">Tornar-me Administrador</p>
          <p className="text-xs text-black/50 dark:text-white/50">
            Usa isto uma única vez para ativares a tua conta como administrador da plataforma.
          </p>
          <button
            onClick={promote}
            disabled={loading}
            className="bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading ? 'A processar...' : 'Tornar-me Administrador'}
          </button>
          {message && <p className="text-xs text-black/60 dark:text-white/60">{message}</p>}
        </div>
      )}
    </div>
  );
}
