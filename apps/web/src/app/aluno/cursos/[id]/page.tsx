'use client';
import { useEffect, useState } from 'react';
import { PlayCircle, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Lesson = {
  id: string;
  title: string;
  videoUrl?: string | null;
  contentHtml?: string | null;
};

type ModuleType = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  modules: ModuleType[];
};

function toEmbedUrl(url: string) {
  if (!url) return url;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!token) return;
    api(`/courses/${id}`, { token }).then((c) => {
      setCourse(c);
      const first = c.modules?.[0]?.lessons?.[0];
      if (first) setActiveLesson(first);
    }).catch(() => {});
  }, [token, id]);

  return (
    <div className="space-y-4">
      <Link href="/aluno" className="flex items-center gap-1 text-sm text-black/50 dark:text-white/50 hover:text-black w-fit">
        <ChevronLeft size={16} /> Voltar aos meus cursos
      </Link>
      <h1 className="text-2xl font-semibold">{course?.title ?? 'A carregar...'}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {activeLesson?.videoUrl ? (
            <div className="aspect-video bg-black rounded-xl2 overflow-hidden">
              <iframe
                src={toEmbedUrl(activeLesson.videoUrl)}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-brand-light dark:bg-white/5 rounded-xl2 flex items-center justify-center text-black/30 text-sm">
              Sem vídeo nesta aula
            </div>
          )}
          <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm p-5">
            <h2 className="font-medium mb-2">{activeLesson?.title ?? 'Seleciona uma aula'}</h2>
            <p className="text-sm text-black/60 dark:text-white/60 whitespace-pre-wrap">{activeLesson?.contentHtml}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm p-3 space-y-3 h-fit">
          {course?.modules.map((m) => (
            <div key={m.id}>
              <p className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase px-2 py-1">{m.title}</p>
              {m.lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={clsx(
                    'w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                    activeLesson?.id === l.id ? 'bg-brand-orange/10 text-brand-orange' : 'hover:bg-brand-light dark:hover:bg-white/10 dark:bg-white/5',
                  )}
                >
                  {l.videoUrl ? <PlayCircle size={16} /> : <FileText size={16} />}
                  {l.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
