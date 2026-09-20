import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/webhooks/instagram — IG Graph API webhook
// Validacion X-Hub-Signature-256 + guarda en interactions + crea events (stub sin DB real OK)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.IG_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256") || "";

  // Validacion HMAC si hay secret
  if (process.env.IG_APP_SECRET) {
    const expected = "sha256=" + crypto.createHmac("sha256", process.env.IG_APP_SECRET).update(raw).digest("hex");
    const valid = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try { body = JSON.parse(raw); } catch { body = {}; }

  // Stub: guardar en interactions + events (in-memory / log)
  console.log("[webhook:instagram] event", JSON.stringify(body).slice(0, 500));

  // En produccion: prisma.interaction.create + prisma.event.create + queue enqueue
  return NextResponse.json({ received: true });
}
