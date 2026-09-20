// lib/engine/automations.ts — MOTOR fidelity — DAG-2026-09-21
// Auditoría MOTOR-vs-META: KILL 4 invasivas (Churn 21d, Abandono 2h, Recurrencia 14d fija, Bienvenida masiva)
// KEEP 2 (Story Reply + Tag Auto) + KEEP condicional 2 (Post-Entrega human-in-the-loop + Upsell integrado)
// Fuente: MOTOR-vs-META-comparacion.md

export type AutomationId = "story_reply" | "tag_auto" | "post_entrega_review" | "upsell_integrado";

export type Automation = {
  id: AutomationId;
  name: string;
  trigger: string;
  desc: string;
  active: boolean;
  runs: number;
  conv: string;
  // KILL reemplazo
  replaces?: string[];
};

// Allowlist definitiva — solo estas 4 sobreviven DAG-21
export const AUTOMATIONS_ALLOWLIST: Automation[] = [
  {
    id: "story_reply",
    name: "Story Reply Auto DM",
    trigger: "story_reply",
    desc: "Respuesta automática a story replies con catálogo + precios — stock-aware via obtenerContextoComercial() + calculator.ts",
    active: true,
    runs: 142,
    conv: "18%",
  },
  {
    id: "tag_auto",
    name: "Tag Automático",
    trigger: "mention sabor",
    desc: "Etiqueta automática según sabor mencionado → Customer.tags (chocolate-lover etc)",
    active: true,
    runs: 89,
    conv: "—",
  },
  {
    id: "post_entrega_review",
    name: "Post-Entrega Review 48h",
    trigger: "order_delivered +48h",
    desc: "Pedir review + 10% próxima compra — solo si Feedback_Entrega previo fue positivo (human-in-the-loop)",
    active: true,
    runs: 27,
    conv: "41%",
    replaces: ["post_entrega_original"],
  },
  {
    id: "upsell_integrado",
    name: "Upsell integrado",
    trigger: "en pedido",
    desc: "Sugerir 2x dentro del mismo pedido via construirRespuestaPedido — nunca DM día después",
    active: true,
    runs: 34,
    conv: "12%",
    replaces: ["upsell_push"],
  },
];

// KILL list — desactivadas y reemplazadas por lógica MOTOR no invasiva
export const AUTOMATIONS_KILLED = [
  { name: "Churn 21d", reason: "Tucumán: budín por antojo no suscripción — 21d = stalker → bloqueo. Reemplazo: Segmentación silenciosa + Experimentos opt-in", replacement: "segmentacion_silenciosa" },
  { name: "Abandono 2h", reason: "2h spam, cliente está laburando. Reemplazo: 24h suave solo si interactuó últimos 7d o contenido orgánico", replacement: "contenido_organico" },
  { name: "Recurrencia 14d fija", reason: "Push sin contexto ni estacionalidad. Reemplazo: Calendario inteligente (findes/feriados/calor → Google Calendar trigger)", replacement: "google_calendar_trigger" },
  { name: "Bienvenida masiva", reason: "IG penaliza DM auto a follower nuevo. Reemplazo: Bienvenida contextual solo si like 2 posts o comenta", replacement: "bienvenida_contextual" },
] as const;

export function isAutomationAllowed(id: string): boolean {
  return AUTOMATIONS_ALLOWLIST.some((a) => a.id === id || a.name === id);
}

export function getActiveAutomations(): Automation[] {
  return AUTOMATIONS_ALLOWLIST.filter((a) => a.active);
}
