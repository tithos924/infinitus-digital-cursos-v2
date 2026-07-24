'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Users, Layers } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Course = {
  id: string;
  title: string;
  status: string;
  coverImageUrl?: string | null;
  _count: { enrollments: number; modules: number };
};

export default function CoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  function loadCourses() {
    if (!token) return;
    api('/courses', { token }).then(setCourses).catch(() => {});
  }

  useEffect(loadCourses, [token]);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api('/courses', {
        method: 'POST',
        token,
        body: JSON.stringify({ title, description, coverImageUrl, price: Number(price) || 0 }),
      });
      setTitle('');
      setDescription('');
      setCoverImageUrl('');
      setPrice('');
      setShowForm(false);
      loadCourses();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meus Cursos</h1>
          <p className="text-sm text-black/50 mt-1">Gere e cria os teus cursos</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Novo curso
        </button>
      </div>

      {showForm && (
        <form onSubmit={createCourse} className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-4">
          <input
            required
            placeholder="Título do curso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            placeholder="URL da imagem de capa (ex: link do Cloudinary, Imgur, etc.)"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            type="number"
            placeholder="Preço (Kz)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button
            disabled={saving}
            className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-orange transition-colors disabled:opacity-60"
          >
            {saving ? 'A guardar...' : 'Criar curso'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courses.map((c) => (
          <div key={c.id} className="bg-white rounded-xl2 border border-black/5 shadow-sm overflow-hidden">
            <div className="h-32 bg-brand-orange/10 flex items-center justify-center text-brand-orange text-3xl font-semibold overflow-hidden">
              {c.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.coverImageUrl} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                c.title[0]?.toUpperCase()
              )}
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-medium">{c.title}</h3>
              <div className="flex items-center gap-4 text-xs text-black/50">
                <span className="flex items-center gap-1">
                  <Layers size={14} /> {c._count?.modules ?? 0} módulos
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {c._count?.enrollments ?? 0} alunos
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/dashboard/courses/${c.id}`}
                  className="flex-1 text-center text-xs font-medium border border-black/10 rounded-full py-2 hover:bg-brand-light"
                >
                  Editar
                </Link>
                <Link
                  href={`/dashboard/courses/${c.id}`}
                  className="flex-1 text-center text-xs font-medium border border-black/10 rounded-full py-2 hover:bg-brand-light"
                >
                  Gerir
                </Link>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && !showForm && (
          <p className="text-black/40 text-sm col-span-3 text-center py-12">
            Ainda não tens cursos. Cria o primeiro clicando em "Novo curso".
          </p>
        )}
      </div>
    </div>
  );
}
