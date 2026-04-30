import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { SubmitContactMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(contactMessagesTable).values(parsed.data);
  res.json({ success: true, message: "Thanks — we'll be in touch soon." });
});

export default router;
