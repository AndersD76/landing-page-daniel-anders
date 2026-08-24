"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function EadNavbar() {
  const [user, setUser] = useState<{ nome: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ead_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  async function handleLogout() {
    localStorage.removeItem("ead_user");
    localStorage.removeItem("ead_token");
    try {
      await fetch("/api/ead/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* cookie será limpo no próximo request com token expirado */
    }
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/cursos";
  }

  return (
    <nav className="py-4 md:py-6 border-b border-white/[0.04] sticky top-0 z-nav bg-surface-black/90 backdrop-blur-md">
      <div className="container-main flex items-center justify-between">
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

        <div className="flex items-center gap-6">
          <Link
            href="/cursos"
            className="text-xs font-semibold text-gray no-underline tracking-[2px] uppercase hover:text-brand transition-colors hidden sm:inline"
          >
            CURSOS
          </Link>

          {user && (
            <Link
              href="/cursos/meus-cursos"
              className="text-xs font-semibold text-gray no-underline tracking-[2px] uppercase hover:text-brand transition-colors hidden sm:inline"
            >
              MEUS CURSOS
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm font-bold text-white bg-brand px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-brand-sm cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.nome.split(" ")[0]}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-surface-dark border border-white/[0.08] rounded-xl shadow-xl py-2 z-50">
                  <Link
                    href="/cursos/meus-cursos"
                    className="block px-4 py-2.5 text-sm text-foreground no-underline hover:bg-white/[0.04] transition-colors sm:hidden"
                    onClick={() => setMenuOpen(false)}
                  >
                    Meus Cursos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray hover:bg-white/[0.04] hover:text-brand transition-colors cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/cursos/registro"
              className="text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
            >
              ENTRAR
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
