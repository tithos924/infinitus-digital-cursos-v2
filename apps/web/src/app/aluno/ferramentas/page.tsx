'use client';
import { useEffect, useState } from 'react';
import { Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { categoryColor } from '@/lib/toolCategoryColors';

type Tool = {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
};

export default function AlunoToolsPage() {
  const { token } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (!token) return;
    api('/tools', { token }).then(setTools).catch(() => {});
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ferramentas</h1>
        <p className="text-sm text-black/50 dark:text-white/50 mt-1">As melhores ferramentas para o teu negócio digital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t) => {
          const cat = t.category || 'Geral';
          const color = categoryColor(cat);
          return (
            <a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4 hover:shadow-md hover:border-brand-orange/30 transition-all block"
            >
              <div className="flex items-start justify-between">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-black/5 dark:border-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Wrench size={20} />
                  </div>
                )}
                <span className={`${color.bg} ${color.text} text-xs font-medium px-3 py-1 rounded-full`}>
                  {cat}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                {t.description && <p className="text-sm text-black/50 dark:text-white/50 mt-1">{t.description}</p>}
              </div>
              <span className="flex items-center gap-1 text-sm text-brand-orange font-medium">
                Abrir ferramenta <ArrowRight size={14} />
              </span>
            </a>
          );
        })}
      </div>

      {tools.length === 0 && (
        <div className="text-center text-black/40 dark:text-white/40 text-sm py-16 flex flex-col items-center gap-2">
          <Wrench size={24} className="text-black/20" />
          Ainda sem ferramentas disponíveis.
        </div>
      )}
    </div>
  );
}
