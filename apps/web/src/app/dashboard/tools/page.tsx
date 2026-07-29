'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';
import { categoryColor } from '@/lib/toolCategoryColors';

type Tool = {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
};

export default function ToolsPage() {
  const { token } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  function reload() {
    if (!token) return;
    api('/tools', { token }).then(setTools).catch(() => {});
  }
  useEffect(reload, [token]);

  async function createTool(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api('/tools', {
        method: 'POST',
        token,
        body: JSON.stringify({ name, url, description, category: category || undefined, imageUrl: imageUrl || undefined }),
      });
      setName('');
      setUrl('');
      setDescription('');
      setCategory('');
      setImageUrl('');
      setShowForm(false);
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function deleteTool(id: string) {
    if (!token) return;
    await api(`/tools/${id}`, { method: 'DELETE', token });
    reload();
  }

  async function seedDefaults() {
    if (!token) return;
    setSeeding(true);
    try {
      const result = await api('/tools/seed-defaults', { method: 'POST', token });
      reload();
      if (result.added === 0) {
        alert('As ferramentas padrão já estavam todas adicionadas.');
      }
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ferramentas</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">
            Links de ferramentas úteis (IA, gestão de projetos, marketing digital...) visíveis para os alunos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-light dark:hover:bg-white/10 dark:bg-white/5 disabled:opacity-60"
          >
            <Sparkles size={16} /> {seeding ? 'A adicionar...' : 'Ferramentas padrão'}
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-transform"
          >
            <Plus size={16} /> Nova ferramenta
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={createTool} className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
          <ImageUploader label="Ícone/logo da ferramenta" value={imageUrl} onChange={setImageUrl} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Nome (ex: ChatGPT, Trello, Canva)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
            <input
              required
              placeholder="URL (ex: https://trello.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>
          <input
            placeholder="Categoria (ex: Inteligência Artificial, Gestão de Projetos, Design)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <textarea
            placeholder="Descrição curta (opcional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-brand-light dark:bg-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button
            disabled={saving}
            className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-orange active:scale-95 transition-transform transition-colors disabled:opacity-60"
          >
            {saving ? 'A guardar...' : 'Adicionar ferramenta'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t) => {
          const cat = t.category || 'Geral';
          const color = categoryColor(cat);
          return (
            <div key={t.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
              <div className="flex items-start justify-between">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-black/5 dark:border-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Wrench size={20} />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`${color.bg} ${color.text} text-xs font-medium px-3 py-1 rounded-full`}>
                    {cat}
                  </span>
                  <Trash2
                    size={16}
                    className="text-black/30 hover:text-red-500 cursor-pointer shrink-0"
                    onClick={() => deleteTool(t.id)}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                {t.description && <p className="text-sm text-black/50 dark:text-white/50 mt-1">{t.description}</p>}
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-brand-orange font-medium w-fit"
              >
                Abrir ferramenta <ArrowRight size={14} />
              </a>
            </div>
          );
        })}
      </div>

      {tools.length === 0 && !showForm && (
        <p className="text-center text-black/40 dark:text-white/40 text-sm py-12">
          Ainda sem ferramentas adicionadas.
        </p>
      )}
    </div>
  );
}
