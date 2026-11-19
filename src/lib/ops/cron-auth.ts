import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/security";

/** Cron só com Authorization: Bearer <CRON_SECRET>. */
export function cronAutorizado(req: NextRequest): boolean {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) return false;
  return verifyToken(req.headers.get("authorization")?.replace("Bearer ", ""), segredo);
}
