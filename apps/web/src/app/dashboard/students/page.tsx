'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Course = { id: string; title: string };
type Student = {
  id: string;
  name: string;
  email: string;
  enrollments: { course: Course }[];
};

export default function StudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function reload() {
    if (!token) return;
    api('/admin/students', { token }).then(setStudents).catch(() => {});
    api('/courses', { token }).then(setCourses).catch(() => {});
  }

  useEffect(reload, [token]);

  async function createStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError('');
    setSaving(true);
    try {
      await api('/admin/students', {
        method: 'POST',
        token,
        body: JSON.stringify({ name, email, password, courseIds: selectedCourses }),
      });
      setName('');
      setEmail('');
      setPassword('');
      setSelectedCourses([]);
      setShowForm(false);
      reload();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar aluno');
    } finally {
      setSaving(false);
    }
  }

  async function toggleAccess(studentId: string, courseId: string, hasAccess: boolean) {
    if (!token) return;
    if (hasAccess) {
      await api(`/admin/students/${studentId}/access/${courseId}`, { method: 'DELETE', token });
    } else {
      await api(`/admin/students/${studentId}/access`, {
        method: 'POST',
        token,
        body: JSON.stringify({ courseId }),
      });
    }
    reload();
  }

  async function removeStudent(studentId: string) {
    if (!token) return;
    await api(`/admin/students/${studentId}`, { method: 'DELETE', token });
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alunos</h1>
          <p className="text-sm text-black/50 mt-1">
            Cria contas de alunos e dá acesso aos cursos. Os alunos não se registam sozinhos.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Novo aluno
        </button>
      </div>

      {showForm && (
        <form onSubmit={createStudent} className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Nome do aluno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
            <input
              required
              type="email"
              placeholder="Email do aluno"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>
          <input
            required
            minLength={6}
            placeholder="Palavra-passe de acesso (dá-a ao aluno)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />

          <div>
            <p className="text-xs font-medium text-black/50 mb-2">Dar acesso a estes cursos:</p>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 bg-brand-light px-3 py-2 rounded-lg text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(c.id)}
                    onChange={(e) =>
                      setSelectedCourses((prev) =>
                        e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id),
                      )
                    }
                  />
                  {c.title}
                </label>
              ))}
              {courses.length === 0 && <p className="text-xs text-black/40">Cria um curso primeiro.</p>}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-orange transition-colors disabled:opacity-60"
          >
            {saving ? 'A criar...' : 'Criar conta do aluno'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl2 border border-black/5 shadow-sm overflow-hidden">
        {students.map((s) => (
          <div key={s.id} className="px-6 py-4 border-b border-black/5 last:border-0 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-black/40">{s.email}</p>
              </div>
              <Trash2
                size={16}
                className="text-black/30 hover:text-red-500 cursor-pointer"
                onClick={() => removeStudent(s.id)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => {
                const hasAccess = s.enrollments.some((e) => e.course.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleAccess(s.id, c.id, hasAccess)}
                    className={
                      hasAccess
                        ? 'flex items-center gap-1 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full text-xs font-medium'
                        : 'flex items-center gap-1 bg-brand-light text-black/40 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/5'
                    }
                  >
                    <BookOpen size={12} /> {c.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-center text-black/40 text-sm py-10">Ainda sem alunos criados.</p>
        )}
      </div>
    </div>
  );
}
