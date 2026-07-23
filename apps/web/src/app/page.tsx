import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="text-xl font-semibold tracking-tight">
          Infinit<span className="text-brand-orange">∞</span>s Digital Cursos
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-black/70 hover:text-black">
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-brand-black text-white px-5 py-2.5 rounded-full hover:bg-brand-orange transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-8 py-24 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            Crie e venda os seus <span className="text-brand-orange">cursos online</span>
          </h1>
          <p className="mt-6 text-lg text-black/60 max-w-2xl mx-auto">
            Uma plataforma premium, simples e rápida para criadores digitais angolanos.
            Menos é mais.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-brand-orange text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Começar gratuitamente
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full font-medium border border-black/10 hover:bg-brand-light transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
