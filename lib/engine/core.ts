// lib/engine/core.ts — transpilado desde Code.js procesarConversacion/determinarEstadoPedido/detectarAnticipacionInsuficiente/sanitizarRespuestaPrivacidad/construirRespuestaPedido/guardarPedido
// Mantiene reglas: >20 → PENDIENTE_REVISION_HUMANA, <24h → revisión, MERCADOPAGO inactivo → pendiente, zona CENTRO default → pendiente
import { analizarMensaje, obtenerContextoComercial, type AnalisisGemini, type ContextoComercial } from "./analisis";
import { calcularPedidoCompleto, normalizarZonaComercial } from "./calculator";

export function formatearMonto(n: number): string { return String(Math.round(Number(n) || 0)); }

export function construirRespuestaPedido(calculo: { items: Array<{ sabor:string; precio:number; cantidad:number }>; subtotal:number; envio:{ zona:string; costo:number; gratis:boolean }; descuento_total:number; promociones:Array<{ nombre?:string; descuento:number }>; total:number; medio_pago_sugerido?:string|null }, pagosDisponibles: Array<{ medio:string; disponible:boolean }>, esConfirmado: boolean): string {
  const lines: string[] = [];
  lines.push("¡Dale! 😊 Te armé el pedido:");
  calculo.items.forEach(item => { const sub = item.precio * item.cantidad; lines.push(item.cantidad + " x " + item.sabor + " ($" + formatearMonto(item.precio) + ") = $" + formatearMonto(sub)); });
  lines.push("Subtotal: $" + formatearMonto(calculo.subtotal));
  if (calculo.envio.costo > 0) lines.push("Envío " + calculo.envio.zona + ": $" + formatearMonto(calculo.envio.costo));
  else if (calculo.envio.gratis) lines.push("Envío " + calculo.envio.zona + ": GRATIS 🎉");
  if (calculo.descuento_total > 0) { lines.push("Descuentos: -$" + formatearMonto(calculo.descuento_total)); calculo.promociones.forEach(p => lines.push("  - " + (p.nombre || "") + ": -$" + formatearMonto(p.descuento))); }
  lines.push("────────────────────────"); lines.push("Total: $" + formatearMonto(calculo.total));
  const mediosActivos = (pagosDisponibles||[]).filter(p=>p.disponible).map(p=>p.medio);
  if (mediosActivos.length>0) { lines.push(""); if (esConfirmado) lines.push("Medio de pago: " + (calculo.medio_pago_sugerido || mediosActivos.join(" o "))); else { lines.push("¿Cómo querés abonar? " + mediosActivos.join(" o ")); lines.push("Respondé 'confirmo' para cerrar el pedido 😊"); } }
  else if (!esConfirmado) { lines.push(""); lines.push("Respondé 'confirmo' para cerrar el pedido 😊"); }
  return lines.join("\n");
}

export function detectarAnticipacionInsuficiente(mensaje: string, analisis: Partial<AnalisisGemini> & { fecha_entrega?: unknown; fecha_solicitada?: unknown; entrega_solicitada?: unknown }): boolean | null {
  const raw = String((mensaje || (analisis as { mensaje_cliente?: string }).mensaje_cliente || "")).toLowerCase();
  const msg = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const tieneFecha = (analisis as Record<string, unknown>).fecha_entrega || (analisis as Record<string, unknown>).fecha_solicitada || (analisis as Record<string, unknown>).entrega_solicitada;
  if (tieneFecha) { try { const fecha = new Date(String(tieneFecha)); if (!isNaN(fecha.getTime())) { const horas = (fecha.getTime() - Date.now())/(1000*60*60); if (horas < 24) return true; return false; } } catch {} }
  const insuf = ["hoy","ahora","ya ","urgente","en una hora","en 1 hora","en 2 horas","en dos horas","lo antes posible","cuanto antes","para hoy","para ahora"];
  if (insuf.some(k=>msg.includes(k))) return true;
  const suficiente = ["manana","pasado manana","para manana","para pasado","en 2 dias","en dos dias","el lunes","el martes","para el "];
  if (suficiente.some(k=>msg.includes(k))) return false;
  return null;
}

