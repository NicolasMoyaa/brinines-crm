// components/crm/data.ts — Fase 0.6 — Datos mock/estáticos (extracción verbatim de page.tsx)
// Los valores reales llegan por fetch (kpisReal/contactsReal/...) y reemplazan a estos.

import type { Kpi, Pedido, Contact, Conversation, Pipelines, Automation } from "./types";

export const kpis: Kpi[] = [
  { label: "LEADS TOTAL", value: "201", delta: "+12 hoy", sub: "IG + WhatsApp", accent: false },
  { label: "ÓRDENES EST.", value: "12", delta: "+3 hoy", sub: "Este mes", accent: false },
  { label: "REVENUE", value: "$72.000", delta: "+23%", sub: "ARS estimado", accent: true },
  { label: "CONVERSIÓN", value: "3,88%", delta: "↑ 0.6%", sub: "Lead → Pago", accent: false },
];

export const ventasSabor = [
  { name: "Chocolate doble", count: 12, pct: 100, color: "#a3ff12" },
  { name: "Tradicional vainilla", count: 6, pct: 50, color: "#fff" },
  { name: "Banana con nuez", count: 5, pct: 41, color: "#8a8a8a" },
  { name: "Limón glaseado", count: 4, pct: 33, color: "#555" },
];

export const pedidos: Pedido[] = [
  { name: "Florencia T.", initials: "FT", flavor: "3x Chocolate", amount: "$13.800", status: "Horneando", time: "1h" },
  { name: "Lucía H.", initials: "LH", flavor: "Chocolate", amount: "$4.600", status: "Pagado", time: "2m" },
  { name: "Martina P.", initials: "MP", flavor: "Banana", amount: "$4.600", status: "Nuevo", time: "18m" },
  { name: "Sofia G.", initials: "SG", flavor: "Tradicional", amount: "$4.600", status: "Entregado", time: "5h" },
  { name: "Camila N.", initials: "CN", flavor: "2x Choco", amount: "$9.200", status: "Cotizado", time: "Ayer" },
];

export const contacts: Contact[] = [
  { id: 1, name: "Florencia Torres", phone: "381 555-0123", city: "Centro", tag: "chocolate-lover", flavor: "Chocolate", ltv: "$18.400", orders: 4, last: "hace 2d", status: "VIP", avatar: "FT" },
  { id: 2, name: "Lucía Herrera", phone: "381 555-0124", city: "Las Talitas", tag: "recurrente", flavor: "Limón", ltv: "$14.200", orders: 3, last: "hace 5d", status: "caliente", avatar: "LH" },
  { id: 3, name: "Sofia Gómez", phone: "381 555-0125", city: "Yerba Buena", tag: "nuevo", flavor: "Tradicional", ltv: "$4.600", orders: 1, last: "hoy", status: "nuevo", avatar: "SG" },
  { id: 4, name: "Martina Paz", phone: "381 555-0126", city: "Fuera Centro", tag: "banana", flavor: "Banana", ltv: "$9.800", orders: 2, last: "hace 1d", status: "tibia", avatar: "MP" },
];

export const conversations: Conversation[] = [
  { id: "c1", name: "Lucía H.", avatar: "LH", lastMsg: "Quiero 3 de chocolate y 2 de limón, zona Centro", time: "2m", tag: "pedido", flavor: "Chocolate", unread: 2 },
  { id: "c2", name: "Martina P.", avatar: "MP", lastMsg: "Hola! Qué sabores tienen hoy? 😊", time: "18m", tag: "consulta", flavor: "Banana", unread: 0 },
  { id: "c3", name: "Sofia G.", avatar: "SG", lastMsg: "Gracias! Llegó perfecto 🥐", time: "5h", tag: "postventa", flavor: "Tradicional", unread: 0 },
];

export const pipelines: Pipelines = {
  "Nuevo Lead": [{ name: "Sofia G.", initials: "SG", flavor: "Tradicional", amount: "$4.600", status: "Nuevo", time: "5h" }],
  "Cotizado": [{ name: "Camila N.", initials: "CN", flavor: "2x Choco", amount: "$9.200", status: "Cotizado", time: "Ayer" }],
  "Pagado": [{ name: "Lucía H.", initials: "LH", flavor: "Chocolate", amount: "$4.600", status: "Pagado", time: "2m" }],
  "Horneando": [{ name: "Florencia T.", initials: "FT", flavor: "3x Chocolate", amount: "$13.800", status: "Horneando", time: "1h" }],
  "Entregado": [{ name: "Agustina M.", initials: "AM", flavor: "2x Limón", amount: "$9.200", status: "Entregado", time: "Ayer" }],
};

export const automations: Automation[] = [
  { name: "Story Reply Auto DM", trigger: "story_reply", desc: "Respuesta automática a story replies con catálogo + precios (stock real)", runs: 142, conv: "18%", active: true },
  { name: "Post-Entrega Review 48h", trigger: "order_delivered +48h", desc: "Pedir review + 10% próxima compra (human-in-the-loop)", runs: 27, conv: "41%", active: true },
  { name: "Tag Automático", trigger: "mention sabor", desc: "Etiqueta automática según sabor mencionado (chocolate-lover etc)", runs: 89, conv: "—", active: true },
  { name: "Upsell integrado", trigger: "en pedido", desc: "Sugerir 2x dentro del mismo pedido (no DM aparte) — ver calculator", runs: 34, conv: "12%", active: true },
];
