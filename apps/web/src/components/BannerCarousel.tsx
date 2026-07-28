'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Banner = {
  id: string;
  title?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
};

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    api('/banners/active').then(setBanners).catch(() => {});
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {banners.map((b) => {
        const content = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.imageUrl}
            alt={b.title || 'Banner'}
            className="w-full h-full object-cover"
          />
        );
        return (
          <div
            key={b.id}
            className="shrink-0 w-full snap-center rounded-xl2 overflow-hidden border border-black/5 shadow-sm h-40 md:h-56"
          >
            {b.linkUrl ? (
              <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}
