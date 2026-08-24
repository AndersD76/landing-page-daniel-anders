"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface QuizQuestion {
  id: number;
  pergunta: string;
  alternativas: string[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  results: {
    questionId: number;
    correct: boolean;
    explicacao: string | null;
  }[];
  certificate: {
    code: string;
    createdAt: string;
  } | null;
  message: string;
}

export default function ProvaPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [titulo, setTitulo] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/ead/quiz/${slug}`);

        if (res.status === 401) {
          localStorage.removeItem("ead_user");
          router.push("/cursos/registro");
          return;
        }

        if (res.status === 403) {
          router.push(`/cursos/${slug}`);
          return;
        }

        if (!res.ok) {
          setError("Erro ao carregar a prova.");
          return;
        }

        const data = await res.json();
        setTitulo(data.titulo || "");
        setQuestions(data.questions || []);
      } catch {
        setError("Erro de conexao.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [slug, router]);

  function selectAnswer(questionId: number, alternativeIndex: number) {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: alternativeIndex }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      setError("Responda todas as questoes antes de enviar.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/ead/quiz/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao enviar a prova.");
        return;
      }

      const data: QuizResult = await res.json();
      setResult(data);
    } catch {
      setError("Erro de conexao.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-black flex items-center justify-center">
        <div className="text-gray">Carregando prova...</div>
      </div>
    );
  }

  if (error && !result && questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface-black flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <p className="text-brand mb-4">{error}</p>
          <Link
            href={`/cursos/player/${slug}`}
            className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
          >
            Voltar para o curso
          </Link>
        </div>
      </div>
    );
  }

  // RESULT VIEW
  if (result) {
    return (
      <div className="min-h-screen bg-surface-black">
        <header className="border-b border-white/[0.04] bg-surface-black/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <Image
                src="/logo.png"
                alt="Anders Dev"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
              <span className="font-heading text-sm font-bold text-foreground tracking-tight">
                anders<span className="text-brand">dev</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="glass-card text-center mb-8">
            <div
              className={`text-5xl font-heading font-bold mb-2 ${result.passed ? "text-brand" : "text-gray"}`}
            >
              {result.score}%
            </div>
            <p className="text-lg text-foreground font-bold mb-2">
              {result.passed ? "Aprovado!" : "Tente novamente"}
            </p>
            <p className="text-sm text-gray mb-4">{result.message}</p>
            <p className="text-xs text-gray-600">
              {result.correctAnswers} de {result.totalQuestions} questoes
              corretas (minimo: 70%)
            </p>
          </div>

          {/* Question results */}
          <div className="flex flex-col gap-4 mb-8">
            {questions.map((q, qi) => {
              const qResult = result.results.find(
                (r) => r.questionId === q.id,
              );
              const isCorrect = qResult?.correct ?? false;

              return (
                <div
                  key={q.id}
                  className={`glass-card ${isCorrect ? "border-brand/20" : "border-red-500/20"}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCorrect
                          ? "bg-brand/20 text-brand"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {isCorrect ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </span>
                    <p className="text-sm text-foreground font-bold">
                      {qi + 1}. {q.pergunta}
                    </p>
                  </div>
                  {qResult?.explicacao && (
                    <p className="text-xs text-gray ml-9">
                      {qResult.explicacao}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {result.passed && result.certificate ? (
              <Link
                href={`/cursos/certificado/${result.certificate.code}`}
                className="text-sm font-bold text-white bg-brand px-6 py-3 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
              >
                Ver Certificado
              </Link>
            ) : (
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setError("");
                }}
                className="text-sm font-bold text-white bg-brand px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-brand-sm cursor-pointer"
              >
                Tentar Novamente
              </button>
            )}
            <Link
              href={`/cursos/player/${slug}`}
              className="text-sm text-gray hover:text-brand transition-colors no-underline"
            >
              Voltar para o curso
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // QUIZ FORM VIEW
  return (
    <div className="min-h-screen bg-surface-black">
      <header className="border-b border-white/[0.04] bg-surface-black/90 backdrop-blur-md sticky top-0 z-nav">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <Image
                src="/logo.png"
                alt="Anders Dev"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
              <span className="font-heading text-sm font-bold text-foreground tracking-tight hidden sm:inline">
                anders<span className="text-brand">dev</span>
              </span>
            </Link>

            <span className="text-white/[0.08]">|</span>
            <span className="text-sm text-gray">Prova Final</span>
          </div>

          <Link
            href={`/cursos/player/${slug}`}
            className="text-xs text-gray hover:text-brand transition-colors no-underline"
          >
            Voltar ao curso
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full">
            PROVA FINAL
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-4 mb-2">
            {titulo}
          </h1>
          <p className="text-sm text-gray">
            Responda todas as questoes. Nota minima para aprovacao: 70%.
          </p>
        </div>

        {error && (
          <div className="bg-brand/10 border border-brand/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-brand">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6 mb-10">
          {questions.map((q, qi) => (
            <div key={q.id} className="glass-card">
              <p className="text-sm text-foreground font-bold mb-4">
                {qi + 1}. {q.pergunta}
              </p>

              <div className="flex flex-col gap-2">
                {(q.alternativas as string[]).map(
                  (alt: string, altIndex: number) => {
                    const isSelected =
                      answers[String(q.id)] === altIndex;

                    return (
                      <button
                        key={altIndex}
                        onClick={() => selectAnswer(q.id, altIndex)}
                        className={`text-left px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-brand/10 border-brand/30 text-brand"
                            : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-foreground"
                        }`}
                      >
                        <span className="font-mono text-xs mr-2 opacity-60">
                          {String.fromCharCode(65 + altIndex)})
                        </span>
                        {alt}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto bg-brand text-white font-bold py-3 px-10 rounded-full text-sm hover:scale-[1.02] transition-transform shadow-brand-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Enviando..." : "Enviar Prova"}
          </button>

          <p className="text-xs text-gray-600">
            {Object.keys(answers).length} de {questions.length} questoes
            respondidas
          </p>
        </div>
      </main>
    </div>
  );
}
