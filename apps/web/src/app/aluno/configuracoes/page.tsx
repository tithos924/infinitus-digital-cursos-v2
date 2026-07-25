'use client';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

export default function Page() {
  const { user, token, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);

  useEffect(() => {
    api('/auth/admin-exists').then((r) => setAdminExists(r.exists)).catch(() => setAdminExists(true));
  }, []);

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
      <div className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-3">
        <div>
          <p className="text-xs text-black/40">Nome</p>
          <p className="text-sm font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-black/40">Email</p>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 bg-white border border-black/10 text-black/70 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-light transition-colors"
      >
        <LogOut size={16} /> Sair da conta
      </button>

      {user?.role !== 'ADMIN' && !adminExists && (
        <div className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-3">
          <p className="text-sm font-medium">Tornar-me Administrador</p>
          <p className="text-xs text-black/50">
            Usa isto uma única vez para ativares a tua conta como administrador da plataforma.
          </p>
          <button
            onClick={promote}
            disabled={loading}
            className="bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'A processar...' : 'Tornar-me Administrador'}
          </button>
          {message && <p className="text-xs text-black/60">{message}</p>}
        </div>
      )}
    </div>
  );
}
