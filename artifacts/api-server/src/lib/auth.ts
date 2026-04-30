import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, gt, and } from "drizzle-orm";
import { db, sessionsTable, usersTable } from "@workspace/db";

export const SESSION_COOKIE = "store_sid";
const SESSION_TTL_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<{ id: string; expiresAt: Date }> {
  const id = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ id, userId, expiresAt });
  return { id, expiresAt };
}

export async function getSessionUser(sessionId: string | undefined) {
  if (!sessionId) return null;
  const now = new Date();
  const rows = await db
    .select({
      userId: sessionsTable.userId,
      user: usersTable,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
    .where(and(eq(sessionsTable.id, sessionId), gt(sessionsTable.expiresAt, now)))
    .limit(1);
  return rows[0]?.user ?? null;
}

export async function destroySession(sessionId: string | undefined): Promise<void> {
  if (!sessionId) return;
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };
}

export function clearedCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  };
}
