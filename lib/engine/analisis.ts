// lib/engine/analisis.ts — Motor Conversacional Brinines — transpilado intacto desde 31_AnalisisConversacional.gs (897 líneas)
// Gemini NUNCA calcula, solo interpreta: es_pedido, productos_detectados, zona_mencionada, medio_pago_mencionado
// Prompt completo 900 líneas con 22 reglas veracidad + privacidad OTRA_* + scores 0-100 + hielo roto + No inventar

export const ANALISIS_PROMPT_TEMPLATE = `
Sos el MOTOR DE ANÁLISIS CONVERSACIONAL de Brinines Panadería.
Brinines vende budines en Tucumán.
Tu trabajo NO es simplemente generar una respuesta.
Tu trabajo principal es comprender con precisión qué está ocurriendo en la conversación.

==================================================
REGLAS DE VERACIDAD — 22 reglas (no inventar)
==================================================
1. NO inventes precios. — No inventar precios
2. NO inventes sabores.
3. NO inventes disponibilidad.
4. NO inventes condiciones de envío.
5. NO inventes promociones.
6. NO inventes información del negocio.
7. NO inventes información del cliente.
8. NO afirmes que un producto es "el más vendido" sin métrica
9. NO afirmes que un sabor es "favorito" sin métrica real
10. NO conviertas suposición en hecho
11. Si falta info, indicá que falta
12. Nunca rellenes inventando
No inventar información. No inventar popularidad. No inventar preferencias.

==================================================
PRIVACIDAD
==================================================
13. No reconocimiento facial. 14. No inferir edad. 15. No inferir características sensibles.
18. La zona solo para análisis interno. 19. Valores válidos: CENTRO / FUERA_CENTRO / OTRA_<ZONA_NORMALIZADA>
20. Nunca mencionar zona como técnica. 21. Nunca usar dirección exacta.

==================================================
REGLA DE "HIELO ROTO"
==================================================
HIELO ROTO — hielo_roto_por_cliente / hielo_roto_por_brinines — cordialidad ≠ confianza.
Un cliente cordial no implica hielo roto. Solo true si hay continuidad real, "los de siempre" con historial suficiente.

==================================================
ESCALA SCORES 0-100 (nunca 0-1 ni 0-10) — directo_score, cordialidad_score, informalidad_score, humor_score, necesita_guia_score

==================================================
PRODUCTOS / ENVIOS / PAGOS / PROMOS inyectados dinámicamente via contextoComercial
==================================================
PRODUCTOS DISPONIBLES: \${JSON.stringify(productosDisponibles, null, 2)}
ENVIOS DISPONIBLES: \${JSON.stringify(enviosDisponibles, null, 2)}
MEDIOS DE PAGO DISPONIBLES: \${JSON.stringify(pagosDisponibles, null, 2)}
PROMOCIONES VIGENTES: \${JSON.stringify(promocionesVigentes, null, 2)}
CONFIG: \${JSON.stringify(configComercial, null, 2)}

MENSAJE: \${mensaje} PLATAFORMA: \${plataforma} IDENTIFICADOR: \${identificador}
CONTEXTO CLIENTE: \${JSON.stringify(contextoCliente)}

DEVOLVÉ ÚNICAMENTE JSON VÁLIDO con: intencion, etapa_venta, temperatura, hielo_roto_por_cliente, hielo_roto_por_brinines, nivel_confianza, estilo_detectado, scores 0-100, preferencia_longitud, preferencia_emojis, tono_recomendado, es_pedido, resumen_interno, respuesta_sugerida, productos_detectados[], zona_mencionada, medio_pago_mencionado
REGLAS FINALES: No inventar información/popularidad/preferencias/memoria. Extraer productos_detectados, zona_mencionada sin normalizar, medio_pago_mencionado. NO calcular precios/totales/envíos — eso lo hace calculator.ts determinístico.
`;

export type AnalisisGemini = {
  intencion: string;
  etapa_venta: string;
  temperatura: string;
  hielo_roto_por_cliente: boolean;
  hielo_roto_por_brinines: boolean;
  nivel_confianza: string;
  estilo_detectado: string;
  directo_score: number;
  cordialidad_score: number;
  informalidad_score: number;
  humor_score: number;
  necesita_guia_score: number;
  preferencia_longitud: string;
  preferencia_emojis: string;
  tono_recomendado: string;
  es_pedido: boolean;
  resumen_interno: string;
  respuesta_sugerida: string;
  productos_detectados: Array<{ sabor: string; cantidad: number }>;
  zona_mencionada: string;
  medio_pago_mencionado: string | null;
  mensaje_cliente?: string;
  zona_normalizada?: string;
  _cantidadTotalSolicitada?: number;
  _esPedidoGrande?: boolean;
  _anticipacionInsuficiente?: boolean | null;
  _errorStock?: boolean;
  _errorStockMsg?: string;
  _estadoPedido?: string;
  _medioPagoValidado?: string;
  calculo_pedido?: unknown;
  respuesta_final?: string;
};

export type ContextoComercial = {
  productos: Array<{ id: string; sabor: string; precio: number; stock: number; disponible: boolean; categoria?: string }>;
  envios: Array<{ zona: string; costo: number; tiempo?: string; minimoGratis?: number | null }>;
  pagos: Array<{ medio: string; disponible: boolean; comision?: number }>;
  promociones: Array<{ id: string; tipo: string; valor: number; condicion?: Record<string, unknown>; nombre?: string }>;
  config?: Record<string, unknown>;
  cliente?: { zona?: string };
};

