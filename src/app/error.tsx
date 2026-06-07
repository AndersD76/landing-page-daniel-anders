"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <p className="text-6xl font-heading font-bold text-brand/20 mb-4">!</p>
        <h1 className="font-heading text-3xl font-bold mb-4">
          Algo deu errado
        </h1>
        <p className="text-gray-500 mb-8">
          Ocorreu um erro inesperado. Tente recarregar a página.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="cta-btn"
          >
            TENTAR NOVAMENTE
          </button>
          <Link
            href="/"
            className="text-sm text-gray hover:text-brand transition-colors no-underline"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
