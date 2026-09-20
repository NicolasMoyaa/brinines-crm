// lib/engine/calculator.ts — Calculadora determinística — transpilado intacto desde 40_CalculadoraPedidos.gs (329 líneas)
// Gemini nunca calcula. Todo deterministico aqui. Mantiene: >20 → PENDIENTE_REVISION_HUMANA, <24h → revisión, MERCADOPAGO inactivo → pendiente, zona default CENTRO → pendiente

export function matchProductos(productosDetectados: Array<{ sabor: string; cantidad: number }>, catalogo: Array<{ id: string; sabor: string; precio: number; stock: number; disponible: boolean }>) {
  if (!productosDetectados || !Array.isArray(productosDetectados)) return [];
  if (!catalogo || !Array.isArray(catalogo)) throw new Error("Catalogo invalido: debe ser array");
  return productosDetectados.map((det, idx) => {
    const saborBuscado = String((det as { sabor?: unknown })?.sabor || "").trim().toLowerCase();
    const cantidad = toInt((det as { cantidad?: unknown })?.cantidad, 0);
    if (!saborBuscado) throw new Error("Producto en posicion " + idx + " sin sabor");
    if (cantidad <= 0) throw new Error("Cantidad invalida para " + saborBuscado + ": " + cantidad);
    const match = catalogo.find(p => String(p.sabor || "").trim().toLowerCase() === saborBuscado);
    if (!match) throw new Error("Producto no encontrado en catalogo: " + (det as { sabor?: string }).sabor);
    if (!match.disponible) throw new Error("Producto no disponible: " + (det as { sabor?: string }).sabor);
    return { producto_id: match.id, sabor: match.sabor, precio: toNumber(match.precio, 0), cantidad, stock_disponible: toNumber(match.stock, -1) };
  });
}

export function validarStock(items: Array<{ stock_disponible: number; cantidad: number; sabor: string }>) {
  if (!items || !Array.isArray(items)) return { ok: true, faltantes: [] as string[] };
  const faltantes: string[] = [];
  items.forEach(item => { if (item.stock_disponible >= 0 && item.stock_disponible < item.cantidad) faltantes.push(item.sabor + " (stock: " + item.stock_disponible + ", pedido: " + item.cantidad + ")"); });
  return { ok: faltantes.length === 0, faltantes };
}

export function calcularSubtotal(items: Array<{ precio: number; cantidad: number }>) {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + toNumber(i.precio, 0) * toInt(i.cantidad, 0), 0);
}

export function calcularEnvio(zona: string, subtotal: number, envios: Array<{ zona: string; costo: number; minimoGratis?: number | null; tiempo?: string }>) {
  if (!envios || !Array.isArray(envios)) throw new Error("Envios invalido: debe ser array");
  const zonaNorm = String(zona || "").trim();
  const envio = envios.find(e => String(e.zona || "").trim() === zonaNorm);
  if (!envio) throw new Error("Zona sin tarifa de envio configurada: " + zonaNorm);
  const costoBase = toNumber(envio.costo, 0);
  const minimoGratis = toNumber(envio.minimoGratis, null as unknown as number);
  const gratis = minimoGratis !== null && subtotal >= minimoGratis;
  return { zona: zonaNorm, costo: gratis ? 0 : costoBase, gratis, tiempo: String(envio.tiempo || "").trim(), minimoGratis };
}

export function evaluarPromociones(subtotal: number, items: Array<{ producto_id: string; precio: number; cantidad: number }>, zona: string, medioPago: string | null, promociones: Array<{ id: string; tipo: string; valor: number; condicion?: Record<string, unknown>; nombre?: string }>, catalogo: Array<{ id: string; categoria?: string }>) {
  if (!promociones || !Array.isArray(promociones)) return { descuento_total: 0, promos_aplicadas: [] as Array<{ id: string; nombre: string | undefined; descuento: number }> };
  if (!catalogo || !Array.isArray(catalogo)) throw new Error("Catalogo requerido para evaluar promociones");
  let descuentoTotal = 0; const aplicadas: Array<{ id: string; nombre: string | undefined; descuento: number }> = [];
  promociones.forEach(promo => {
    const cond = (promo.condicion || {}) as Record<string, unknown>;
    let aplica = true;
    if (cond.zonas && Array.isArray(cond.zonas) && !(cond.zonas as string[]).includes(zona)) aplica = false;
    if (cond.min_total && subtotal < toNumber(cond.min_total, 0)) aplica = false;
    if (cond.dias && Array.isArray(cond.dias)) { const hoy = new Date().toLocaleDateString("es-AR", { weekday: "long" }); if (!(cond.dias as string[]).includes(hoy)) aplica = false; }
    if (cond.categoria) { const catBuscada = String(cond.categoria).trim(); const tiene = items.some(item => { const prod = catalogo.find(p => p.id === item.producto_id); return prod && String(prod.categoria || "").trim() === catBuscada; }); if (!tiene) aplica = false; }
    if (cond.productos && Array.isArray(cond.productos)) { const tiene = items.some(item => (cond.productos as string[]).includes(item.producto_id)); if (!tiene) aplica = false; }
    if (cond.medio_pago && String(cond.medio_pago).trim() !== String(medioPago || "").trim()) aplica = false;
    if (aplica) {
      let descuento = 0;
      switch (promo.tipo) {
        case "DESCUENTO_PORCENTUAL": descuento = Math.round(subtotal * (toNumber(promo.valor, 0) / 100)); break;
        case "DESCUENTO_MONTO": descuento = Math.min(toNumber(promo.valor, 0), subtotal); break;
        case "ENVIO_GRATIS": break;
        case "2X1": { const items2x1 = items.filter(item => { const prod = catalogo.find(p => p.id === item.producto_id); return prod && (cond.categoria ? String(prod.categoria || "").trim() === String(cond.categoria).trim() : true) && (cond.productos ? (cond.productos as string[]).includes(item.producto_id) : true); }); if (items2x1.length > 0) { const precios = items2x1.map(i => toNumber(i.precio, 0) * toInt(i.cantidad, 0)); precios.sort((a,b)=>a-b); descuento = precios[0]; } break; }
        case "PRODUCTO_GRATIS": { const itemsGratis = items.filter(item => (cond.productos as string[] | undefined)?.includes(item.producto_id)); if (itemsGratis.length > 0) descuento = itemsGratis.reduce((s,i)=>s+toNumber(i.precio,0)*toInt(i.cantidad,0),0); break; }
      }
      if (descuento > 0) { descuentoTotal += descuento; aplicadas.push({ id: promo.id, nombre: promo.nombre, descuento }); }
    }
  });
  return { descuento_total: descuentoTotal, promos_aplicadas: aplicadas };
}

