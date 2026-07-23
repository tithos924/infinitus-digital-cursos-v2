'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl2 shadow-sm border border-black/5 p-8">
        <h1 className="text-2xl font-semibold text-center">Criar conta</h1>
        <p className="text-sm text-black/50 text-center mt-1">Junta-te à Infinitus Digital Cursos</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            required
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-brand-orange text-white rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'A criar conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-center text-black/50 mt-6">
          Já tens conta?{' '}
          <Link href="/login" className="text-brand-orange font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
