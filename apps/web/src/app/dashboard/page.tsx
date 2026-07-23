'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Users, ShoppingCart, Wallet } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Stats = { coursesPublished: number; students: number; salesCount: number; revenue: number };
type Course = { id: string; title: string; status: string; createdAt: string; _count: { enrollments: number } };

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!token) return;
    api('/courses/dashboard/stats', { token }).then(setStats).catch(() => {});
    api('/courses', { token }).then((data) => setCourses(data.slice(0, 5))).catch(() => {});
  }, [token]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-black/50 mt-1">Resumo da tua plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard label="Cursos Publicados" value={stats?.coursesPublished ?? '—'} icon={BookOpen} />
        <StatCard label="Alunos" value={stats?.students ?? '—'} icon={Users} />
        <StatCard label="Vendas" value={stats?.salesCount ?? '—'} icon={ShoppingCart} />
        <StatCard label="Receita" value={stats ? `${stats.revenue.toLocaleString('pt-AO')} Kz` : '—'} icon={Wallet} />
      </div>

      <div className="bg-white rounded-xl2 border border-black/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5">
          <h2 className="font-medium">Últimos cursos</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black/40 border-b border-black/5">
              <th className="px-6 py-3 font-medium">Título</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium">Alunos</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-black/40">
                  Ainda não tens cursos criados.
                </td>
              </tr>
            )}
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="px-6 py-3.5 font-medium">{c.title}</td>
                <td className="px-6 py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-brand-orange/10 text-brand-orange">
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">{c._count?.enrollments ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
