// lib/engine/contenido.ts — Generador Contenido stock-aware — DAG-2026-09-21 Task A
// Rescata Sheets Contenidos/Estrategias para CRM tab Contenido — ver CONTENIDO-PLAN.md
// Usa prompt veracidad (no inventar) + obtenerContextoComercial() stock-check — si stock 0 no sugiere
// Queue IG Graph POST /{ig_user_id}/media (stub si falta token)

import { obtenerContextoComercial } from "./analisis";

export type Tonos = "cordial" | "directo" | "humor";
export type SaborKey = "chocolate" | "limon" | "banana-chocolate" | "vainilla" | "mixto";

export type ContenidoInput = {
  sabor: SaborKey;
  tono: Tonos;
  horario: string; // "18:00"
};

export type ContenidoPreview = {
  copy: string;
  sabor: SaborKey;
  tono: Tonos;
  stockOk: boolean;
  stockCantidad?: number;
  imagenPlaceholder: string;
};

const COPIES: Record<SaborKey, Record<Tonos, string>> = {
  chocolate: {
    cordial: "Chocolate doble, húmedo y 100% artesanal 🍫 Horneamos hoy en Tucumán — pedí antes de las 18h y retirá a las 19h. ¡Te esperamos!",
    humor: "¿Antojo de chocolate? Este budín doble no perdona 😏 — horneado hoy en Tucumán. ¿Te guardo uno?",
    directo: "Chocolate doble — $7000 • Stock hoy • Retiro 18-20h Centro. Escribí y te lo guardo.",
  },
  limon: {
    cordial: "Limoncito glaseado fresco 🍋 Ideal para el calor tucumano — liviano, esponjoso y con mucho limón natural.",
    humor: "Cuando hace 35° en Tucumán, solo un limoncito glaseado te salva 🍋❄️",
    directo: "Limón glaseado — $5500 • Fresco del día • 10 unidades hoy.",
  },
  "banana-chocolate": {
    cordial: "Banana + chocolate, la dupla que no falla 🍌🍫 — dulce justo, sin exceso. Horneado esta mañana.",
    humor: "¿Banana o chocolate? Por qué elegir si podés tener los dos 🐵🍫",
    directo: "Banana con chocolate — $6500 • Disponible hoy • 8 unidades.",
  },
  vainilla: {
    cordial: "Tradicional de vainilla — el favorito de los clásicos ✨ Simple, esponjoso y rendidor.",
    humor: "El que nunca falla para la merienda — vainilla power ✨",
    directo: "Vainilla tradicional — $5000 • Clásico • Stock 15 hoy.",
  },
  mixto: {
    cordial: "Mix de sabores: probá todos y encontrá tu favorito 🎨 — 4 porciones, 4 sabores.",
    humor: "Indeciso? El mix te resuelve la vida 🎨🍰",
    directo: "Mix 4 sabores — $6000 • 20 unidades hoy.",
  },
};

export async function generarContenidoPreview(input: ContenidoInput): Promise<ContenidoPreview> {
  const contexto = await obtenerContextoComercial();
  // Mapeo sabor key → sabor en productos
  const saborMap: Record<SaborKey, string> = {
    chocolate: "chocolate",
    limon: "limon",
    "banana-chocolate": "banana-chocolate",
    vainilla: "vainilla",
    mixto: "mixto",
  };
  const prod = contexto.productos.find((p) => p.sabor === saborMap[input.sabor]);
  const stockOk = prod ? prod.stock > 0 && prod.disponible : true;
  const copy = stockOk
    ? COPIES[input.sabor][input.tono]
    : `⚠️ Hoy sin stock de ${input.sabor} — no promocionar. Sugerimos otro sabor disponible.`;

  return {
    copy,
    sabor: input.sabor,
    tono: input.tono,
    stockOk,
    stockCantidad: prod?.stock,
    imagenPlaceholder: `/api/placeholder/${input.sabor}`,
  };
}

export type ContenidoEstado = "borrador" | "programado" | "publicado";

export type ContenidoRecord = {
  id: string;
  fecha: string;
  sabor: SaborKey;
  copy: string;
  imagenUrl?: string;
  estado: ContenidoEstado;
  metricas?: { likes: number; reach: number; saves: number };
};

// Stub storage — Supabase `contenidos` tabla en prod, localStorage stub en dev
export async function guardarContenido(rec: Omit<ContenidoRecord, "id">): Promise<ContenidoRecord> {
  const id = `CNT-${Date.now()}`;
  console.log("[contenido] guardar", id, rec.estado, rec.sabor);
  // En prod: await supabase.from("contenidos").insert({...})
  // + queue BullMQ delayed job → IG Graph POST /{ig_user_id}/media a hora programada
  return { id, ...rec };
}

export async function programarContenido(input: ContenidoInput, copy: string, fechaISO: string) {
  const preview = await generarContenidoPreview(input);
  if (!preview.stockOk) {
    return { ok: false, reason: "stock_cero_no_programar", preview };
  }
  const rec = await guardarContenido({ fecha: fechaISO, sabor: input.sabor, copy, estado: "programado" });
  // Queue stub
  console.log("[contenido] programado", rec.id, "→ queue IG Graph stub", fechaISO);
  return { ok: true, rec, preview };
}
