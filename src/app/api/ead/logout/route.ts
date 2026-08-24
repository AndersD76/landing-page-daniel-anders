import { NextRequest, NextResponse } from "next/server";
import { clearEadCookie } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";

export async function POST(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const response = NextResponse.json({
    success: true,
    message: "Sessão encerrada.",
  });

  clearEadCookie(response);
  return response;
}
