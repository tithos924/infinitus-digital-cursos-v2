'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GraduationCap, FileBadge, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const items = [
  { href: '/aluno', label: 'Meus Cursos', icon: GraduationCap },
  { href: '/aluno/certificados', label: 'Certificados', icon: FileBadge },
  { href: '/aluno/configuracoes', label: 'Configurações', icon: Settings },
];

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    else if (!loading && user && user.role !== 'STUDENT') router.push('/dashboard');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-black/40">A carregar...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-black/5 bg-white sticky top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Infinitus Digital Cursos" className="h-7 w-7 object-contain" />
          <span className="font-semibold text-sm hidden sm:inline">Infinitus Digital Cursos</span>
        </div>
        <nav className="flex items-center gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors',
                  active ? 'bg-brand-orange/10 text-brand-orange' : 'text-black/60 hover:bg-brand-light',
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs md:text-sm font-medium text-black/60 hover:bg-brand-light"
          >
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        </nav>
      </header>
      <main className="p-4 md:p-8 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
