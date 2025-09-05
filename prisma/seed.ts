import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Latest electronics and gadgets",
      image: "/images/categories/electronics.jpg",
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel",
      image: "/images/categories/clothing.jpg",
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home-garden" },
    update: {},
    create: {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Home improvement and garden supplies",
      image: "/images/categories/home.jpg",
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create sample products
  const products = [
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Latest iPhone with titanium design",
      price: 999.99,
      comparePrice: 1099.99,
      sku: "IPHONE15PRO",
      stock: 50,
      images: ["/images/products/iphone-15-pro-1.jpg", "/images/products/iphone-15-pro-2.jpg"],
      featured: true,
      categoryId: electronics.id,
    },
    {
      name: "MacBook Air M2",
      slug: "macbook-air-m2",
      description: "Powerful laptop with M2 chip",
      price: 1199.99,
      sku: "MBA-M2",
      stock: 30,
      images: ["/images/products/macbook-air-1.jpg"],
      featured: true,
      categoryId: electronics.id,
    },
    {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-tshirt",
      description: "Comfortable 100% cotton t-shirt",
      price: 29.99,
      sku: "COTTON-TEE",
      stock: 100,
      images: ["/images/products/tshirt-1.jpg"],
      categoryId: clothing.id,
    },
    {
      name: "Smart Home Hub",
      slug: "smart-home-hub",
      description: "Control your smart home devices",
      price: 149.99,
      sku: "SMART-HUB",
      stock: 25,
      images: ["/images/products/smart-hub-1.jpg"],
      categoryId: home.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Database seeded successfully");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
