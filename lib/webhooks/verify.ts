// lib/webhooks/verify.ts — Verificación HMAC compartida WA/IG — Fase 0.2
// Regla: con APP_SECRET configurado, firma ausente o inválida => 401. Sin excepción.
// Sin secret configurado => stub (warn + pasa) para no romper dev.

import crypto from "crypto";

export type VerifyResult = { ok: true; mode: "verified" | "stub" } | { ok: false };

export function verifyHubSignature(raw: string, sig: string, secret: string): VerifyResult {
  if (!secret) {
    console.warn("[webhook] stub: APP_SECRET missing — firma no verificada (solo dev)");
    return { ok: true, mode: "stub" };
  }
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!sig || sig.length !== expected.length) return { ok: false };
  const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  return valid ? { ok: true, mode: "verified" } : { ok: false };
}
