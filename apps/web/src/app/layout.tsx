import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infinitus Digital Cursos',
  description: 'Plataforma premium de cursos online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
