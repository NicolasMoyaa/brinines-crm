import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  { sku: "BRN-LIM-01", nombre: "Limón", sabor: "limon", precio: 5500, costo: 2200, stock: 10, activo: true },
  { sku: "BRN-TRA-02", nombre: "Vainilla tradicional", sabor: "vainilla", precio: 5000, costo: 2000, stock: 15, activo: true },
  { sku: "BRN-BAN-03", nombre: "Banana con nuez", sabor: "banana", precio: 6500, costo: 2800, stock: 8, activo: true },
  { sku: "BRN-CHO-04", nombre: "Chocolate doble", sabor: "chocolate", precio: 7000, costo: 3000, stock: 12, activo: true },
  { sku: "BRN-MIX-05", nombre: "Mixto", sabor: "mixto", precio: 6000, costo: 2500, stock: 20, activo: true },
];

async function main() {
  console.log("[seed] iniciando — 5 SKUs Brinines");
  for (const p of PRODUCTS) {
    const r = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { nombre: p.nombre, sabor: p.sabor, precio: p.precio, costo: p.costo, stock: p.stock, activo: p.activo },
      create: p,
    });
    console.log(`[seed] upsert ${r.sku} — ${r.nombre} $${String(r.precio)}`);
  }
  const count = await prisma.product.count();
  console.log(`[seed] OK — ${count} productos en DB`);
}

main()
  .catch((e) => {
    console.error("[seed] error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
