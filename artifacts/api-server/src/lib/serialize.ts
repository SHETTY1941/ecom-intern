import type { User, Product, Order, OrderItem, Review, CartItem } from "@workspace/db";

export function serializeUser(u: User) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  };
}

export type ProductWithRating = Product & {
  avgRating: number | null;
  reviewCount: number;
};

export function serializeProduct(p: ProductWithRating) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    imageUrl: p.imageUrl,
    stock: p.stock,
    featured: p.featured,
    avgRating: p.avgRating ? Number(Number(p.avgRating).toFixed(2)) : 0,
    reviewCount: Number(p.reviewCount ?? 0),
    createdAt: p.createdAt.toISOString(),
  };
}

export function serializeReview(r: Review & { userName: string }) {
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  };
}

export function serializeCartItem(item: CartItem & { product: ProductWithRating }) {
  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: serializeProduct(item.product),
  };
}

export function serializeOrderItem(i: OrderItem) {
  return {
    id: i.id,
    productId: i.productId,
    productName: i.productName,
    productImageUrl: i.productImageUrl,
    quantity: i.quantity,
    price: Number(i.price),
  };
}

export function serializeOrder(
  o: Order & { items: OrderItem[]; userName: string; userEmail: string },
) {
  return {
    id: o.id,
    userId: o.userId,
    userName: o.userName,
    userEmail: o.userEmail,
    total: Number(o.total),
    status: o.status,
    shippingName: o.shippingName,
    shippingAddress: o.shippingAddress,
    shippingCity: o.shippingCity,
    shippingZip: o.shippingZip,
    shippingPhone: o.shippingPhone,
    items: o.items.map(serializeOrderItem),
    createdAt: o.createdAt.toISOString(),
  };
}
