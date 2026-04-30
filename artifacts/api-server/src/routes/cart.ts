import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import {
  db,
  cartItemsTable,
  productsTable,
  reviewsTable,
} from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  RemoveCartItemParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { serializeCartItem, type ProductWithRating } from "../lib/serialize";

const router: IRouter = Router();

async function getCartForUser(userId: number) {
  const rows = await db
    .select({
      id: cartItemsTable.id,
      userId: cartItemsTable.userId,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      cartCreatedAt: cartItemsTable.createdAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        category: productsTable.category,
        imageUrl: productsTable.imageUrl,
        stock: productsTable.stock,
        featured: productsTable.featured,
        createdAt: productsTable.createdAt,
        avgRating: sql<number | null>`COALESCE(AVG(${reviewsTable.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviewsTable.id})`,
      },
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, cartItemsTable.productId))
    .leftJoin(reviewsTable, eq(reviewsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.userId, userId))
    .groupBy(cartItemsTable.id, productsTable.id)
    .orderBy(cartItemsTable.createdAt);

  const items = rows.map((r) =>
    serializeCartItem({
      id: r.id,
      userId: r.userId,
      productId: r.productId,
      quantity: r.quantity,
      createdAt: r.cartCreatedAt,
      product: r.product as ProductWithRating,
    }),
  );

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    itemCount,
  };
}

router.get("/cart", requireAuth, async (req, res): Promise<void> => {
  res.json(await getCartForUser(req.user!.id));
});

router.post("/cart", requireAuth, async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { productId, quantity } = parsed.data;

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId))
    .limit(1);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(eq(cartItemsTable.userId, req.user!.id), eq(cartItemsTable.productId, productId)),
    )
    .limit(1);

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db
      .insert(cartItemsTable)
      .values({ userId: req.user!.id, productId, quantity });
  }

  res.json(await getCartForUser(req.user!.id));
});

router.patch("/cart/:itemId", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateCartItemBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(eq(cartItemsTable.id, params.data.itemId), eq(cartItemsTable.userId, req.user!.id)),
    )
    .limit(1);
  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  await db
    .update(cartItemsTable)
    .set({ quantity: body.data.quantity })
    .where(eq(cartItemsTable.id, item.id));

  res.json(await getCartForUser(req.user!.id));
});

router.delete("/cart/:itemId", requireAuth, async (req, res): Promise<void> => {
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(eq(cartItemsTable.id, params.data.itemId), eq(cartItemsTable.userId, req.user!.id)),
    );

  res.json(await getCartForUser(req.user!.id));
});

router.delete("/cart", requireAuth, async (req, res): Promise<void> => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.user!.id));
  res.json(await getCartForUser(req.user!.id));
});

export default router;
