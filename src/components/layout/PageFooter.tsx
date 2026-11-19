import Image from "next/image";
import Link from "next/link";
import { BotaoPreferencias } from "@/components/analytics/BotaoPreferencias";

interface PageFooterProps {
  narrow?: boolean;
}

export function PageFooter({ narrow }: PageFooterProps) {
  const containerClass = narrow
    ? "max-w-[900px] mx-auto px-4 sm:px-6 md:px-8"
    : "container-main";

  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className={`${containerClass} flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Anders Dev"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-sm text-gray">andersdev.com.br</span>
          </div>
          <span className="text-xs text-gray">&copy; 2026 Daniel Anders</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Home</Link>
          <Link href="/blog" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Blog</Link>
          <Link href="/quanto-custa" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Quanto custa</Link>
          <Link href="/sistema-para" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Por setor</Link>
          <Link href="/sites-e-sistemas" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Por cidade</Link>
          <Link href="/alternativa-a" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Alternativas</Link>
          <Link href="/calculadora-site" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Calculadora</Link>
          <Link href="/apps" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Apps</Link>
          <Link href="/guias" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Guias</Link>
          <Link href="/ferramentas" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Ferramentas</Link>
          <Link href="/modelos" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Modelos</Link>
          <Link href="/glossario" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Glossário</Link>
          <Link href="/leis" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Leis</Link>
          <Link href="/dados/empresas-por-setor" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Dados</Link>
          <Link href="/sobre" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Sobre</Link>
          <Link href="/politica-editorial" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Política editorial</Link>
          <Link href="/privacidade" className="text-xs text-gray-600 no-underline hover:text-brand transition-colors">Privacidade</Link>
          <BotaoPreferencias className="text-xs text-gray-600 hover:text-brand transition-colors bg-transparent border-0 p-0 cursor-pointer" />
        </nav>
        <p className="text-xs text-gray-700">
          Rua Uruguai, 679 - Sala 201 · Passo Fundo, RS · (54) 9.9964-8368
        </p>
      </div>
    </footer>
  );
}