export function sanitizarRespuestaPrivacidad(respuesta: string): string {
  if (!respuesta) return respuesta;
  const lower = String(respuesta).toLowerCase();
  const prohibidas = ["dirección","direccion","domicilio","calle","altura","número","numero","ubicación","ubicacion","gps","coordenadas"];
  if (prohibidas.some(p=>lower.includes(p))) return "¿En qué zona estás? (Centro, Fuera del centro, o decime tu barrio/localidad y vemos el envío) — no necesitamos tu dirección exacta.";
  return respuesta;
}

export function determinarEstadoPedido(analisis: AnalisisGemini & { mensaje_cliente?: string; _errorStock?: boolean }, cliente: { Zona_Cliente?: string } | null, calculo: { items?: Array<{ cantidad:number }>; envio:{ zona:string } } | null, contextoComercial: ContextoComercial): string | null {
  if (!analisis.es_pedido) return null;
  if (!calculo) return null;
  if (analisis._errorStock) return "ERROR_STOCK";
  const cantTotal = calculo.items ? calculo.items.reduce((s,i)=>s+(Number(i.cantidad)||0),0) : (analisis.productos_detectados||[]).reduce((s,p)=>s+(Number(p.cantidad)||0),0);
  if (cantTotal > 20) return "PENDIENTE_REVISION_HUMANA";
  const anticip = detectarAnticipacionInsuficiente(analisis.mensaje_cliente || "", analisis);
  if (anticip === true) return "PENDIENTE_REVISION_HUMANA";
  if (analisis.medio_pago_mencionado) { const pago = (contextoComercial.pagos||[]).find(p=>String(p.medio).toUpperCase()===String(analisis.medio_pago_mencionado).toUpperCase()); if (!pago || !pago.disponible) return "PENDIENTE_CONFIRMACION"; }
  const esConfirmacion = analisis.etapa_venta==="CONFIRMACION" || analisis.etapa_venta==="PAGO";
  if (esConfirmacion) return "CONFIRMADO";
  const zonaExplicita = !!analisis.zona_mencionada || !!(cliente && cliente.Zona_Cliente);
  if (!zonaExplicita && calculo.envio.zona==="CENTRO") return "PENDIENTE_CONFIRMACION";
  return "PENDIENTE_CONFIRMACION";
}

