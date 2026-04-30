import {
  db,
  usersTable,
  productsTable,
  reviewsTable,
} from "@workspace/db";
import { hashPassword } from "./lib/auth";

const ADMIN_EMAIL = "admin@localstore.test";
const ADMIN_PASSWORD = "admin123";

const SAMPLE_USERS = [
  { name: "Maya Patel", email: "maya@example.com", password: "password123" },
  { name: "Ben Cole", email: "ben@example.com", password: "password123" },
  { name: "Sara Lin", email: "sara@example.com", password: "password123" },
];

const PRODUCTS = [
  {
    name: "Cold-Pressed Olive Oil",
    description:
      "A small-batch extra virgin olive oil pressed from hand-picked olives. Buttery, peppery, and perfect for finishing bread, salads, or roasted vegetables. 500ml glass bottle.",
    price: 18.5,
    category: "Pantry",
    imageUrl: "/images/products/olive-oil.png",
    stock: 24,
    featured: true,
  },
  {
    name: "Wildflower Honey",
    description:
      "Raw, unfiltered honey from a beekeeper just outside town. Floral and gently sweet — drizzle over toast, stir into tea, or eat by the spoonful. 12oz jar.",
    price: 12.0,
    category: "Pantry",
    imageUrl: "/images/products/honey-jar.png",
    stock: 30,
    featured: true,
  },
  {
    name: "Bronze-Cut Spaghetti",
    description:
      "Slow-dried bronze-cut spaghetti with a beautifully rough texture that holds onto sauce. Made with stone-milled durum wheat. 500g.",
    price: 6.5,
    category: "Pantry",
    imageUrl: "/images/products/pasta-box.png",
    stock: 40,
    featured: false,
  },
  {
    name: "Country Sourdough Loaf",
    description:
      "A naturally leavened sourdough with a crackling crust and an open, tender crumb. Baked fresh every morning with stone-milled flour and sea salt.",
    price: 9.0,
    category: "Bakery",
    imageUrl: "/images/products/sourdough-loaf.png",
    stock: 18,
    featured: true,
  },
  {
    name: "Butter Croissants (3-pack)",
    description:
      "Flaky, golden, all-butter croissants laminated by hand. Best enjoyed warm with a cup of coffee. Sold as a pack of three.",
    price: 11.0,
    category: "Bakery",
    imageUrl: "/images/products/croissants.png",
    stock: 22,
    featured: true,
  },
  {
    name: "Brown Butter Chocolate Chip Cookies",
    description:
      "Crispy at the edges, soft in the middle, and packed with pools of dark chocolate. Sold as a pack of six.",
    price: 8.5,
    category: "Bakery",
    imageUrl: "/images/products/chocolate-chip-cookies.png",
    stock: 26,
    featured: false,
  },
  {
    name: "Vine-Ripened Tomatoes",
    description:
      "Sweet, juicy on-the-vine tomatoes from a nearby farm. Picked at peak ripeness — perfect for salads, sandwiches, or a quick sauce. Per pound.",
    price: 4.75,
    category: "Produce",
    imageUrl: "/images/products/fresh-tomatoes.png",
    stock: 35,
    featured: true,
  },
  {
    name: "Farm Fresh Brown Eggs",
    description:
      "Half a dozen pasture-raised brown eggs from happy hens at a local family farm. Rich golden yolks and great flavor.",
    price: 7.0,
    category: "Produce",
    imageUrl: "/images/products/fresh-eggs.png",
    stock: 50,
    featured: true,
  },
  {
    name: "Crisp Apple Basket",
    description:
      "A small mixed basket of seasonal red and green apples — sweet, tart, and good for snacking, baking, or lunchboxes. Approximately 2 lbs.",
    price: 9.5,
    category: "Produce",
    imageUrl: "/images/products/apples-basket.png",
    stock: 28,
    featured: false,
  },
  {
    name: "Walnut Cutting Board",
    description:
      "A thick, handmade cutting board crafted from local walnut wood. Easy on knife edges and built to last for years of daily use.",
    price: 64.0,
    category: "Kitchen",
    imageUrl: "/images/products/wooden-cutting-board.png",
    stock: 12,
    featured: true,
  },
];

const REVIEW_SAMPLES: Array<{ rating: number; comment: string }> = [
  { rating: 5, comment: "Absolutely delicious. Will definitely buy again!" },
  { rating: 4, comment: "Really good quality and fast pickup. Recommended." },
  { rating: 5, comment: "Tastes like the real thing — exactly what I was hoping for." },
  { rating: 4, comment: "Lovely flavor, slightly more than I expected to pay but worth it." },
  { rating: 5, comment: "Local store at its best. So glad I tried this." },
];

async function seed(): Promise<void> {
  console.log("Seeding database...");

  const existingAdmin = await db.select().from(usersTable).limit(1);
  if (existingAdmin.length > 0) {
    console.log("Database already has data. Skipping seed.");
    return;
  }

  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const [admin] = await db
    .insert(usersTable)
    .values({
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      name: "Store Owner",
      role: "admin",
    })
    .returning();
  console.log(`Created admin: ${admin.email}`);

  const sampleUserIds: number[] = [];
  for (const u of SAMPLE_USERS) {
    const hash = await hashPassword(u.password);
    const [created] = await db
      .insert(usersTable)
      .values({
        name: u.name,
        email: u.email,
        passwordHash: hash,
        role: "user",
      })
      .returning();
    sampleUserIds.push(created.id);
  }
  console.log(`Created ${sampleUserIds.length} sample customers`);

  const insertedProducts = await db
    .insert(productsTable)
    .values(
      PRODUCTS.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price.toFixed(2),
        category: p.category,
        imageUrl: p.imageUrl,
        stock: p.stock,
        featured: p.featured,
      })),
    )
    .returning();
  console.log(`Created ${insertedProducts.length} products`);

  let reviewCount = 0;
  for (const product of insertedProducts) {
    const numReviews = (product.id % 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      const sample = REVIEW_SAMPLES[(product.id + i) % REVIEW_SAMPLES.length];
      const userId = sampleUserIds[(product.id + i) % sampleUserIds.length];
      await db.insert(reviewsTable).values({
        productId: product.id,
        userId,
        rating: sample.rating,
        comment: sample.comment,
      });
      reviewCount++;
    }
  }
  console.log(`Created ${reviewCount} reviews`);

  console.log("Seed complete!");
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
