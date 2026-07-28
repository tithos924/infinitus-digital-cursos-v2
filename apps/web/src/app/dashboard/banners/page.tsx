'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';

type Banner = {
  id: string;
  title?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  active: boolean;
};

export default function BannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [saving, setSaving] = useState(false);

  function reload() {
    if (!token) return;
    api('/banners', { token }).then(setBanners).catch(() => {});
  }
  useEffect(reload, [token]);

  async function createBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !imageUrl) return;
    setSaving(true);
    try {
      await api('/banners', {
        method: 'POST',
        token,
        body: JSON.stringify({ title: title || undefined, imageUrl, linkUrl: linkUrl || undefined }),
      });
      setTitle('');
      setImageUrl('');
      setLinkUrl('');
      setShowForm(false);
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(b: Banner) {
    if (!token) return;
    await api(`/banners/${b.id}`, { method: 'PATCH', token, body: JSON.stringify({ active: !b.active }) });
    reload();
  }

  async function deleteBanner(id: string) {
    if (!token) return;
    await api(`/banners/${id}`, { method: 'DELETE', token });
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Banners</h1>
          <p className="text-sm text-black/50 mt-1">
            Imagens de destaque mostradas na página inicial e no dashboard dos alunos.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Novo banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={createBanner} className="bg-white rounded-xl2 border border-black/5 shadow-sm p-6 space-y-4">
          <ImageUploader label="Imagem do banner" value={imageUrl} onChange={setImageUrl} />
          <input
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <input
            placeholder="Link ao clicar (opcional, ex: https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button
            disabled={saving || !imageUrl}
            className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-orange transition-colors disabled:opacity-60"
          >
            {saving ? 'A guardar...' : 'Adicionar banner'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-xl2 border border-black/5 shadow-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.imageUrl} alt={b.title || 'Banner'} className="w-full h-36 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{b.title || 'Sem título'}</p>
                <p className={`text-xs ${b.active ? 'text-green-600' : 'text-black/40'}`}>
                  {b.active ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(b)} className="text-black/40 hover:text-brand-orange">
                  {b.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <Trash2
                  size={16}
                  className="text-black/30 hover:text-red-500 cursor-pointer"
                  onClick={() => deleteBanner(b.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && !showForm && (
        <p className="text-center text-black/40 text-sm py-12">Ainda sem banners adicionados.</p>
      )}
    </div>
  );
}
