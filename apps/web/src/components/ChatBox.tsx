'use client';
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ProfileModal } from './ProfileModal';

type Message = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatarUrl?: string | null; role: string };
};

export function ChatBox() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function load() {
    if (!token) return;
    api('/chat/messages', { token }).then(setMessages).catch(() => {});
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !text.trim()) return;
    setSending(true);
    try {
      await api('/chat/messages', { method: 'POST', token, body: JSON.stringify({ content: text.trim() }) });
      setText('');
      load();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl2 border border-black/5 dark:border-white/10 shadow-sm flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.user.id === user?.id;
          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => setProfileUserId(m.user.id)} className="shrink-0">
                {m.user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.user.avatarUrl} alt={m.user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange text-xs font-semibold">
                    {m.user.name[0]?.toUpperCase()}
                  </div>
                )}
              </button>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <button
                  onClick={() => setProfileUserId(m.user.id)}
                  className="text-xs font-medium text-black/50 dark:text-white/50 hover:text-brand-orange mb-0.5 px-1"
                >
                  {m.user.name}
                </button>
                <div
                  className={
                    isMe
                      ? 'bg-brand-orange text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm'
                      : 'bg-brand-light dark:bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2 text-sm'
                  }
                >
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-center text-black/40 dark:text-white/40 text-sm py-10">
            Ainda sem mensagens. Sê o primeiro a escrever!
          </p>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-black/5 dark:border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreve uma mensagem..."
          className="flex-1 bg-brand-light dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
        />
        <button
          disabled={sending || !text.trim()}
          className="bg-brand-orange text-white p-2.5 rounded-full hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          <Send size={16} />
        </button>
      </form>

      {profileUserId && <ProfileModal userId={profileUserId} onClose={() => setProfileUserId(null)} />}
    </div>
  );
}
