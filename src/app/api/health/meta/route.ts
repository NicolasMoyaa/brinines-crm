import { NextResponse } from "next/server";

export async function GET() {
  const hasToken = Boolean(process.env.IG_ACCESS_TOKEN || process.env.NEXT_PUBLIC_IG_ACCESS_TOKEN);
  const igId = process.env.IG_USER_ID || "462599807041091902815";
  if (!hasToken) {
    return NextResponse.json({ status: "stub", configured: false, igId, message: "IG_ACCESS_TOKEN missing — stub" });
  }
  try {
    const { getProfilePictureUrl } = await import("../../../../../lib/meta/graph");
    const url = await getProfilePictureUrl();
    return NextResponse.json({ status: "ok", configured: true, igId, hasAvatar: Boolean(url) });
  } catch (e) {
    console.warn("[health/meta] error", e);
    return NextResponse.json({ status: "error", configured: true, igId, error: String(e) }, { status: 200 });
  }
}
