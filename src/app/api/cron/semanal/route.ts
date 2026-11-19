import { NextRequest, NextResponse } from "next/server";
import { cronAutorizado } from "@/lib/ops/cron-auth";
import { jobSemanal } from "@/lib/ops/jobs";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!cronAutorizado(req)) return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  return NextResponse.json({ ok: true, etapas: await jobSemanal() });
}
