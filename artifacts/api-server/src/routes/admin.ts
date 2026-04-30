import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import {
  db,
  productsTable,
  ordersTable,
  orderItemsTable,
  usersTable,
} from "@workspace/db";
import {
  CreateAdminProductBody,
  UpdateAdminProductParams,
  UpdateAdminProductBody,
  DeleteAdminProductParams,
  UpdateAdminOrderStatusParams,
  UpdateAdminOrderStatusBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { serializeOrder } from "../lib/serialize";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [revenueRow] = await db
    .select({
      totalRevenue: sql<string>`COALESCE(SUM(${ordersTable.total}), 0)`,
      totalOrders: sql<number>`COUNT(*)::int`,
    })
    .from(ordersTable);

  const [productsRow] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(productsTable);

  const [customersRow] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "user"));

  const ordersByStatus = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const recentOrdersRows = await db
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
    .orderBy(desc(ordersTable.createdAt))
    .limit(5);

  const recentOrders = await Promise.all(
    recentOrdersRows.map(async (o) => {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, o.id));
      return serializeOrder({ ...o, items });
    }),
  );

  const topProducts = await db
    .select({
      productId: orderItemsTable.productId,
      productName: orderItemsTable.productName,
      unitsSold: sql<number>`SUM(${orderItemsTable.quantity})::int`,
      revenue: sql<string>`SUM(${orderItemsTable.quantity} * ${orderItemsTable.price})`,
    })
    .from(orderItemsTable)
    .groupBy(orderItemsTable.productId, orderItemsTable.productName)
    .orderBy(desc(sql`SUM(${orderItemsTable.quantity})`))
    .limit(5);

  res.json({
    totalRevenue: Number(revenueRow.totalRevenue ?? 0),
    totalOrders: Number(revenueRow.totalOrders ?? 0),
    totalProducts: Number(productsRow?.count ?? 0),
    totalCustomers: Number(customersRow?.count ?? 0),
    ordersByStatus: ordersByStatus.map((o) => ({
      status: o.status,
      count: Number(o.count),
    })),
    recentOrders,
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      unitsSold: Number(p.unitsSold),
      revenue: Number(p.revenue ?? 0),
    })),
  });
});

router.post("/admin/products", async (req, res): Promise<void> => {
  const parsed = CreateAdminProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      ...parsed.data,
      price: parsed.data.price.toFixed(2),
    })
    .returning();
  res.json({
    ...product,
    price: Number(product.price),
    avgRating: 0,
    reviewCount: 0,
    createdAt: product.createdAt.toISOString(),
  });
});

router.patch("/admin/products/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateAdminProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...body.data };
  if (typeof body.data.price === "number") {
    updates.price = body.data.price.toFixed(2);
  }

  const [product] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({
    ...product,
    price: Number(product.price),
    avgRating: 0,
    reviewCount: 0,
    createdAt: product.createdAt.toISOString(),
  });
});

router.delete("/admin/products/:id", async (req, res): Promise<void> => {
  const params = DeleteAdminProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (result.length === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ success: true });
});

router.get("/admin/orders", async (_req, res): Promise<void> => {
  const rows = await db
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
    .orderBy(desc(ordersTable.createdAt));

  const result = await Promise.all(
    rows.map(async (o) => {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, o.id));
      return serializeOrder({ ...o, items });
    }),
  );
  res.json(result);
});

router.patch("/admin/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateAdminOrderStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, order.userId))
    .limit(1);

  res.json(
    serializeOrder({
      ...order,
      items,
      userName: user?.name ?? "",
      userEmail: user?.email ?? "",
    }),
  );
});

export default router;
