'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink, Sparkles, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';

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

  const grouped = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    const key = t.category || 'Geral';
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ferramentas</h1>
          <p className="text-sm text-black/50 mt-1">
            Links de ferramentas úteis (IA, gestão de projetos, marketing digital...) visíveis para os alunos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 bg-white border border-black/10 text-black/70 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-light disabled:opacity-60"
          >
            <Sparkles size={16} /> {seeding ? 'A adicionar...' : 'Ferramentas padrão'}
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
          >
            <Plus size={16} /> Nova ferramenta
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={createTool} className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-4">
          <ImageUploader label="Ícone/logo da ferramenta" value={imageUrl} onChange={setImageUrl} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Nome (ex: ChatGPT, Trello, Canva)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
            <input
              required
              placeholder="URL (ex: https://trello.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>
          <input
            placeholder="Categoria (ex: Inteligência Artificial, Gestão de Projetos, Design)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <textarea
            placeholder="Descrição curta (opcional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button
            disabled={saving}
            className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-orange transition-colors disabled:opacity-60"
          >
            {saving ? 'A guardar...' : 'Adicionar ferramenta'}
          </button>
        </form>
      )}

      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} className="space-y-3">
          <p className="text-xs font-semibold text-black/40 uppercase">{cat}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list.map((t) => (
              <div key={t.id} className="bg-white rounded-xl2 border border-black/5 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.imageUrl} alt={t.name} className="w-11 h-11 rounded-xl object-cover border border-black/5" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <Wrench size={18} />
                      </div>
                    )}
                    <h3 className="font-medium text-sm">{t.name}</h3>
                  </div>
                  <Trash2
                    size={14}
                    className="text-black/30 hover:text-red-500 cursor-pointer shrink-0"
                    onClick={() => deleteTool(t.id)}
                  />
                </div>
                {t.description && <p className="text-xs text-black/50">{t.description}</p>}
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-brand-orange font-medium"
                >
                  Abrir <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tools.length === 0 && !showForm && (
        <p className="text-center text-black/40 text-sm py-12">
          Ainda sem ferramentas adicionadas.
        </p>
      )}
    </div>
  );
}
