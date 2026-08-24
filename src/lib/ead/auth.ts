// NOTA: instalar dependencias antes de usar:
//   npm install jsonwebtoken bcryptjs
//   npm install -D @types/jsonwebtoken @types/bcryptjs

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";
const COOKIE_NAME = "ead_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET nao configurado");
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export function createToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, getJwtSecret(), {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  return decoded as TokenPayload;
}

export function getEadUser(
  request: NextRequest,
): TokenPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function setEadCookie(
  response: Response & { cookies: { set: Function } },
  token: string,
) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
}

export function clearEadCookie(
  response: Response & { cookies: { set: Function } },
) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  });
}
