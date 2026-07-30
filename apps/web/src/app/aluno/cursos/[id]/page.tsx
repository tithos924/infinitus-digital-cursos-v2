'use client';
import { useEffect, useState } from 'react';
import { PlayCircle, FileText, ChevronLeft, ChevronDown, ChevronRight, Play, Download } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Lesson = {
  id: string;
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  contentHtml?: string | null;
};

type Material = {
  id: string;
  name: string;
  fileUrl: string;
};

type ModuleType = {
  id: string;
  title: string;
  lessons: Lesson[];
  materials: Material[];
};

type Course = {
  id: string;
  title: string;
  modules: ModuleType[];
};

function toEmbedUrl(url: string) {
  if (!url) return url;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

function toDownloadUrl(url: string) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}

export default function StudentCoursePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!token) return;
    api(`/courses/${id}`, { token }).then((c) => {
      setCourse(c);
      const firstModule = c.modules?.[0];
      const first = firstModule?.lessons?.[0];
      if (first) setActiveLesson(first);
      if (firstModule) setOpenModuleId(firstModule.id);
    }).catch(() => {});
  }, [token, id]);

  function selectLesson(l: Lesson) {
    setActiveLesson(l);
    setIsPlaying(false);
  }

  return (
    <div className="space-y-4">
      <Link href="/aluno" className="flex items-center gap-1 text-sm text-black/50 dark:text-white/50 hover:text-black w-fit">
        <ChevronLeft size={16} /> Voltar aos meus cursos
      </Link>
      <h1 className="text-2xl font-semibold">{course?.title ?? 'A carregar...'}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {activeLesson?.videoUrl ? (
            <div className="aspect-video bg-black rounded-xl2 overflow-hidden relative">
              {isPlaying ? (
                <iframe
                  src={toEmbedUrl(activeLesson.videoUrl)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-full h-full relative flex items-center justify-center group"
                >
                  {activeLesson.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeLesson.imageUrl}
                      alt={activeLesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black" />
                  )}
                  <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="relative w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Play size={26} fill="white" />
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-brand-light dark:bg-white/5 rounded-xl2 flex items-center justify-center text-black/30 text-sm">
              Sem vídeo nesta aula
            </div>
          )}
          <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <h2 className="font-medium mb-2">{activeLesson?.title ?? 'Seleciona uma aula'}</h2>
            <p className="text-sm text-black/60 dark:text-white/60 whitespace-pre-wrap">{activeLesson?.contentHtml}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 p-3 space-y-1 h-fit">
          {course?.modules.map((m) => {
            const open = openModuleId === m.id;
            return (
              <div key={m.id}>
                <button
                  onClick={() => setOpenModuleId(open ? null : m.id)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg text-left hover:bg-brand-light dark:hover:bg-white/10"
                >
                  <span className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase">{m.title}</span>
                  {open ? (
                    <ChevronDown size={16} className="text-black/40 dark:text-white/40" />
                  ) : (
                    <ChevronRight size={16} className="text-black/40 dark:text-white/40" />
                  )}
                </button>
                {open && (
                  <div className="space-y-1 pb-2">
                    {m.lessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => selectLesson(l)}
                        className={clsx(
                          'w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                          activeLesson?.id === l.id
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'hover:bg-brand-light dark:hover:bg-white/10 dark:bg-white/5',
                        )}
                      >
                        {l.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.imageUrl} alt={l.title} className="w-8 h-8 rounded object-cover shrink-0" />
                        ) : l.videoUrl ? (
                          <PlayCircle size={16} className="shrink-0" />
                        ) : (
                          <FileText size={16} className="shrink-0" />
                        )}
                        {l.title}
                      </button>
                    ))}
                    {m.materials?.length > 0 && (
                      <div className="pt-1 space-y-1 border-t border-black/5 dark:border-white/10 mt-1">
                        {m.materials.map((mat) => (
                          <a
                            key={mat.id}
                            href={toDownloadUrl(mat.fileUrl)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-orange hover:bg-brand-light dark:hover:bg-white/10"
                          >
                            <Download size={15} className="shrink-0" />
                            <span className="truncate">{mat.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
