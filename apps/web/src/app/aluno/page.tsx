'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!token) return;
    api('/users/me/enrollments', { token }).then(setEnrollments).catch(() => {});
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Olá, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-black/50 mt-1">Os teus cursos disponíveis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {enrollments.map((e) => (
          <Link
            key={e.id}
            href={`/aluno/cursos/${e.course.id}`}
            className="bg-white rounded-xl2 border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
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
              <div className="w-full bg-brand-light rounded-full h-1.5">
                <div
                  className="bg-brand-orange h-1.5 rounded-full"
                  style={{ width: `${e.progressPct}%` }}
                />
              </div>
              <p className="text-xs text-black/40">{e.progressPct}% concluído</p>
            </div>
          </Link>
        ))}
      </div>

      {enrollments.length === 0 && (
        <p className="text-center text-black/40 text-sm py-16">
          Ainda não tens acesso a nenhum curso. Fala com o administrador da plataforma.
        </p>
      )}
    </div>
  );
}
