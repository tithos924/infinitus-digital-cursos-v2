'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MessageCircle, Wrench, User } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { href: '/aluno', label: 'Início', icon: Home },
  { href: '/aluno/aulas', label: 'Aulas', icon: BookOpen },
  { href: '/aluno/conversas', label: 'Conversas', icon: MessageCircle },
  { href: '/aluno/ferramentas', label: 'Ferramentas', icon: Wrench },
  { href: '/aluno/configuracoes', label: 'Perfil', icon: User },
];

export function AlunoBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-[#12100e] border-t border-white/10 flex items-center justify-around py-2 lg:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium',
              active ? 'text-brand-orange' : 'text-white/50',
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
