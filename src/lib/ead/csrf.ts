import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica o header Origin/Referer contra o host esperado.
 * Retorna null se a requisição é legítima, ou um NextResponse 403 caso contrário.
 *
 * Uso nos route handlers:
 *   const csrfError = verifyCsrf(req);
 *   if (csrfError) return csrfError;
 */
export function verifyCsrf(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Determinar o host esperado a partir do header Host da requisição
  const host = req.headers.get("host");
  if (!host) {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 403 },
    );
  }

  const allowedOrigins = new Set<string>();
  // Aceitar tanto http quanto https para o host atual
  allowedOrigins.add(`https://${host}`);
  allowedOrigins.add(`http://${host}`);

  // Adicionar domínio configurado se existir
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    try {
      const parsed = new URL(baseUrl);
      allowedOrigins.add(parsed.origin);
    } catch {
      /* ignore invalid URL */
    }
  }

  // Verificar Origin (preferido) ou Referer como fallback
  const source = origin || (referer ? new URL(referer).origin : null);

  if (!source) {
    // Requisições sem Origin/Referer (ex: curl, server-to-server)
    // são bloqueadas para endpoints de browser
    return NextResponse.json(
      { error: "Requisição inválida: origem não identificada." },
      { status: 403 },
    );
  }

  if (!allowedOrigins.has(source)) {
    return NextResponse.json(
      { error: "Requisição inválida: origem não permitida." },
      { status: 403 },
    );
  }

  return null;
}
