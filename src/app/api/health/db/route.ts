import { NextResponse } from "next/server";

export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL);
  if (!hasUrl) {
    return NextResponse.json({ status: "stub", configured: false, products: 0, message: "DATABASE_URL missing — stub" });
  }
  try {
    const { prisma } = await import("../../../../../lib/db");
    const count = await prisma.product.count();
    return NextResponse.json({ status: "ok", configured: true, products: count });
  } catch (e) {
    console.warn("[health/db] error", e);
    return NextResponse.json({ status: "error", configured: true, products: 0, error: String(e) }, { status: 200 });
  }
}
