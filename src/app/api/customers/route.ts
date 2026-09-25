import { NextResponse } from "next/server";
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ stub: true, data: [] });
  try {
    const { prisma } = await import("../../../../lib/db");
    const customers = await prisma.customer.findMany({ orderBy: { ltv: "desc" }, take: 50 });
    // map to UI shape
    const data = customers.map((c: any) => ({
      id: c.id,
      name: c.name || c.phone,
      phone: c.phone,
      ig_handle: c.ig_handle,
      city: c.city,
      tag: c.tags?.[0] || c.segment,
      ltv: `$${Number(c.ltv).toLocaleString('es-AR')}`,
      orders: c.total_orders,
      last: c.last_order ? new Date(c.last_order).toLocaleDateString('es-AR') : '—',
      status: c.segment,
      avatar: (c.name || '??').slice(0,2).toUpperCase(),
    }));
    return NextResponse.json({ stub: false, data, count: data.length });
  } catch (e) {
    return NextResponse.json({ stub: true, error: String(e), data: [] }, { status: 200 });
  }
}
