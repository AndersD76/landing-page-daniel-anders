import { NextRequest, NextResponse } from "next/server";
import { getPagina } from "@/lib/conteudo";
import { downloadValido } from "@/lib/download";

/**
 * Arquivo do modelo, gerado do mesmo dado da prévia na página:
 *   planilha  → CSV com ";" e BOM (abre direto no Excel em pt-BR)
 *   checklist → CSV grupo;item;feito
 *   documento → texto puro com os blocos
 * Só com link assinado (vai no e-mail e na tela depois do cadastro).
 */

function csv(linhas: string[][]): string {
  const esc = (v: string) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return "﻿" + linhas.map((l) => l.map((c) => esc(c ?? "")).join(";")).join("\r\n") + "\r\n";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const expira = Number(req.nextUrl.searchParams.get("e"));
  const token = req.nextUrl.searchParams.get("t") ?? "";
  if (!downloadValido(slug, expira, token)) {
    return NextResponse.redirect(new URL(`/modelos/${slug}#baixar`, req.url));
  }
  const p = getPagina("modelo", slug);
  if (!p?.modelo || !p.qualidade.publicavel) return new NextResponse("Modelo não encontrado", { status: 404 });

  const m = p.modelo;
  let corpo: string;
  let tipo = "text/csv; charset=utf-8";
  let ext = "csv";
  if (m.formato === "planilha" && m.colunas) {
    corpo = csv([m.colunas, ...(m.linhasExemplo ?? [])]);
  } else if (m.formato === "checklist" && m.itens) {
    corpo = csv([["Grupo", "Item", "Feito (sim/não)", "Observação"], ...m.itens.map((i) => [i.grupo, i.item, "", ""])]);
  } else {
    tipo = "text/plain; charset=utf-8";
    ext = "txt";
    corpo =
      `${p.h1}\n${"=".repeat(p.h1.length)}\n\n` +
      (m.documento ?? []).map((b) => `${b.titulo}\n${"-".repeat(b.titulo.length)}\n${b.texto}\n`).join("\n") +
      `\nModelo de andersdev.com.br${p.url} — revisado em ${p.revisadoEm}.\n`;
  }
  return new NextResponse(corpo, {
    headers: {
      "Content-Type": tipo,
      "Content-Disposition": `attachment; filename="${slug}.${ext}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
