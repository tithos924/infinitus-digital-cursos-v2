import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Infinitus Digital Cursos" className="h-8 w-8 object-contain" />
          Infinitus Digital Cursos
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium bg-brand-black text-white px-5 py-2.5 rounded-full hover:bg-brand-orange transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-8 py-24 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            A tua plataforma de <span className="text-brand-orange">cursos online</span>
          </h1>
          <p className="mt-6 text-lg text-black/60 max-w-2xl mx-auto">
            Acesso à plataforma é dado pelo administrador. Se já recebeste as tuas
            credenciais, entra na tua conta abaixo.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-brand-orange text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Entrar na plataforma
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
