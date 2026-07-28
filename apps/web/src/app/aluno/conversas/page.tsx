import { MessageCircle } from 'lucide-react';

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Conversas</h1>
      <p className="text-sm text-black/50">Chat com outros membros da plataforma.</p>
      <div className="bg-white rounded-xl2 border border-black/5 shadow-sm p-10 text-center text-black/40 mt-6 flex flex-col items-center gap-2">
        <MessageCircle size={24} className="text-black/20" />
        Em breve.
      </div>
    </div>
  );
}
