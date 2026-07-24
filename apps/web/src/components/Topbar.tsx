'use client';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  return (
    <header className="h-16 flex items-center justify-between gap-3 px-4 md:px-8 border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 text-black/60 hover:text-black transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-brand-light rounded-full px-4 py-2 w-full max-w-xs md:max-w-sm">
          <Search size={16} className="text-black/40 shrink-0" />
          <input
            placeholder="Pesquisar..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-black/40"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-5 shrink-0">
        <button className="relative text-black/50 hover:text-black transition-colors">
          <Bell size={20} strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange text-sm font-semibold shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="hidden md:inline text-sm font-medium">{user?.name ?? '...'}</span>
        </div>
      </div>
    </header>
  );
}
