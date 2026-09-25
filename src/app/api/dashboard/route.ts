import { NextResponse } from "next/server";
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ stub: true, kpis: [] });
  try {
    const { prisma } = await import("../../../../lib/db");
    const [customerCount, orderCount, interactionsCount] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.interaction.count(),
    ]);
    const revenueAgg = await prisma.order.aggregate({ _sum: { total: true } });
    const revenue = Number(revenueAgg._sum.total || 0);
    const paidCount = await prisma.order.count({ where: { status: "Pagado" } });
    // ventas por sabor desde OrderItem
    const items = await prisma.orderItem.findMany({ include: { product: true } });
    const bySabor: Record<string, number> = {};
    for (const it of items as any[]) {
      const sabor = it.product?.nombre || it.product?.sabor || "—";
      bySabor[sabor] = (bySabor[sabor] || 0) + (it.qty || 0);
    }
    const ventasSabor = Object.entries(bySabor).map(([name, count]) => ({ name, count }));
    // ER mock but real would be from IG
    return NextResponse.json({
      stub: false,
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
    return NextResponse.json({ stub: true, error: String(e) }, { status: 200 });
  }
}
