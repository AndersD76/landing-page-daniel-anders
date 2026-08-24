"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
  courseId: number;
  courseSlug: string;
  isFree: boolean;
  className?: string;
  children: React.ReactNode;
}

type AuthState = "loading" | "logged-in" | "logged-out";

export function EnrollButton({
  courseId,
  courseSlug,
  isFree,
  className,
  children,
}: EnrollButtonProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        const res = await fetch("/api/ead/me", { credentials: "include" });
        if (!cancelled) {
          setAuthState(res.ok ? "logged-in" : "logged-out");
        }
      } catch {
        if (!cancelled) setAuthState("logged-out");
      }
    }
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleEnroll() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ead/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId }),
      });

      if (res.ok || res.status === 409) {
        // Sucesso ou ja matriculado: ir para o player
        router.push(`/cursos/player/${courseSlug}`);
        return;
      }

      if (res.status === 401) {
        // Sessao expirou entre o check e o enroll
        const redirect = encodeURIComponent(`/cursos/${courseSlug}`);
        router.push(`/cursos/registro?redirect=${redirect}`);
        return;
      }

      const data = await res.json();
      setError(data.error || "Erro ao realizar matricula.");
    } catch {
      setError("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClick() {
    if (!isFree) {
      // Cursos pagos: redirecionar para registro/checkout
      router.push("/cursos/registro");
      return;
    }

    if (authState === "logged-out") {
      // Nao logado: redirecionar para registro com redirect de volta
      const redirect = encodeURIComponent(`/cursos/${courseSlug}`);
      router.push(`/cursos/registro?redirect=${redirect}`);
      return;
    }

    if (authState === "logged-in") {
      await handleEnroll();
    }
  }

  const isDisabled = authState === "loading" || loading;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={className}
        style={{ cursor: isDisabled ? "wait" : "pointer" }}
      >
        {loading ? "Matriculando..." : children}
      </button>
      {error && (
        <p className="text-sm text-brand mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
