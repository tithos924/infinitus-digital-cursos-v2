'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { user } = useAuth();
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
    </div>
  );
}
