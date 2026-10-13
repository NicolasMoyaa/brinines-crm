import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
export async function GET(req: NextRequest) {
  const gate = requireAuth(req);
  if (!gate.ok) return gate.response;
  const auth = gate.mode;
  if (!process.env.DATABASE_URL) return NextResponse.json({ stub: true, auth, kpis: [] });
  try {
    const { prisma } = await import("../../../../lib/db");
    const [customerCount, orderCount, interactionsCount] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.interaction.count(),
    ]);
    const revenueAgg = await prisma.order.aggregate({ _sum: { total: true } });
    const revenue = Number(revenueAgg._sum.total || 0);
    const paidCount = await prisma.order.count({ where: { status: "PAGADO" } });
    // ventas por sabor con groupBy (agregación en DB, no findMany completo en memoria)
    const grouped = await prisma.orderItem.groupBy({
      by: ["product_id"],
      _sum: { qty: true },
    });
    const productIds = grouped.map((g) => g.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, nombre: true, sabor: true },
    });
    const nameById = new Map(products.map((p) => [p.id, p.nombre || p.sabor]));
    const ventasSabor = grouped.map((g) => ({
      name: nameById.get(g.product_id) || "—",
      count: g._sum.qty || 0,
    }));
    // ER mock but real would be from IG
    return NextResponse.json({
      stub: false,
      auth,
      kpis: [
        { label: "LEADS TOTAL", value: String(customerCount), delta: "+ real", sub: "Supabase" },
        { label: "ÓRDENES", value: String(orderCount), delta: `${paidCount} pagados`, sub: "Este mes" },
        { label: "REVENUE", value: `$${revenue.toLocaleString('es-AR')}`, delta: "real DB", sub: "ARS sum" },
        { label: "INTERACCIONES", value: String(interactionsCount), delta: "IG+WA", sub: "históricas" },
      ],
      ventasSabor,
      revenue,
      counts: { customerCount, orderCount, interactionsCount },
    });
  } catch (e) {
    return NextResponse.json({ stub: true, auth, error: String(e) }, { status: 200 });
  }
}
