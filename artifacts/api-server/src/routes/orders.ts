import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  db,
  ordersTable,
  orderItemsTable,
  cartItemsTable,
  productsTable,
  usersTable,
} from "@workspace/db";
import { CheckoutBody, GetOrderParams } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { serializeOrder } from "../lib/serialize";

const router: IRouter = Router();

async function loadOrder(orderId: number) {
  const [order] = await db
    .select({
      id: ordersTable.id,
      userId: ordersTable.userId,
      total: ordersTable.total,
      status: ordersTable.status,
      shippingName: ordersTable.shippingName,
      shippingAddress: ordersTable.shippingAddress,
      shippingCity: ordersTable.shippingCity,
      shippingZip: ordersTable.shippingZip,
      shippingPhone: ordersTable.shippingPhone,
      createdAt: ordersTable.createdAt,
      userName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(ordersTable)
    .innerJoin(usersTable, eq(usersTable.id, ordersTable.userId))
    .where(eq(ordersTable.id, orderId))
    .limit(1);
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  return serializeOrder({ ...order, items });
}

router.get("/orders", requireAuth, async (req, res): Promise<void> => {
  const orders = await db
    .select({
      id: ordersTable.id,
      userId: ordersTable.userId,
      total: ordersTable.total,
      status: ordersTable.status,
      shippingName: ordersTable.shippingName,
      shippingAddress: ordersTable.shippingAddress,
      shippingCity: ordersTable.shippingCity,
      shippingZip: ordersTable.shippingZip,
      shippingPhone: ordersTable.shippingPhone,
      createdAt: ordersTable.createdAt,
      userName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(ordersTable)
    .innerJoin(usersTable, eq(usersTable.id, ordersTable.userId))
    .where(eq(ordersTable.userId, req.user!.id))
    .orderBy(desc(ordersTable.createdAt));

  const result = await Promise.all(
    orders.map(async (o) => {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, o.id));
      return serializeOrder({ ...o, items });
    }),
  );

  res.json(result);
});

router.post("/orders/checkout", requireAuth, async (req, res): Promise<void> => {
  const parsed = CheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const items = await db
    .select({
      cartId: cartItemsTable.id,
      quantity: cartItemsTable.quantity,
      product: productsTable,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, cartItemsTable.productId))
    .where(eq(cartItemsTable.userId, req.user!.id));

  if (items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0,
  );

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId: req.user!.id,
      total: total.toFixed(2),
      status: "pending",
      shippingName: parsed.data.shippingName,
      shippingAddress: parsed.data.shippingAddress,
      shippingCity: parsed.data.shippingCity,
      shippingZip: parsed.data.shippingZip,
      shippingPhone: parsed.data.shippingPhone,
    })
    .returning();

  await db.insert(orderItemsTable).values(
    items.map((i) => ({
      orderId: order.id,
      productId: i.product.id,
      productName: i.product.name,
      productImageUrl: i.product.imageUrl,
      quantity: i.quantity,
      price: i.product.price,
    })),
  );

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.user!.id));

  const result = await loadOrder(order.id);
  res.json(result);
});

router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const parsed = GetOrderParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.id, parsed.data.id),
        req.user!.role === "admin" ? undefined : eq(ordersTable.userId, req.user!.id),
      ),
    )
    .limit(1);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const result = await loadOrder(order.id);
  res.json(result);
});

export default router;
