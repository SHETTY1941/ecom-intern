import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      name: productsTable.category,
      productCount: sql<number>`COUNT(*)::int`,
    })
    .from(productsTable)
    .groupBy(productsTable.category)
    .orderBy(productsTable.category);

  res.json(
    rows.map((r) => ({
      name: r.name,
      productCount: Number(r.productCount),
    })),
  );
});

export default router;
