// lib/connections/registry.ts — Registro central escalable de conexiones
// Agregar una conexión nueva = 1 entrada aquí — Ajustes la renderiza automáticamente

export type ConnectionStatus = "conectado" | "desconectado" | "error" | "stub";

export type ConnectionDef = {
  id: string;
  name: string;
  description: string;
  icon: "calendar" | "instagram" | "whatsapp" | "queue" | "database";
  isConfigured: () => boolean;
  status: () => ConnectionStatus;
  envHint: string;
};

export function maskSecret(v: string): string {
  if (!v) return "••••";
  if (v.length <= 4) return "••••";
  return `••••${v.slice(-4)}`;
}

function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function isMetaConfigured(): boolean {
  return Boolean(process.env.IG_ACCESS_TOKEN || process.env.NEXT_PUBLIC_IG_ACCESS_TOKEN);
}

function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function isUpstashConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_URL);
}

export const connections: ConnectionDef[] = [
  {
    id: "google",
    name: "Google Calendar",
    description: "Horneadas → eventos 60+10 min",
    icon: "calendar",
    isConfigured: isGoogleConfigured,
    status: () => isGoogleConfigured() ? "conectado" : "stub",
    envHint: "GOOGLE_CLIENT_ID",
  },
  {
    id: "meta",
    name: "Instagram Graph",
    description: "v20.0 • IG 462599807...",
    icon: "instagram",
    isConfigured: isMetaConfigured,
    status: () => isMetaConfigured() ? "conectado" : "stub",
    envHint: "IG_ACCESS_TOKEN",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Cloud",
    description: "Wa 5493813562078",
    icon: "whatsapp",
    isConfigured: () => false, // controlado por UI state waConnected
    status: () => "stub",
    envHint: "WHATSAPP_TOKEN",
  },
  {
    id: "upstash",
    name: "Upstash Redis",
    description: "BullMQ • Queue",
    icon: "queue",
    isConfigured: isUpstashConfigured,
    status: () => isUpstashConfigured() ? "conectado" : "stub",
    envHint: "UPSTASH_REDIS_REST_URL",
  },
  {
    id: "database",
    name: "Supabase Postgres",
    description: "Prisma • 8 models",
    icon: "database",
    isConfigured: isDbConfigured,
    status: () => isDbConfigured() ? "conectado" : "stub",
    envHint: "DATABASE_URL",
  },
];
