"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyAdminCookie } from "@/lib/security";
import { executar } from "@/lib/ops/sql";

async function exigirAdmin() {
  const c = (await cookies()).get("admin_session")?.value;
  if (!verifyAdminCookie(c)) throw new Error("Sessão expirada. Faça login em /admin.");
}

const STATUS_ALVO = ["novo", "contatado", "respondeu", "publicado", "recusado"];
const STATUS_DISTRIBUICAO = ["rascunho", "aprovado", "publicado", "descartado"];
const STATUS_FILA = ["revisao", "aprovada", "descartada", "pendente", "publicada"];

export async function mudarStatusAlvo(form: FormData) {
  await exigirAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  if (!STATUS_ALVO.includes(status)) return;
  await executar(
    `UPDATE alvos_link SET status = $1, contatado_em = CASE WHEN $1 = 'contatado' THEN now() ELSE contatado_em END, atualizado_em = now() WHERE id = $2`,
    [status, id]
  );
  revalidatePath("/admin/crescimento");
}

export async function mudarStatusDistribuicao(form: FormData) {
  await exigirAdmin();
  const status = String(form.get("status"));
  if (!STATUS_DISTRIBUICAO.includes(status)) return;
  await executar(`UPDATE distribuicao_fila SET status = $1, atualizado_em = now() WHERE id = $2`, [status, Number(form.get("id"))]);
  revalidatePath("/admin/crescimento");
}

export async function mudarStatusFila(form: FormData) {
  await exigirAdmin();
  const status = String(form.get("status"));
  if (!STATUS_FILA.includes(status)) return;
  await executar(`UPDATE fila_conteudo SET status = $1, atualizado_em = now() WHERE id = $2`, [status, Number(form.get("id"))]);
  revalidatePath("/admin/crescimento");
}

/** Venda registrada no servidor — nunca pelo navegador. */
export async function registrarVenda(form: FormData) {
  await exigirAdmin();
  const id = Number(form.get("id"));
  const valor = Number(String(form.get("valor")).replace(/\./g, "").replace(",", "."));
  if (!id || !(valor > 0)) return;
  await executar(`UPDATE leads SET valor_fechado = $1, fechado_em = now(), status = 'won' WHERE id = $2`, [valor, id]);
  await executar(
    `INSERT INTO eventos (nome, path, isca_id, cluster, canal, props, origem_registro)
     SELECT 'venda_registrada', form_page, isca_id, cluster, canal, jsonb_build_object('lead_id', id, 'valor', $1::numeric), 'servidor' FROM leads WHERE id = $2`,
    [valor, id]
  );
  revalidatePath("/admin/crescimento");
}
