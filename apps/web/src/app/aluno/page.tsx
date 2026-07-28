'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, MessageCircle, GraduationCap, Wrench, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 19) return 'Boa tarde';
  return 'Boa noite';
}

export default function AlunoHomePage() {
  const { token, user } = useAuth();
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    api('/users/me/enrollments', { token }).then((e) => setCourseCount(e.length)).catch(() => {});
  }, [token]);

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1512] via-[#241a12] to-black text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-brand-orange/10 blur-2xl" />
        <div className="relative space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
            {getGreeting()}, <span className="text-brand-orange">{firstName}</span> 👋
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            APRENDE.<br />
            EVOLUI.<br />
            TRANSFORMA.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-medium">
              <GraduationCap size={14} /> Infinitus Digital
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Acesso ativo · {courseCount} curso{courseCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-black/10 shadow-sm">
        <Search size={16} className="text-black/40 shrink-0" />
        <input
          placeholder="Buscar aulas, cursos, ferramentas..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-black/40"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-3">O que queres fazer agora?</p>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/aluno/conversas"
            className="rounded-2xl p-5 bg-gradient-to-br from-orange-900/90 to-orange-950 text-white space-y-6 hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={22} />
            <div>
              <p className="font-semibold">Entrar no chat</p>
              <p className="text-xs text-white/60 mt-0.5">Conversa com os membros</p>
            </div>
          </Link>
          <Link
            href="/aluno/aulas"
            className="rounded-2xl p-5 bg-gradient-to-br from-blue-900 to-slate-950 text-white space-y-6 hover:opacity-90 transition-opacity"
          >
            <GraduationCap size={22} />
            <div>
              <p className="font-semibold">Ver cursos</p>
              <p className="text-xs text-white/60 mt-0.5">Acede às tuas aulas</p>
            </div>
          </Link>
          <Link
            href="/aluno/ferramentas"
            className="rounded-2xl p-5 bg-gradient-to-br from-purple-950 to-black text-white space-y-6 hover:opacity-90 transition-opacity"
          >
            <Wrench size={22} />
            <div>
              <p className="font-semibold">Ferramentas</p>
              <p className="text-xs text-white/60 mt-0.5">Recursos digitais</p>
            </div>
          </Link>
          <Link
            href="/aluno/certificados"
            className="rounded-2xl p-5 bg-gradient-to-br from-emerald-950 to-black text-white space-y-6 hover:opacity-90 transition-opacity"
          >
            <Award size={22} />
            <div>
              <p className="font-semibold">Certificados</p>
              <p className="text-xs text-white/60 mt-0.5">Os teus diplomas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
