import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { verifyToken, verifyAdminCookie, rateLimit, getClientIp } from "@/lib/security";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`admin:${ip}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const bearerToken = req.headers.get("authorization")?.replace("Bearer ", "");
  const cookie = req.cookies.get("admin_session")?.value;

  if (!verifyAdminCookie(cookie) && !verifyToken(bearerToken, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    return NextResponse.json(allLeads);
  } catch (err) {
    console.error("Admin leads error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
