"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EadNavbar } from "@/components/ead/EadNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

type Mode = "register" | "login";

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroContent />
    </Suspense>
  );
}

function RegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  // Aceitar apenas paths internos para evitar open redirect
  const redirectTo =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : null;
  const [mode, setMode] = useState<Mode>("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register fields
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ead/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, telefone, empresa }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta. Tente novamente.");
        return;
      }

      localStorage.setItem("ead_user", JSON.stringify(data.user));
      router.push(redirectTo || "/cursos");
    } catch {
      setError("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ead/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email ou senha incorretos.");
        return;
      }

      localStorage.setItem("ead_user", JSON.stringify(data.user));
      router.push(redirectTo || "/cursos/meus-cursos");
    } catch {
      setError("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <EadNavbar />

      <main className="min-h-screen py-16 md:py-24">
        <div className="container-main flex justify-center">
          <div className="w-full max-w-md">
            {/* MODE TOGGLE */}
            <div className="flex mb-8 bg-white/[0.04] rounded-full p-1 border border-white/[0.08]">
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-brand text-white shadow-brand-sm"
                    : "text-gray hover:text-foreground"
                }`}
              >
                Criar Conta
              </button>
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-brand text-white shadow-brand-sm"
                    : "text-gray hover:text-foreground"
                }`}
              >
                Entrar
              </button>
            </div>

            <div className="glass-card">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                {mode === "register" ? "Criar conta gratuita" : "Entrar"}
              </h1>
              <p className="text-sm text-gray mb-8">
                {mode === "register"
                  ? "Cadastre-se para acessar os cursos gratuitos."
                  : "Entre com sua conta para continuar estudando."}
              </p>

              {error && (
                <div className="bg-brand/10 border border-brand/20 rounded-lg px-4 py-3 mb-6">
                  <p className="text-sm text-brand">{error}</p>
                </div>
              )}

              {mode === "register" ? (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="nome"
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="senha"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Senha *
                    </label>
                    <input
                      id="senha"
                      type="password"
                      required
                      minLength={6}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Telefone{" "}
                      <span className="text-gray-600 normal-case tracking-normal">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="telefone"
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(54) 99999-9999"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="empresa"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Empresa{" "}
                      <span className="text-gray-600 normal-case tracking-normal">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="empresa"
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Nome da empresa"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand text-white font-bold py-3.5 rounded-full text-sm hover:scale-[1.02] transition-transform shadow-brand-sm disabled:opacity-50 disabled:hover:scale-100 cursor-pointer mt-2"
                  >
                    {loading ? "Criando conta..." : "Criar conta gratuita"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-senha"
                      className="block text-xs font-bold text-gray tracking-[1px] uppercase mb-2"
                    >
                      Senha
                    </label>
                    <input
                      id="login-senha"
                      type="password"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-brand/40 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand text-white font-bold py-3.5 rounded-full text-sm hover:scale-[1.02] transition-transform shadow-brand-sm disabled:opacity-50 disabled:hover:scale-100 cursor-pointer mt-2"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              )}

              <p className="text-xs text-gray-600 text-center mt-6">
                {mode === "register" ? (
                  <>
                    Ja tem conta?{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className="text-brand hover:text-brand-bright transition-colors font-bold cursor-pointer"
                    >
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Nao tem conta?{" "}
                    <button
                      onClick={() => {
                        setMode("register");
                        setError("");
                      }}
                      className="text-brand hover:text-brand-bright transition-colors font-bold cursor-pointer"
                    >
                      Criar conta gratuita
                    </button>
                  </>
                )}
              </p>
            </div>

            <p className="text-xs text-gray-600 text-center mt-6">
              <Link
                href="/cursos"
                className="text-gray-600 no-underline hover:text-brand transition-colors"
              >
                Voltar para cursos
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PageFooter />
    </>
  );
}
