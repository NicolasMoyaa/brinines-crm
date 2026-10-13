// lib/auth.ts — Auth mínima para rutas de negocio — Fase 0.1
// Stub-safe: sin ADMIN_TOKEN configurado, permite y marca auth:"stub" (no rompe dev/build).
// Con ADMIN_TOKEN configurado, exige Bearer o x-admin-token — 401 sin él.
// Uso: const gate = requireAuth(req); if (!gate.ok) return gate.response;

import { NextRequest, NextResponse } from "next/server";

export type AuthGate =
  | { ok: true; mode: "token" | "stub" }
  | { ok: false; response: NextResponse };

function getConfiguredToken(): string {
  return process.env.ADMIN_TOKEN || process.env.CRON_SECRET || "";
}

export function requireAuth(req: NextRequest): AuthGate {
  const configured = getConfiguredToken();
  if (!configured) {
    return { ok: true, mode: "stub" };
  }
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const alt = req.headers.get("x-admin-token") || "";
  const given = bearer || alt;
  if (given && given.length === configured.length) {
    // Comparación en tiempo constante para no filtrar por timing
    let diff = 0;
    for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ configured.charCodeAt(i);
    if (diff === 0) return { ok: true, mode: "token" };
  }
  return {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

export function authMode(): "token" | "stub" {
  return getConfiguredToken() ? "token" : "stub";
}
