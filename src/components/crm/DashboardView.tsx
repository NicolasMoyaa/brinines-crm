// components/crm/DashboardView.tsx — Fase 0.6 — Vista Dashboard (extracción verbatim)
"use client";
import { Sparkles } from "lucide-react";
import { ACCENT } from "./theme";
import { kpis, ventasSabor, pedidos } from "./data";
import type { Kpi, Pedido, TabSetter } from "./types";

export function DashboardView({ kpisReal, ordersReal, setTab }: {
  kpisReal: Kpi[] | null;
  ordersReal: Pedido[] | null;
  setTab: TabSetter;
}) {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1320px] mx-auto">
      {/* KPIs */}
      {kpisReal && <div className="text-[10px] mono text-[#8ab66a] bg-[#0f1a0a] border border-[#1e3a0f] px-2 py-1 rounded-full mb-2 inline-block">● Datos reales Supabase • {kpisReal[0]?.value} leads, {kpisReal[1]?.value} órdenes</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {(kpisReal || kpis).map(k => (
          <div key={k.label} className="relative rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-4 overflow-hidden group hover:border-[#262626] transition">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-[0.12] -translate-y-8 translate-x-8" style={{ background: k.accent ? ACCENT : "#fff" }} />
            <div className="flex items-start justify-between">
              <span className="text-[10px] tracking-[0.14em] font-bold text-[#5a5a5a]">{k.label}</span>
              <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[#7a7a7a]"><Sparkles size={14} /></div>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-[26px] font-extrabold tracking-[-0.03em] leading-none">{k.value}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold mb-1 border" style={{ background: k.label.includes("REVENUE") ? "#12210a" : "#1a1a1a", color: k.label.includes("REVENUE") ? ACCENT : "#8a8a8a", borderColor: k.label.includes("REVENUE") ? "#1f3a0f" : "#232323" }}>{k.delta}</span>
            </div>
            <div className="text-[11px] text-[#666] mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-bold text-[14px] tracking-tight">Ventas por sabor</div>
              <div className="text-[11px] text-[#666] mt-0.5">Últimos 30 días • 27 budines • @brinines_ 201 seguidores</div>
            </div>
            <span className="text-[10px] mono px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#222] text-[#777]">TUC • BRININES</span>
          </div>
          <div className="space-y-3">
            {ventasSabor.map(s => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-[12px] mb-1.5"><span className="font-medium">{s.name}</span><span className="mono text-[#8a8a8a]">{s.count} uds • {s.pct}%</span></div>
                <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] p-3"><div className="text-[10px] text-[#5a5a5a] font-bold tracking-wide">HORA PICO</div><div className="text-[13px] font-semibold mt-1">18:00-20:00</div><div className="text-[11px] text-[#666]">Retiros tarde</div></div>
            <div className="rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] p-3"><div className="text-[10px] text-[#5a5a5a] font-bold tracking-wide">TICKET PROM</div><div className="text-[13px] font-semibold mt-1">$5.400 ARS</div><div className="text-[11px] text-[#666]">+ envío</div></div>
            <div className="rounded-xl p-3 border" style={{ background: `${ACCENT}14`, borderColor: `${ACCENT}30` }}><div className="text-[10px] font-bold tracking-wide" style={{ color: ACCENT }}>MÁS PEDIDO</div><div className="text-[13px] font-bold mt-1 text-white">Chocolate</div><div className="text-[11px]" style={{ color: ACCENT }}>44% ventas • 12 likes</div></div>
          </div>
        </div>

        <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[14px]">Últimos pedidos</span>
            <button onClick={() => setTab("pipelines")} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#8a8a8a] hover:text-white">Ver embudo →</button>
          </div>
          {ordersReal && <div className="text-[10px] mono text-[#8ab66a] mb-2">● {ordersReal.length} pedidos reales desde Supabase</div>}
          <div className="space-y-2.5">
            {(ordersReal || pedidos).map(p => (
              <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#222] transition">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] grid place-items-center text-[11px] font-bold">{p.initials}</div>
                <div className="flex-1 min-w-0"><div className="text-[12.5px] font-semibold truncate">{p.name} • {p.flavor}</div><div className="text-[11px] text-[#666]">{p.time} • {p.amount}</div></div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border tracking-wide ${p.status === "Pagado" ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : p.status === "Horneando" ? "bg-[#1a1500] border-[#2a2200] text-[#ffd21f]" : p.status === "Entregado" ? "bg-[#0f1a1a] border-[#1a2a2a] text-[#6ee7b7]" : p.status === "Cotizado" ? "bg-[#141414] border-[#222] text-[#9a9a9a]" : "bg-[#1a1a1a] border-[#2a2a2a] text-[#c8c8c8]"}`}>{p.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 flex gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden flex">
              <div className="h-full bg-[#3a3a3a]" style={{ width: "15%" }} /><div className="h-full bg-[#5a5a5a]" style={{ width: "15%" }} /><div className="h-full" style={{ width: "15%", background: ACCENT }} /><div className="h-full bg-[#ffd21f]" style={{ width: "30%" }} /><div className="h-full bg-[#6ee7b7]" style={{ width: "25%" }} />
            </div>
          </div>
          <p className="mt-3 text-[10px] text-[#4a4a4a] mono">BRININES CRM OS — bg-[#a3ff12] accent — 5 SKUs: BRN-LIM-01 5500, BRN-TRA-02 5000, BRN-BAN-03 6500, BRN-CHO-04 7000, BRN-MIX-05 6000</p>
        </div>
      </div>
    </div>
  );
}
