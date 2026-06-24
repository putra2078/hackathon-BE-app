const prisma = require("../internal/pkg/prisma");

async function main() {
  console.log("🌱 Start seeding...");

  // Clear existing products
  await prisma.product.deleteMany();
  console.log("Cleaned up existing products.");

  const products = [
    {
      code: "PRD001",
      name: "Laptop Asus ROG",
      description: "Gaming laptop with high performance",
      category: "Electronics",
      buyPrice: 13000000,
      sellPrice: 15000000,
      stock: 10,
    },
    {
      code: "PRD002",
      name: "Mechanical Keyboard",
      description: "RGB Backlit mechanical keyboard with blue switches",
      category: "Accessories",
      buyPrice: 600000,
      sellPrice: 850000,
      stock: 25,
    },
    {
      code: "PRD003",
      name: "Gaming Mouse",
      description: "Wireless gaming mouse with 16000 DPI",
      category: "Accessories",
      buyPrice: 300000,
      sellPrice: 450000,
      stock: 50,
    },
    {
      code: "PRD004",
      name: "UltraWide Monitor 34\"",
      description: "4K resolution ultrawide monitor for productivity",
      category: "Electronics",
      buyPrice: 6500000,
      sellPrice: 7500000,
      stock: 5,
    },
    {
      code: "PRD005",
      name: "USB-C Hub 7-in-1",
      description: "Multiport adapter for MacBook and Windows laptops",
      category: "Accessories",
      buyPrice: 200000,
      sellPrice: 350000,
      stock: 100,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.name} (ID: ${created.id})`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
