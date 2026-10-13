import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { label, SEGMENT_LABEL } from "../../../../lib/prisma-labels";

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
    const [total, customers] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.findMany({
        orderBy: { ltv: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    // map to UI shape (segment enum -> etiqueta histórica)
    const data = customers.map((c: any) => {
      const segment = label(SEGMENT_LABEL, c.segment);
      return {
      id: c.id,
      name: c.name || c.phone,
      phone: c.phone,
      ig_handle: c.ig_handle,
      city: c.city,
      tag: c.tags?.[0] || segment,
      ltv: `$${Number(c.ltv).toLocaleString('es-AR')}`,
      orders: c.total_orders,
      last: c.last_order ? new Date(c.last_order).toLocaleDateString('es-AR') : '—',
      status: segment,
      avatar: (c.name || '??').slice(0,2).toUpperCase(),
      };
    });
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
