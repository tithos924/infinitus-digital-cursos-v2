'use client';
import { useRef, useState } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function FileUploader({
  onUploaded,
  accept = 'application/pdf',
  label = 'Carregar PDF',
}: {
  onUploaded: (fileUrl: string, fileName: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Upload de ficheiros ainda não configurado.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onUploaded(data.secure_url, file.name);
      } else {
        setError(data.error?.message || 'Falha ao carregar o ficheiro.');
      }
    } catch {
      setError('Falha ao carregar o ficheiro (erro de rede).');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-xs font-medium border border-dashed border-black/20 dark:border-white/20 rounded-lg px-3 py-2 text-black/50 dark:text-white/50 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-60 w-fit"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
        {uploading ? 'A carregar...' : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