export async function procesarConversacion(mensaje: string, plataforma: string, identificador: string, nombre?: string) {
  // Buscar/crear cliente stub (Supabase en prod)
  let cliente: { Cliente_ID: string; Zona_Cliente: string } = { Cliente_ID: `CLI-${identificador.slice(0,8)}`, Zona_Cliente: "" };
  const contextoComercial = await obtenerContextoComercial();
  const analisis = await analizarMensaje(mensaje, plataforma, identificador, contextoComercial) as AnalisisGemini & { mensaje_cliente?: string; _cantidadTotalSolicitada?: number; _esPedidoGrande?: boolean; _anticipacionInsuficiente?: boolean|null; _errorStock?: boolean; _errorStockMsg?: string; calculo_pedido?: unknown; respuesta_final?: string; _estadoPedido?: string; zona_normalizada?: string };
  let zonaNormalizada: string | null = null;
  if (analisis.zona_mencionada) zonaNormalizada = normalizarZonaComercial(analisis.zona_mencionada);
  let calculoPedido: Awaited<ReturnType<typeof calcularPedidoCompleto>> | null = null;
  let respuestaFinal = analisis.respuesta_sugerida || "";
  analisis.mensaje_cliente = mensaje;
  let cantidadTotal = 0;
  if (analisis.es_pedido && analisis.productos_detectados) cantidadTotal = analisis.productos_detectados.reduce((s,p)=>s+(Number(p.cantidad)||0),0);
  analisis._cantidadTotalSolicitada = cantidadTotal;
  const esPedidoGrande = cantidadTotal > 20;
  analisis._esPedidoGrande = esPedidoGrande;
  const anticipacionInsuficiente = detectarAnticipacionInsuficiente(mensaje, analisis);
  analisis._anticipacionInsuficiente = anticipacionInsuficiente;

  if (analisis.es_pedido && analisis.productos_detectados && analisis.productos_detectados.length>0) {
    try {
      const ctxParaCalculo = { ...contextoComercial, cliente: { zona: zonaNormalizada || cliente.Zona_Cliente || "CENTRO" } };
      // @ts-ignore catalog shape
      calculoPedido = calcularPedidoCompleto(analisis, ctxParaCalculo, contextoComercial.productos as unknown as Array<{ id:string; sabor:string; precio:number; stock:number; disponible:boolean }>) as unknown as typeof calculoPedido;
      const esConfirmacionResp = analisis.etapa_venta==="CONFIRMACION" || analisis.etapa_venta==="PAGO";
      if (esPedidoGrande) respuestaFinal = "Recibí tu pedido de " + cantidadTotal + " budines. Por la cantidad, primero necesitamos revisar disponibilidad y tiempo de preparación antes de confirmarlo. Te respondemos en breve 😊";
      else if (anticipacionInsuficiente===true) respuestaFinal = "Podemos revisar si llegamos a prepararlo para ese horario 😊 Como es un pedido para el mismo día, primero necesitamos confirmar disponibilidad y tiempo de preparación. Te respondemos en breve.";
      else respuestaFinal = construirRespuestaPedido(calculoPedido as unknown as Parameters<typeof construirRespuestaPedido>[0], contextoComercial.pagos as unknown as Array<{ medio:string; disponible:boolean }>, esConfirmacionResp);
    } catch (errorCalc) {
      const esStock = String(errorCalc).toLowerCase().includes("stock");
      if (esStock) { analisis._errorStock=true; analisis._errorStockMsg=String(errorCalc); if (esPedidoGrande) respuestaFinal = "Recibí tu pedido de " + cantidadTotal + " budines. Por la cantidad, primero necesitamos revisar disponibilidad y tiempo de preparación antes de confirmarlo. Te respondemos en breve 😊"; else respuestaFinal = "No podemos confirmar tu pedido: " + String(errorCalc) + ". ¿Querés ajustar cantidades?"; }
      else respuestaFinal = "Hubo un problema calculando tu pedido. " + String(errorCalc);
    }
  }

  // Sanitizar privacidad
  respuestaFinal = sanitizarRespuestaPrivacidad(respuestaFinal);

  // Determinar estado
  if (calculoPedido && !analisis._errorStock) {
    const esConfirmacion = analisis.etapa_venta==="CONFIRMACION" || analisis.etapa_venta==="PAGO";
    const zonaExplicita = !!analisis.zona_mencionada || !!cliente.Zona_Cliente;
    let estadoPedido = "PENDIENTE_CONFIRMACION";
    const cantidadTotalCalc = (calculoPedido as { items?: Array<{ cantidad:number }> }).items ? (calculoPedido as { items: Array<{ cantidad:number }> }).items.reduce((s,i)=>s+(Number(i.cantidad)||0),0) : cantidadTotal;
    const anticipInsuf: boolean | null = detectarAnticipacionInsuficiente(mensaje, analisis);
    if (cantidadTotalCalc>20 || (anticipInsuf as unknown)===true) estadoPedido="PENDIENTE_REVISION_HUMANA";
    else if (esConfirmacion && cantidadTotalCalc<=20 && (anticipInsuf as unknown)!==true) estadoPedido="CONFIRMADO";
    else if (!zonaExplicita && (calculoPedido as { envio:{ zona:string } }).envio.zona==="CENTRO") estadoPedido="PENDIENTE_CONFIRMACION";
    let medioPagoValidado = analisis.medio_pago_mencionado || "";
    if (medioPagoValidado) { const pagoConfig=(contextoComercial.pagos||[]).find(p=>String(p.medio).toUpperCase()===String(medioPagoValidado).toUpperCase()); if(!pagoConfig||!pagoConfig.disponible){ medioPagoValidado=""; if(estadoPedido==="CONFIRMADO") estadoPedido="PENDIENTE_CONFIRMACION"; } }
    // guardarPedido stub — en prod: prisma.order.create
    console.log("[core] guardarPedido", { cliente: cliente.Cliente_ID, total: (calculoPedido as { total:number }).total, estadoPedido, medioPagoValidado, zonaNormalizada });
    (analisis as Record<string,unknown>)._estadoPedido = estadoPedido;
    (analisis as Record<string,unknown>)._medioPagoValidado = medioPagoValidado;
  }
  if (calculoPedido) { (analisis as Record<string,unknown>).calculo_pedido = calculoPedido; (analisis as Record<string,unknown>).respuesta_final = respuestaFinal; if (analisis._errorStock) (analisis as Record<string,unknown>)._estadoPedido="ERROR_STOCK"; }
  return { status:"ok", cliente_id: cliente.Cliente_ID, analisis, calculo_pedido: calculoPedido, respuesta_final: respuestaFinal };
}
