import { NextRequest, NextResponse } from "next/server";

// GET /api/inbox — stub para graph.facebook.com/v20.0/{ig_user_id}/conversations con token IGQ...
// Lista conversaciones reales si hay token, sino retorna mock

export async function GET(req: NextRequest) {
  const token = process.env.IG_ACCESS_TOKEN || process.env.IGQ_TOKEN;
  const igUserId = process.env.IG_USER_ID || "462599807041091902815";

  // Si hay token real, trae conversaciones históricas reales del Graph (no crea, solo lee)
  if (token) {
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/conversations?platform=instagram&fields=participants,messages{message,from,created_time},updated_time&limit=25&access_token=${token}`, { cache: "no-store" });
      const data = await res.json();
      if ((data as any).error) throw new Error(JSON.stringify((data as any).error));
      return NextResponse.json({ stub: false, source: "graph", data });
    } catch (e) {
      console.warn("[inbox] graph falló, fallback DB", e);
      // fallback a DB
    }
  }

  // Fallback DB: convierte Interaction históricas en formato conversación (tiempo real DB)
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("../../../../lib/db");
      const interactions = await prisma.interaction.findMany({
        include: { customer: true },
        orderBy: { created_at: "desc" },
        take: 30,
      });
      // Agrupa por customer para simular conversaciones
      const map = new Map<string, any>();
      for (const it of interactions as any[]) {
        const key = it.customer?.phone || it.customer?.ig_handle || it.customer_id || "unknown";
        if (!map.has(key)) {
          map.set(key, {
            id: `db_${key}`,
            platform: it.platform,
            from: it.customer?.name || it.customer?.ig_handle || key,
            avatar: (it.customer?.name || "??").slice(0, 2).toUpperCase(),
            lastMsg: it.content,
            time: new Date(it.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
            tag: it.type,
            flavor: it.customer?.tags?.[0] || "—",
            customer: it.customer,
            messages: [],
          });
        }
        map.get(key).messages.push(it);
      }
      const conversations = Array.from(map.values()).slice(0, 10);
      // Si no hay token, avisa que es DB histórica (reemplazará por Graph cuando token esté)
      return NextResponse.json({
        stub: !token,
        source: token ? "graph_fallback_db" : "db_historica",
        message: token ? "Graph falló, mostrando históricas de DB" : "Mostrando conversaciones históricas de DB — al conectar IG_ACCESS_TOKEN se verán las reales del DM de @brinines_ en tiempo real",
        conversations,
        graph_url: `https://graph.facebook.com/v20.0/${igUserId}/conversations`,
        count: conversations.length,
      });
    }
  } catch (e) {
    console.warn("[inbox] DB fallback falló", e);
  }

  return NextResponse.json({
    stub: true,
    message: "Sin DB ni token — mock",
    conversations: [
      { id: "dm_1", platform: "instagram", from: "cliente_tucuman", content: "Quiero 2 de chocolate", status: "Nuevo" },
    ],
    graph_url: `https://graph.facebook.com/v20.0/${igUserId}/conversations`,
  });
}
