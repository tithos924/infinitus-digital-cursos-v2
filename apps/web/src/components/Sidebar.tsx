'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  GraduationCap,
  Clapperboard,
  FileBadge,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/courses', label: 'Meus Cursos', icon: BookOpen },
  { href: '/dashboard/students', label: 'Alunos', icon: GraduationCap },
  { href: '/dashboard/lessons', label: 'Aulas', icon: Clapperboard },
  { href: '/dashboard/certificates', label: 'Certificados', icon: FileBadge },
  { href: '/dashboard/sales', label: 'Vendas', icon: Wallet },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}
      <aside
        className={clsx(
          'w-64 shrink-0 border-r border-black/5 bg-white h-screen flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:sticky lg:top-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-6 py-7">
          <span className="text-xl font-semibold tracking-tight">
            Infinit<span className="text-brand-orange">∞</span>s
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-black/60 hover:bg-brand-light hover:text-black',
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-black/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-black/60 hover:bg-brand-light hover:text-black transition-colors"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
