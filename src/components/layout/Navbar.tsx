"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

export function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-surface-black/85 backdrop-blur-[30px] py-3.5 border-b border-brand/[0.08]"
          : "py-6"
      }`}
    >
      <div className="container-main flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/logo.png"
            alt="Anders Dev"
            width={40}
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="font-heading text-lg font-bold text-foreground tracking-tight hidden sm:inline">
            anders<span className="text-brand">dev</span>
          </span>
        </Link>

        <ul className="hidden lg:flex list-none gap-9">
          {[
            { href: "#services", label: t("nav_services") },
            { href: "#cases", label: t("nav_cases") },
            { href: "#process", label: t("nav_process") },
            { href: "#about", label: t("nav_about") },
            { href: "/apps", label: t("nav_apps") },
            { href: "/blog", label: t("nav_blog") },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs font-semibold text-[#555] no-underline tracking-[2px] uppercase hover:text-brand transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-brand after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded-full p-[3px]">
            <button
              onClick={() => setLocale("en")}
              className={`text-[0.7rem] font-semibold tracking-[1px] border-none px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                locale === "en"
                  ? "bg-brand text-white shadow-[0_0_12px_rgba(230,57,70,0.5)]"
                  : "bg-transparent text-[#555] hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("pt")}
              className={`text-[0.7rem] font-semibold tracking-[1px] border-none px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                locale === "pt"
                  ? "bg-brand text-white shadow-[0_0_12px_rgba(230,57,70,0.5)]"
                  : "bg-transparent text-[#555] hover:text-foreground"
              }`}
            >
              BR
            </button>
          </div>

          <Link
            href="#contact"
            className="hidden md:inline-block text-[0.8rem] font-bold text-white no-underline tracking-[1px] px-7 py-3 bg-brand rounded-full transition-all duration-400 shadow-[0_0_30px_rgba(230,57,70,0.2)] hover:scale-105 hover:shadow-[0_0_50px_rgba(230,57,70,0.4)]"
          >
            {t("nav_cta")}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-surface-black/95 backdrop-blur-xl border-t border-white/[0.06] py-8">
          <div className="container-main flex flex-col gap-6">
            {[
              { href: "#services", label: t("nav_services") },
              { href: "#cases", label: t("nav_cases") },
              { href: "#process", label: t("nav_process") },
              { href: "#about", label: t("nav_about") },
              { href: "/apps", label: t("nav_apps") },
              { href: "/blog", label: t("nav_blog") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#555] no-underline tracking-[2px] uppercase hover:text-brand transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="cta-btn text-center mt-4"
            >
              {t("nav_cta")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
