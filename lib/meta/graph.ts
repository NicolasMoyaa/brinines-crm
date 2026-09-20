// lib/meta/graph.ts — Meta Graph API definitiva — DAG-2026-09-21 Task B
// IG_USER_ID 462599807041091902815 — @brinines_ — IGQ token long-lived (60d)
// Funciones: getProfilePictureUrl, getConversations, sendDm, createMediaAndPublish
// Stub si falta token — no rompe build

const IG_USER_ID = process.env.IG_USER_ID || "462599807041091902815";
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN || process.env.NEXT_PUBLIC_IG_ACCESS_TOKEN || "";

const GRAPH_VERSION = "v20.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function isMetaConfigured(): boolean {
  return Boolean(IG_ACCESS_TOKEN);
}

export async function getProfilePictureUrl(): Promise<string> {
  if (!isMetaConfigured()) {
    console.warn("[meta/graph] stub: IG_ACCESS_TOKEN missing — fallback B avatar");
    return "";
  }
  try {
    const url = `${GRAPH_BASE}/${IG_USER_ID}?fields=profile_picture_url&access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Graph ${res.status}`);
    const data = (await res.json()) as { profile_picture_url?: string };
    return data.profile_picture_url || "";
  } catch (e) {
    console.warn("[meta/graph] getProfilePictureUrl falló", e);
    return "";
  }
}

export async function getConversations(limit = 25) {
  if (!isMetaConfigured()) return [];
  try {
    const url = `${GRAPH_BASE}/${IG_USER_ID}/conversations?platform=instagram&limit=${limit}&access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Graph ${res.status}`);
    const data = (await res.json()) as { data?: unknown[] };
    return (data.data as unknown[]) || [];
  } catch (e) {
    console.warn("[meta/graph] getConversations stub", e);
    return [];
  }
}

export async function sendDm(recipientId: string, message: string) {
  if (!isMetaConfigured()) {
    console.warn("[meta/graph] sendDm stub", { recipientId, message: message.slice(0, 40) });
    return { stub: true };
  }
  try {
    const url = `${GRAPH_BASE}/me/messages?access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        messaging_type: "RESPONSE",
      }),
    });
    if (!res.ok) throw new Error(`Graph ${res.status} ${await res.text()}`);
    return await res.json();
  } catch (e) {
    console.warn("[meta/graph] sendDm falló", e);
    return { stub: true, error: String(e) };
  }
}

// Crea media container y publica (2 pasos Graph): POST /{ig_user_id}/media + POST /{ig_user_id}/media_publish
export async function createMediaAndPublish(params: { image_url: string; caption: string }) {
  if (!isMetaConfigured()) {
    console.warn("[meta/graph] createMediaAndPublish stub", params.caption.slice(0, 60));
    return { stub: true, caption: params.caption };
  }
  try {
    // paso 1: container
    const createRes = await fetch(`${GRAPH_BASE}/${IG_USER_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: params.image_url, caption: params.caption, access_token: IG_ACCESS_TOKEN }),
    });
    if (!createRes.ok) throw new Error(`create media ${createRes.status} ${await createRes.text()}`);
    const { id: creationId } = (await createRes.json()) as { id: string };
    // paso 2: publish
    const pubRes = await fetch(`${GRAPH_BASE}/${IG_USER_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: IG_ACCESS_TOKEN }),
    });
    if (!pubRes.ok) throw new Error(`publish ${pubRes.status} ${await pubRes.text()}`);
    return await pubRes.json();
  } catch (e) {
    console.warn("[meta/graph] createMediaAndPublish falló", e);
    return { stub: true, error: String(e) };
  }
}

export const META_CONFIG = { IG_USER_ID, GRAPH_VERSION };
