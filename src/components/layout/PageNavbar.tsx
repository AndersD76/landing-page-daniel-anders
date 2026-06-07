import Link from "next/link";
import Image from "next/image";

interface PageNavbarProps {
  links?: Array<{ href: string; label: string }>;
  cta?: { href: string; label: string; external?: boolean } | null;
  narrow?: boolean;
}

const defaultCta = {
  href: "https://cal.com/danielanders/15min",
  label: "AGENDAR CALL",
  external: true,
};

export function PageNavbar({ links, cta = defaultCta, narrow }: PageNavbarProps) {
  const containerClass = narrow
    ? "max-w-[900px] mx-auto px-8"
    : "container-main";

  return (
    <nav className="py-6 border-b border-white/[0.04]">
      <div className={`${containerClass} flex items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/logo.png"
            alt="Anders Dev"
            width={36}
            height={36}
            className="w-9 h-9"
            priority
          />
          <span className="font-heading text-lg font-bold text-foreground tracking-tight">
            anders<span className="text-brand">dev</span>
          </span>
        </Link>

        {(links?.length || cta) && (
          <div className="flex items-center gap-6">
            {links?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-gray no-underline tracking-[2px] uppercase hover:text-brand transition-colors hidden sm:inline"
              >
                {link.label}
              </Link>
            ))}
            {cta &&
              (cta.external ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
                >
                  {cta.label}
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className="text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
                >
                  {cta.label}
                </Link>
              ))}
          </div>
        )}
      </div>
    </nav>
  );
}