export function calcularTotal(subtotal: number, envioCosto: number, descuentoTotal: number) { return Math.max(0, toNumber(subtotal,0)+toNumber(envioCosto,0)-toNumber(descuentoTotal,0)); }

export function calcularPedidoCompleto(analisisGemini: { productos_detectados: Array<{ sabor: string; cantidad: number }>; zona_mencionada?: string; medio_pago_mencionado?: string | null }, contextoComercial: { envios: Array<{ zona: string; costo: number; minimoGratis?: number | null; tiempo?: string }>; promociones?: Array<{ id:string; tipo:string; valor:number; condicion?:Record<string,unknown>; nombre?:string }>; cliente?: { zona?: string } }, catalogoProductos: Array<{ id:string; sabor:string; precio:number; stock:number; disponible:boolean; categoria?:string }>) {
  const productosDetectados = analisisGemini?.productos_detectados || [];
  if (productosDetectados.length === 0) throw new Error("No hay productos detectados para calcular pedido");
  const items = matchProductos(productosDetectados, catalogoProductos);
  const stockCheck = validarStock(items as unknown as Array<{ stock_disponible:number; cantidad:number; sabor:string }>);
  if (!stockCheck.ok) throw new Error("Stock insuficiente: " + stockCheck.faltantes.join(", "));
  const subtotal = calcularSubtotal(items);
  const zona = String(analisisGemini?.zona_mencionada || "").trim() || String(contextoComercial?.cliente?.zona || "").trim() || "CENTRO";
  const zonaNormalizada = normalizarZonaComercial(zona);
  const envio = calcularEnvio(zonaNormalizada, subtotal, contextoComercial.envios);
  const medioPago = analisisGemini?.medio_pago_mencionado || null;
  const promoResult = evaluarPromociones(subtotal, items, zonaNormalizada, medioPago, contextoComercial.promociones || [], catalogoProductos);
  const total = calcularTotal(subtotal, envio.costo, promoResult.descuento_total);
  return { items, subtotal, envio: { zona: envio.zona, costo: envio.costo, gratis: envio.gratis, tiempo: envio.tiempo }, promociones: promoResult.promos_aplicadas, descuento_total: promoResult.descuento_total, total, medio_pago_sugerido: medioPago };
}

function toNumber(val: unknown, defaultVal: number): number { if (val===null||val===undefined||val==="") return defaultVal; const n=Number(val); return isNaN(n)?defaultVal:n; }
function toInt(val: unknown, defaultVal: number): number { const n=toNumber(val,defaultVal); return Math.floor(n); }

export function normalizarZonaComercial(zonaTexto: string): string {
  if (!zonaTexto) return "CENTRO";
  let texto = String(zonaTexto).trim().toUpperCase();
  const tieneOTRA = texto.startsWith("OTRA_") || texto.startsWith("OTRA ");
  if (tieneOTRA) { if (texto.startsWith("OTRA_")) texto = texto.substring(4).trim(); else texto = texto.substring(5).trim(); }
  if (texto.includes("CENTRO") && !texto.includes("FUERA")) return "CENTRO";
  if (texto.includes("FUERA") && texto.includes("CENTRO")) return "FUERA_CENTRO";
  const normalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9\s_-]/g, "").replace(/[-_]+/g, "_").replace(/\s+/g, "_");
  const limpio = normalizado.replace(/^_/, "");
  const result = "OTRA_" + limpio;
  if (!normalizado || normalizado === "_") return "CENTRO";
  return result;
}
