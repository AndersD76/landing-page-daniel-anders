import Image from "next/image";

interface PageFooterProps {
  narrow?: boolean;
}

export function PageFooter({ narrow }: PageFooterProps) {
  const containerClass = narrow
    ? "max-w-[900px] mx-auto px-8"
    : "container-main";

  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className={`${containerClass} flex items-center justify-between`}>
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
    </footer>
  );
}
