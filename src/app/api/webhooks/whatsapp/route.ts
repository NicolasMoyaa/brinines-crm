import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/webhooks/whatsapp — WA Cloud API webhook

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256") || "";
  if (process.env.WA_APP_SECRET) {
    const expected = "sha256=" + crypto.createHmac("sha256", process.env.WA_APP_SECRET).update(raw).digest("hex");
    if (sig && sig.length === expected.length) {
      const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
      if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }
  let body: unknown;
  try { body = JSON.parse(raw); } catch { body = {}; }
  console.log("[webhook:whatsapp] event", JSON.stringify(body).slice(0, 500));
  return NextResponse.json({ received: true });
}
