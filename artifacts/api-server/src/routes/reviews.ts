import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, reviewsTable, usersTable, productsTable } from "@workspace/db";
import {
  ListProductReviewsParams,
  CreateProductReviewParams,
  CreateProductReviewBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { serializeReview } from "../lib/serialize";

const router: IRouter = Router();

router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const parsed = ListProductReviewsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db
    .select({
      id: reviewsTable.id,
      productId: reviewsTable.productId,
      userId: reviewsTable.userId,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      createdAt: reviewsTable.createdAt,
      userName: usersTable.name,
    })
    .from(reviewsTable)
    .innerJoin(usersTable, eq(usersTable.id, reviewsTable.userId))
    .where(eq(reviewsTable.productId, parsed.data.id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(rows.map(serializeReview));
});

router.post("/products/:id/reviews", requireAuth, async (req, res): Promise<void> => {
  const params = CreateProductReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateProductReviewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .limit(1);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      productId: params.data.id,
      userId: req.user!.id,
      rating: body.data.rating,
      comment: body.data.comment,
    })
    .returning();

  res.json(
    serializeReview({
      ...review,
      userName: req.user!.name,
    }),
  );
});

export default router;
