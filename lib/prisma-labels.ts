// lib/prisma-labels.ts — Fase 0.5 — Mapeo enum Prisma <-> etiquetas históricas en español
// El cliente Prisma devuelve las KEYS (PAGADO); la UI y los seeds usan los valores DB ("Pagado").
// Estas funciones mantienen la API estable mientras la DB usa enums tipados.

export const ORDER_STATUS_LABEL: Record<string, string> = {
  NUEVO: "Nuevo",
  COTIZADO: "Cotizado",
  PAGADO: "Pagado",
  HORNEANDO: "Horneando",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ORDER_SOURCE_LABEL: Record<string, string> = {
  INSTAGRAM: "instagram",
  WHATSAPP: "whatsapp",
  WEB: "web",
  MANUAL: "manual",
};

export const SEGMENT_LABEL: Record<string, string> = {
  NUEVO: "nuevo",
  TIBIA: "tibia",
  CALIENTE: "caliente",
  VIP: "VIP",
};

export const label = (map: Record<string, string>, key: unknown): string => {
  const k = String(key ?? "");
  return map[k] ?? k;
};
