import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  sessionCookieOptions,
  clearedCookieOptions,
  SESSION_COOKIE,
} from "../lib/auth";
import { serializeUser } from "../lib/serialize";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, email, password } = parsed.data;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email: email.toLowerCase(), passwordHash, role: "user" })
    .returning();

  const session = await createSession(user.id);
  res.cookie(SESSION_COOKIE, session.id, sessionCookieOptions(session.expiresAt));
  res.json(serializeUser(user));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const session = await createSession(user.id);
  res.cookie(SESSION_COOKIE, session.id, sessionCookieOptions(session.expiresAt));
  res.json(serializeUser(user));
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const sid = req.cookies?.[SESSION_COOKIE] as string | undefined;
  await destroySession(sid);
  res.cookie(SESSION_COOKIE, "", clearedCookieOptions());
  res.json({ success: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  res.json({ user: req.user ? serializeUser(req.user) : null });
});

export default router;
