'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

type Profile = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: string;
  createdAt: string;
};

export function ProfileModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!token) return;
    api(`/users/${userId}/public-profile`, { token }).then(setProfile).catch(() => {});
  }, [token, userId]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-lg w-full max-w-sm p-6 space-y-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
        >
          <X size={18} />
        </button>
        {profile ? (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange text-2xl font-semibold">
                  {profile.name[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{profile.name}</p>
                <span className="text-xs text-black/40 dark:text-white/40 uppercase">{profile.role}</span>
              </div>
            </div>
            {profile.bio && (
              <p className="text-sm text-black/60 dark:text-white/60 text-center">{profile.bio}</p>
            )}
          </>
        ) : (
          <p className="text-center text-sm text-black/40 dark:text-white/40 py-6">A carregar perfil...</p>
        )}
      </div>
    </div>
  );
}
