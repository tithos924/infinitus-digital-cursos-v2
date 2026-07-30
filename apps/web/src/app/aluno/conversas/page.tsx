'use client';
import { ChatBox } from '@/components/ChatBox';

export default function ConversasPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Conversas</h1>
        <p className="text-sm text-black/50 dark:text-white/50 mt-1">
          Conversa com os outros alunos da plataforma. Clica no nome de alguém para ver o perfil.
        </p>
      </div>
      <ChatBox />
    </div>
  );
}
