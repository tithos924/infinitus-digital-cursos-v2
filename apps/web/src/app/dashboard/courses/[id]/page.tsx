'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Video, FileText, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';
import { FileUploader } from '@/components/FileUploader';

type Lesson = {
  id: string;
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  contentHtml?: string | null;
  order: number;
};

type Material = {
  id: string;
  name: string;
  fileUrl: string;
};

type ModuleType = {
  id: string;
  title: string;
  order: number;
  imageUrl?: string | null;
  lessons: Lesson[];
  materials: Material[];
};

type Course = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
};

export default function CourseEditorPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleImage, setNewModuleImage] = useState('');

  function reload() {
    if (!token) return;
    api(`/courses/${id}`, { token }).then((c) => setCourse(c)).catch(() => {});
    api(`/courses/${id}/modules`).then(setModules).catch(() => {});
  }

  useEffect(reload, [token, id]);

  async function createModule(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !newModuleTitle.trim()) return;
    await api(`/courses/${id}/modules`, {
      method: 'POST',
      token,
      body: JSON.stringify({ title: newModuleTitle, imageUrl: newModuleImage || undefined }),
    });
    setNewModuleTitle('');
    setNewModuleImage('');
    reload();
  }

  async function deleteModule(moduleId: string) {
    if (!token) return;
    await api(`/modules/${moduleId}`, { method: 'DELETE', token });
    reload();
  }

  async function publish() {
    if (!token) return;
    await api(`/courses/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status: course?.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }),
    });
    reload();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{course?.title ?? 'A carregar...'}</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">{course?.description || 'Sem descrição'}</p>
        </div>
        <button
          onClick={publish}
          className={
            course?.status === 'PUBLISHED'
              ? 'px-5 py-2.5 rounded-full text-sm font-medium border border-black/10 dark:border-white/10 hover:bg-brand-light dark:hover:bg-white/10 dark:bg-white/5'
              : 'px-5 py-2.5 rounded-full text-sm font-medium bg-brand-orange text-white hover:opacity-90'
          }
        >
          {course?.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar curso'}
        </button>
      </div>

      <form onSubmit={createModule} className="space-y-2">
        <div className="flex gap-2">
          <input
            placeholder="Título do novo módulo (ex: Módulo 1 — Introdução)"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="flex-1 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button className="flex items-center gap-1 bg-brand-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-orange transition-colors">
            <Plus size={16} /> Módulo
          </button>
        </div>
        <ImageUploader label="Imagem do módulo (opcional)" value={newModuleImage} onChange={setNewModuleImage} />
      </form>

      <div className="space-y-3">
        {modules.map((m) => (
          <div key={m.id} className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <button
              onClick={() => setOpenModule(openModule === m.id ? null : m.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2 font-medium">
                <GripVertical size={16} className="text-black/30" />
                {m.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imageUrl} alt={m.title} className="w-8 h-8 rounded-md object-cover" />
                )}
                {m.title}
                <span className="text-xs text-black/40 dark:text-white/40 font-normal">({m.lessons.length} aulas)</span>
              </span>
              <span className="flex items-center gap-3">
                <Trash2
                  size={16}
                  className="text-black/30 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteModule(m.id);
                  }}
                />
                {openModule === m.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            </button>
            {openModule === m.id && (
              <div className="border-t border-black/5 dark:border-white/10 px-5 py-4 space-y-5">
                <LessonList moduleId={m.id} lessons={m.lessons} token={token} onChange={reload} />
                <MaterialsList moduleId={m.id} materials={m.materials} token={token} onChange={reload} />
              </div>
            )}
          </div>
        ))}
        {modules.length === 0 && (
          <p className="text-center text-black/40 dark:text-white/40 py-10 text-sm">
            Ainda sem módulos. Cria o primeiro acima.
          </p>
        )}
      </div>
    </div>
  );
}

function toDownloadUrl(url: string) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}

function MaterialsList({
  moduleId,
  materials,
  token,
  onChange,
}: {
  moduleId: string;
  materials: Material[];
  token: string | null;
  onChange: () => void;
}) {
  async function addMaterial(fileUrl: string, fileName: string) {
    if (!token) return;
    await api(`/modules/${moduleId}/materials`, {
      method: 'POST',
      token,
      body: JSON.stringify({ name: fileName, fileUrl }),
    });
    onChange();
  }

  async function deleteMaterial(id: string) {
    if (!token) return;
    await api(`/materials/${id}`, { method: 'DELETE', token });
    onChange();
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase">Materiais (PDF)</p>
      {materials.map((mat) => (
        <div
          key={mat.id}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-brand-light dark:bg-white/5"
        >
          <a
            href={toDownloadUrl(mat.fileUrl)}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-brand-orange font-medium truncate"
          >
            <FileText size={15} className="shrink-0" />
            <span className="truncate">{mat.name}</span>
          </a>
          <Trash2
            size={15}
            className="text-black/30 hover:text-red-500 cursor-pointer shrink-0"
            onClick={() => deleteMaterial(mat.id)}
          />
        </div>
      ))}
      <FileUploader label="Adicionar PDF" onUploaded={addMaterial} />
    </div>
  );
}

function LessonList({
  moduleId,
  lessons,
  token,
  onChange,
}: {
  moduleId: string;
  lessons: Lesson[];
  token: string | null;
  onChange: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function createLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !title.trim()) return;
    setSaving(true);
    try {
      await api(`/modules/${moduleId}/lessons`, {
        method: 'POST',
        token,
        body: JSON.stringify({ title, videoUrl, imageUrl, contentHtml: content }),
      });
      setTitle('');
      setVideoUrl('');
      setImageUrl('');
      setContent('');
      setShowForm(false);
      onChange();
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson(id: string) {
    if (!token) return;
    await api(`/lessons/${id}`, { method: 'DELETE', token });
    onChange();
  }

  return (
    <div className="space-y-3">
      {lessons.map((l) => (
        <div key={l.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-brand-light dark:bg-white/5">
          <span className="flex items-center gap-2 text-sm">
            {l.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={l.imageUrl} alt={l.title} className="w-7 h-7 rounded object-cover" />
            ) : l.videoUrl ? (
              <Video size={15} className="text-brand-orange" />
            ) : (
              <FileText size={15} className="text-black/40 dark:text-white/40" />
            )}
            {l.title}
          </span>
          <Trash2 size={15} className="text-black/30 hover:text-red-500 cursor-pointer" onClick={() => deleteLesson(l.id)} />
        </div>
      ))}

      {showForm ? (
        <form onSubmit={createLesson} className="space-y-2 pt-2">
          <input
            required
            placeholder="Título da aula"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            placeholder="URL do vídeo (YouTube, Vimeo, Bunny.net...)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <ImageUploader label="Miniatura da aula (opcional)" value={imageUrl} onChange={setImageUrl} />
          <textarea
            placeholder="Conteúdo / notas da aula"
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'A guardar...' : 'Guardar aula'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-white dark:bg-neutral-900"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-xs font-medium text-brand-orange pt-1"
        >
          <Plus size={14} /> Adicionar aula
        </button>
      )}
    </div>
  );
}
