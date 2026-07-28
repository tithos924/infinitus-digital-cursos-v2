'use client';
import { useEffect, useState } from 'react';
import { ExternalLink, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Tool = {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  category?: string | null;
};

export default function AlunoToolsPage() {
  const { token } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (!token) return;
    api('/tools', { token }).then(setTools).catch(() => {});
  }, [token]);

  const grouped = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    const key = t.category || 'Geral';
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ferramentas</h1>
        <p className="text-sm text-black/50 mt-1">Recursos e ferramentas recomendadas pelo teu formador.</p>
      </div>

      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} className="space-y-3">
          <p className="text-xs font-semibold text-black/40 uppercase">{cat}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list.map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl2 border border-black/5 shadow-sm p-5 space-y-2 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{t.name}</h3>
                  <ExternalLink size={14} className="text-brand-orange" />
                </div>
                {t.description && <p className="text-xs text-black/50">{t.description}</p>}
              </a>
            ))}
          </div>
        </div>
      ))}

      {tools.length === 0 && (
        <div className="text-center text-black/40 text-sm py-16 flex flex-col items-center gap-2">
          <Wrench size={24} className="text-black/20" />
          Ainda sem ferramentas disponíveis.
        </div>
      )}
    </div>
  );
}
