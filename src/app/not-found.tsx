import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <p className="text-8xl font-heading font-bold text-brand/20 mb-4">
          404
        </p>
        <h1 className="font-heading text-3xl font-bold mb-4">
          Página não encontrada
        </h1>
        <p className="text-[#666] mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <Link href="/" className="cta-btn">
          VOLTAR AO INÍCIO
        </Link>
      </div>
    </main>
  );
}
