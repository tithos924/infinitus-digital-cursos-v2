'use client';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar() {
  const { user } = useAuth();
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-2 bg-brand-light rounded-full px-4 py-2 w-80">
        <Search size={16} className="text-black/40" />
        <input
          placeholder="Pesquisar..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-black/40"
        />
      </div>
      <div className="flex items-center gap-5">
        <button className="relative text-black/50 hover:text-black transition-colors">
          <Bell size={20} strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm font-medium">{user?.name ?? '...'}</span>
        </div>
      </div>
    </header>
  );
}
