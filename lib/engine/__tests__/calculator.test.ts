// @ts-nocheck
import { matchProductos, validarStock, calcularSubtotal, calcularEnvio, evaluarPromociones, calcularTotal, calcularPedidoCompleto, normalizarZonaComercial } from "../calculator";

// Test stub — replica test_Calculator de Apps Script
describe("calculator deterministico", () => {
  const mockCatalogo = [
    { id: "PROD-CHO", sabor: "Chocolate", precio: 4500, stock: 50, disponible: true, categoria: "Clasicos" },
    { id: "PROD-LIM", sabor: "Limon", precio: 4200, stock: 30, disponible: true, categoria: "Clasicos" },
    { id: "PROD-SAZ", sabor: "Sin Azucar", precio: 5200, stock: 8, disponible: true, categoria: "Especiales" }
  ];
  const mockEnvios = [
    { zona: "CENTRO", costo: 800, minimoGratis: 6000 },
    { zona: "FUERA_CENTRO", costo: 1500, minimoGratis: 8000 },
    { zona: "OTRA_LAS_TALITAS", costo: 2000, minimoGratis: 10000 }
  ];
  test("normalizarZonaComercial Las Talitas -> OTRA_LAS_TALITAS", () => {
    expect(normalizarZonaComercial("Las Talitas")).toBe("OTRA_LAS_TALITAS");
  });
  test("normalizarZonaComercial CENTRO", () => {
    expect(normalizarZonaComercial("CENTRO")).toBe("CENTRO");
    expect(normalizarZonaComercial("Centro")).toBe("CENTRO");
  });
  test("calcularEnvio CENTRO gratis", () => {
    expect(calcularEnvio("CENTRO", 7000, mockEnvios).costo).toBe(0);
  });
  test("calcularPedidoCompleto OTRA_LAS_TALITAS total 21400", () => {
    const ctx = { envios: mockEnvios, promociones: [{ id:"PROMO-2", tipo:"DESCUENTO_MONTO", valor:500, condicion:{ min_total:10000 } }], cliente: { zona:"CENTRO" } } as unknown as Parameters<typeof calcularPedidoCompleto>[1];
    const analisis = { productos_detectados: [{ sabor:"Chocolate", cantidad:3 },{ sabor:"Limon", cantidad:2 }], zona_mencionada:"Las Talitas", medio_pago_mencionado:null };
    const r = calcularPedidoCompleto(analisis, ctx, mockCatalogo);
    expect(r.envio.zona).toBe("OTRA_LAS_TALITAS");
    expect(r.total).toBe(21400);
  });
});
