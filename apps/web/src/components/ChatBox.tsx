'use client';
import { useEffect, useRef, useState } from 'react';
import { Send, Mic, Square, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { ProfileModal } from './ProfileModal';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type Message = {
  id: string;
  content?: string | null;
  audioUrl?: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl?: string | null; role: string };
};

export function ChatBox() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await uploadAndSendAudio(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      alert('Não foi possível aceder ao microfone. Verifica as permissões.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function uploadAndSendAudio(blob: Blob) {
    if (!token) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert('Upload de áudio ainda não configurado.');
      return;
    }
    setUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      formData.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        await api('/chat/messages', {
          method: 'POST',
          token,
          body: JSON.stringify({ audioUrl: data.secure_url }),
        });
        load();
      } else {
        alert(data.error?.message || 'Falha ao enviar o áudio.');
      }
    } finally {
      setUploadingAudio(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!token) return;
    try {
      await api(`/chat/messages/${id}`, { method: 'DELETE', token });
      setSelectedMessageId(null);
      load();
    } catch (err: any) {
      alert(err.message || 'Não foi possível apagar a mensagem.');
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
                {m.audioUrl ? (
                  <div onClick={() => setSelectedMessageId(selectedMessageId === m.id ? null : m.id)}>
                    <audio controls src={m.audioUrl} className="max-w-full h-10" />
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedMessageId(selectedMessageId === m.id ? null : m.id)}
                    className={
                      isMe
                        ? 'bg-brand-orange text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm cursor-pointer'
                        : 'bg-brand-light dark:bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2 text-sm cursor-pointer'
                    }
                  >
                    {m.content}
                  </div>
                )}
                {selectedMessageId === m.id && (isMe || user?.role === 'ADMIN') && (
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="flex items-center gap-1 text-xs text-red-500 font-medium mt-1 px-1"
                  >
                    <Trash2 size={12} /> Apagar
                  </button>
                )}
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
          placeholder={recording ? 'A gravar áudio...' : 'Escreve uma mensagem...'}
          disabled={recording || uploadingAudio}
          className="flex-1 bg-brand-light dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          disabled={uploadingAudio}
          className={
            recording
              ? 'bg-red-500 text-white p-2.5 rounded-full hover:opacity-90 shrink-0 animate-pulse'
              : 'bg-brand-light dark:bg-white/10 text-black/60 dark:text-white/60 p-2.5 rounded-full hover:bg-brand-orange/10 hover:text-brand-orange shrink-0'
          }
          title={recording ? 'Parar gravação' : 'Gravar áudio'}
        >
          {uploadingAudio ? (
            <Loader2 size={16} className="animate-spin" />
          ) : recording ? (
            <Square size={16} fill="white" />
          ) : (
            <Mic size={16} />
          )}
        </button>
        <button
          disabled={sending || !text.trim() || recording}
          className="bg-brand-orange text-white p-2.5 rounded-full hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          <Send size={16} />
        </button>
      </form>

      {profileUserId && <ProfileModal userId={profileUserId} onClose={() => setProfileUserId(null)} />}
    </div>
  );
}
