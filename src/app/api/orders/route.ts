import { NextResponse } from "next/server";
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ stub: true, data: [] });
  try {
    const { prisma } = await import("../../../../lib/db");
    const orders = await prisma.order.findMany({ include: { customer: true, items: { include: { product: true } } }, orderBy: { created_at: "desc" }, take: 50 });
    const data = orders.map((o: any) => ({
      id: o.id,
      name: o.customer?.name || o.customer?.phone || 'Cliente',
      initials: (o.customer?.name || '??').slice(0,2).toUpperCase(),
      phone: o.customer?.phone,
      flavor: o.items.map((it:any)=> `${it.qty}x ${it.product?.nombre || it.product?.sabor}`).join(', ') || '—',
      amount: `$${Number(o.total).toLocaleString('es-AR')}`,
      total: Number(o.total),
      status: o.status,
      time: new Date(o.created_at).toLocaleDateString('es-AR'),
      source: o.source,
    }));
    return NextResponse.json({ stub: false, data });
  } catch (e) {
    return NextResponse.json({ stub: true, error: String(e), data: [] }, { status: 200 });
  }
}
