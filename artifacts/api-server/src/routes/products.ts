import { Router, type IRouter } from "express";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db, productsTable, reviewsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";
import { serializeProduct, type ProductWithRating } from "../lib/serialize";

const router: IRouter = Router();

function productSelect() {
  return {
    id: productsTable.id,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    category: productsTable.category,
    imageUrl: productsTable.imageUrl,
    stock: productsTable.stock,
    featured: productsTable.featured,
    createdAt: productsTable.createdAt,
    avgRating: sql<number | null>`COALESCE(AVG(${reviewsTable.rating}), 0)`.as("avg_rating"),
    reviewCount: sql<number>`COUNT(${reviewsTable.id})`.as("review_count"),
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, sort } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.category, category));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));

  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = asc(productsTable.price);
      break;
    case "price_desc":
      orderBy = desc(productsTable.price);
      break;
    case "rating":
      orderBy = desc(sql`avg_rating`);
      break;
    default:
      orderBy = desc(productsTable.createdAt);
  }

  const rows = await db
    .select(productSelect())
    .from(productsTable)
    .leftJoin(reviewsTable, eq(reviewsTable.productId, productsTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(productsTable.id)
    .orderBy(orderBy);

  res.json(rows.map((r) => serializeProduct(r as ProductWithRating)));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select(productSelect())
    .from(productsTable)
    .leftJoin(reviewsTable, eq(reviewsTable.productId, productsTable.id))
    .where(eq(productsTable.featured, true))
    .groupBy(productsTable.id)
    .orderBy(desc(productsTable.createdAt))
    .limit(8);

  res.json(rows.map((r) => serializeProduct(r as ProductWithRating)));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db
    .select(productSelect())
    .from(productsTable)
    .leftJoin(reviewsTable, eq(reviewsTable.productId, productsTable.id))
    .where(eq(productsTable.id, parsed.data.id))
    .groupBy(productsTable.id)
    .limit(1);

  const product = rows[0];
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(serializeProduct(product as ProductWithRating));
});

export default router;
