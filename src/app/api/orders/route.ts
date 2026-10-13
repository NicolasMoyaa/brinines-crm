import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { label, ORDER_STATUS_LABEL, ORDER_SOURCE_LABEL } from "../../../../lib/prisma-labels";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const gate = requireAuth(req);
  if (!gate.ok) return gate.response;
  const auth = gate.mode;
  if (!process.env.DATABASE_URL) return NextResponse.json({ stub: true, auth, data: [] });
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
    );
    const { prisma } = await import("../../../../lib/db");
    const [total, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const data = orders.map((o: any) => ({
      id: o.id,
      name: o.customer?.name || o.customer?.phone || 'Cliente',
      initials: (o.customer?.name || '??').slice(0,2).toUpperCase(),
      phone: o.customer?.phone,
      flavor: o.items.map((it:any)=> `${it.qty}x ${it.product?.nombre || it.product?.sabor}`).join(', ') || '—',
      amount: `$${Number(o.total).toLocaleString('es-AR')}`,
      total: Number(o.total),
      status: label(ORDER_STATUS_LABEL, o.status),
      time: new Date(o.created_at).toLocaleDateString('es-AR'),
      source: label(ORDER_SOURCE_LABEL, o.source),
    }));
    return NextResponse.json({
      stub: false,
      auth,
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    return NextResponse.json({ stub: true, auth, error: String(e), data: [] }, { status: 200 });
  }
}
