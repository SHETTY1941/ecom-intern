import type { Request, Response, NextFunction } from "express";
import { getSessionUser, SESSION_COOKIE } from "../lib/auth";
import type { User } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const sid = req.cookies?.[SESSION_COOKIE] as string | undefined;
  const user = await getSessionUser(sid);
  if (user) req.user = user;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
