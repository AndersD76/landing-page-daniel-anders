import { NextRequest, NextResponse } from "next/server";
import { verifyToken, rateLimit, getClientIp, generateAdminToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  try {
    const { password } = await req.json();
    if (!verifyToken(password, process.env.ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = generateAdminToken(password);
    const res = NextResponse.json({ success: true });

    res.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
