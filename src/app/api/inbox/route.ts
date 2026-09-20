import { NextRequest, NextResponse } from "next/server";

// GET /api/inbox — stub para graph.facebook.com/v20.0/{ig_user_id}/conversations con token IGQ...
// Lista conversaciones reales si hay token, sino retorna mock

export async function GET(req: NextRequest) {
  const token = process.env.IG_ACCESS_TOKEN || process.env.IGQ_TOKEN;
  const igUserId = process.env.IG_USER_ID || "user-462599807041091902815";

  if (!token) {
    return NextResponse.json({
      stub: true,
      message: "IGQ token not set — returning mock inbox",
      conversations: [
        { id: "dm_1", platform: "instagram", from: "cliente_tucuman", content: "Quiero 2 de chocolate", status: "Nuevo" },
        { id: "dm_2", platform: "whatsapp", from: "+5493815550001", content: "Hola! Qué sabores tienen?", status: "Cotizado" },
      ],
      graph_url: `https://graph.facebook.com/v20.0/${igUserId}/conversations`,
    });
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/conversations?access_token=${token}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ stub: false, data });
  } catch (e) {
    return NextResponse.json({ error: String(e), stub: true }, { status: 500 });
  }
}