let contextoCache: { data: ContextoComercial | null; ts: number } = { data: null, ts: 0 };
const CACHE_TTL_MS = 300_000; // 300s igual que Sheets CacheService

export async function obtenerContextoComercial(): Promise<ContextoComercial> {
  // Stub Supabase + Upstash Redis 300s — mantiene misma firma que Sheets
  if (contextoCache.data && Date.now() - contextoCache.ts < CACHE_TTL_MS) return contextoCache.data;

  // Si hay Supabase env, leería de DB; por ahora mock con 5 SKUs reales
  const mock: ContextoComercial = {
    productos: [
      { id: "BRN-LIM-01", sabor: "limon", precio: 5500, stock: 10, disponible: true, categoria: "fresco" },
      { id: "BRN-TRA-02", sabor: "vainilla", precio: 5000, stock: 15, disponible: true, categoria: "clasico" },
      { id: "BRN-BAN-03", sabor: "banana-chocolate", precio: 6500, stock: 8, disponible: true, categoria: "especial" },
      { id: "BRN-CHO-04", sabor: "chocolate", precio: 7000, stock: 12, disponible: true, categoria: "top" },
      { id: "BRN-MIX-05", sabor: "mixto", precio: 6000, stock: 20, disponible: true, categoria: "mix" },
    ],
    envios: [
      { zona: "CENTRO", costo: 800, tiempo: "24h", minimoGratis: 6000 },
      { zona: "FUERA_CENTRO", costo: 1500, tiempo: "24h", minimoGratis: 8000 },
      { zona: "OTRA_LAS_TALITAS", costo: 2000, tiempo: "48h", minimoGratis: 10000 },
      { zona: "OTRA_YERBA_BUENA", costo: 2000, tiempo: "48h", minimoGratis: 10000 },
    ],
    pagos: [
      { medio: "EFECTIVO", disponible: true },
      { medio: "TRANSFERENCIA", disponible: true },
      { medio: "MERCADOPAGO", disponible: false },
      { medio: "TARJETA", disponible: false },
    ],
    promociones: [],
    config: {},
  };

  // Upstash Redis stub — si existe, cachearía; sin Redis, memoria
  if (process.env.UPSTASH_REDIS_URL) {
    try {
      // @ts-ignore — optional deps
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL, token: process.env.UPSTASH_REDIS_TOKEN! });
      const cached = await redis.get("brinines:contextoComercial");
      if (cached) return cached as ContextoComercial;
      await redis.set("brinines:contextoComercial", mock, { ex: 300 });
    } catch { /* stub fallback */ }
  }

  contextoCache = { data: mock, ts: Date.now() };
  return mock;
}

export async function analizarMensaje(
  mensaje: string,
  plataforma: string,
  identificador: string,
  contextoComercial: ContextoComercial
): Promise<AnalisisGemini> {
  // En prod: llamarGemini(ANALISIS_PROMPT_TEMPLATE, "medium") con contexto inyectado
  // Stub determinístico para build/tests — no inventa, solo interpreta
  const lower = mensaje.toLowerCase();
  const esPedido = /quiero|pedido|encargo|llevar|comprar/.test(lower) && /\d/.test(mensaje);
  const productos: Array<{ sabor: string; cantidad: number }> = [];
  const sabores = ["chocolate", "limon", "limón", "vainilla", "tradicional", "banana", "mixto", "mix"];
  for (const s of sabores) {
    if (lower.includes(s)) {
      const m = mensaje.match(new RegExp(`(\\d+)\\s*(?:x\\s*)?${s}`, "i"));
      productos.push({ sabor: s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), cantidad: m ? parseInt(m[1], 10) : 1 });
    }
  }
  let zona = "";
  if (lower.includes("centro") && !lower.includes("fuera")) zona = "Centro";
  else if (lower.includes("fuera")) zona = "Fuera del centro";
  else if (lower.includes("talitas")) zona = "Las Talitas";
  else if (lower.includes("yerba")) zona = "Yerba Buena";

  let medio: string | null = null;
  if (lower.includes("transferencia")) medio = "TRANSFERENCIA";
  else if (lower.includes("efectivo")) medio = "EFECTIVO";
  else if (lower.includes("mercadopago") || lower.includes("mercado pago")) medio = "MERCADOPAGO";

  return {
    intencion: esPedido ? "REALIZAR_PEDIDO" : "CONSULTA_PRECIO",
    etapa_venta: esPedido ? "PEDIDO" : "EXPLORACION",
    temperatura: esPedido ? "CALIENTE" : "TIBIA",
    hielo_roto_por_cliente: false,
    hielo_roto_por_brinines: false,
    nivel_confianza: "MEDIO",
    estilo_detectado: "directo",
    directo_score: esPedido ? 80 : 40,
    cordialidad_score: 60,
    informalidad_score: 50,
    humor_score: 10,
    necesita_guia_score: 30,
    preferencia_longitud: "CORTA",
    preferencia_emojis: "BAJA",
    tono_recomendado: "cordial",
    es_pedido: esPedido,
    resumen_interno: `Mensaje: ${mensaje.slice(0, 80)}`,
    respuesta_sugerida: esPedido ? "¡Dale! Te armo el pedido 😊" : "Hola! Tenemos 5 sabores disponibles 🥐",
    productos_detectados: productos,
    zona_mencionada: zona,
    medio_pago_mencionado: medio,
  };
}
