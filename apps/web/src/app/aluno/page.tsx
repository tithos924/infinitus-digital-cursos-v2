'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Enrollment = {
  id: string;
  progressPct: number;
  course: {
    id: string;
    title: string;
    description?: string | null;
    coverImageUrl?: string | null;
  };
};

export default function AlunoHomePage() {
  const { token, user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificatesCount, setCertificatesCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    api('/users/me/enrollments', { token }).then(setEnrollments).catch(() => {});
    api('/users/me/certificates', { token }).then((c) => setCertificatesCount(c.length)).catch(() => {});
  }, [token]);

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPct, 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Olá, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-black/50 dark:text-white/50 mt-1">O teu resumo na plataforma</p>
      </div>

      <div className="rounded-xl2 overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/banner.png" alt="Infinitus Digital" className="w-full h-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Cursos ativos" value={enrollments.length} icon={BookOpen} />
        <StatCard label="Progresso médio" value={`${avgProgress}%`} icon={TrendingUp} />
        <StatCard label="Certificados" value={certificatesCount} icon={Award} />
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Os teus cursos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {enrollments.map((e) => (
            <Link
              key={e.id}
              href={`/aluno/cursos/${e.course.id}`}
              className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-brand-orange/10 flex items-center justify-center text-brand-orange text-3xl font-semibold overflow-hidden">
                {e.course.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.course.coverImageUrl} alt={e.course.title} className="w-full h-full object-cover" />
                ) : (
                  e.course.title[0]?.toUpperCase()
                )}
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-medium">{e.course.title}</h3>
                <div className="w-full bg-brand-light dark:bg-white/5 rounded-full h-1.5">
                  <div className="bg-brand-orange h-1.5 rounded-full" style={{ width: `${e.progressPct}%` }} />
                </div>
                <p className="text-xs text-black/40 dark:text-white/40">{e.progressPct}% concluído</p>
              </div>
            </Link>
          ))}
        </div>

        {enrollments.length === 0 && (
          <p className="text-center text-black/40 dark:text-white/40 text-sm py-16">
            Ainda não tens acesso a nenhum curso. Fala com o administrador da plataforma.
          </p>
        )}
      </div>
    </div>
  );
}
