import { timingSafeEqual, createHmac } from "crypto";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function verifyToken(provided: string | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  if (provided.length !== expected.length) return false;

  const a = Buffer.from(provided, "utf-8");
  const b = Buffer.from(expected, "utf-8");
  return timingSafeEqual(a, b);
}

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) rateLimitStore.delete(key);
  }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  cleanup(windowMs);
  const now = Date.now();
  const entry = rateLimitStore.get(key) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) return false;

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);
  return true;
}

export function generateAdminToken(password: string): string {
  return createHmac("sha256", password).update("admin-session").digest("hex");
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!cookieValue || !adminPassword) return false;
  const expected = generateAdminToken(adminPassword);
  return verifyToken(cookieValue, expected);
}

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.CRON_SECRET || process.env.ADMIN_PASSWORD || "fallback-key";
  return createHmac("sha256", secret).update(`unsub:${email}`).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email);
  return verifyToken(token, expected);
}

export function getClientIp(req: { headers: { get(name: string): string | null } }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",").pop()?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}
