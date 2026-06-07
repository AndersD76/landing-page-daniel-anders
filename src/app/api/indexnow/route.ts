import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/security";
import sitemap from "@/app/sitemap";

const INDEXNOW_KEY = "db16d61e067044d48b75f2edbbe3fd1a";
const HOST = "andersdev.com.br";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const token = authHeader?.replace("Bearer ", "");
  if (!verifyToken(token, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urls = sitemap().map((entry) => entry.url);

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return NextResponse.json({
    success: res.ok,
    status: res.status,
    urlCount: urls.length,
  });
}
