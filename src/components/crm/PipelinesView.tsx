// components/crm/PipelinesView.tsx — Fase 0.6 — Vista Embudo/kanban (extracción verbatim)
"use client";
import { Plus } from "lucide-react";
import { ACCENT } from "./theme";
import { pipelines } from "./data";
import type { Pipelines, ToastFn } from "./types";

export function PipelinesView({ pipelinesReal, showToast }: {
  pipelinesReal: Pipelines | null;
  showToast: ToastFn;
}) {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-5 max-w-[1600px] mx-auto">
        <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Embudo • Pedidos</div><div className="text-[12px] text-[#666] mt-1">Kanban Close CRM • Nuevo → Cotizado → Pagado → Horneando → Entregado</div></div>
        <div className="flex items-center gap-2"><span className="text-[11px] mono text-[#666] bg-[#121212] border border-[#1e1e1e] px-3 py-1.5 rounded-full">Total en embudo: $50.600 ARS</span><button onClick={() => showToast("Nuevo pedido creado")} className="h-8 px-3 rounded-full text-black font-bold text-[12px] flex items-center gap-1" style={{ background: ACCENT }}><Plus size={14} /> Nuevo pedido</button></div>
      </div>
      {pipelinesReal && <div className="text-[10px] mono text-[#8ab66a] bg-[#0f1a0a] border border-[#1e3a0f] px-2 py-1 rounded-full mb-2 inline-block">● Embudo real Supabase • {Object.values(pipelinesReal).flat().length} pedidos</div>}
      <div className="flex flex-col md:flex-row gap-3 md:overflow-x-auto md:snap-x md:snap-mandatory pb-4 max-w-[1600px] mx-auto overflow-visible">
        {Object.entries(pipelinesReal || pipelines).map(([col, items]) => (
          <div key={col} className="w-full md:w-[260px] md:shrink-0 shrink-0 snap-start rounded-[16px] bg-[#101010] border border-[#1c1c1c] flex flex-col">
            <div className="p-3.5 flex items-center justify-between border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: col === "Nuevo Lead" ? "#6a6a6a" : col === "Cotizado" ? "#8a8a8a" : col === "Pagado" ? ACCENT : col === "Horneando" ? "#ffd21f" : "#6ee7b7" }} /><span className="text-[11px] font-bold tracking-[0.08em]">{col.toUpperCase()}</span><span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#1a1a1a] mono text-[#666]">{items.length}</span></div><span className="text-[#444]">⋯</span>
            </div>
            <div className="p-2 space-y-2 flex-1">
              {items.map(t => (
                <div key={t.name} className="rounded-[12px] bg-[#151515] border border-[#232323] p-3 hover:border-[#2a2a2a] hover:bg-[#191919] transition cursor-grab group">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#1e1e1e] grid place-items-center text-[10px] font-bold">{t.initials}</div><span className="text-[12.5px] font-semibold">{t.name}</span></div><span className="text-[10px] mono text-[#666]">{t.time}</span></div>
                  <div className="mt-2.5 flex items-center justify-between"><span className="text-[11px] px-2 py-1 rounded-full bg-[#101010] border border-[#1e1e1e] text-[#8a8a8a]">{t.flavor}</span><span className="text-[12px] font-bold mono">{t.amount}</span></div>
                  <div className="mt-2.5 h-1 rounded-full bg-[#1a1a1a] overflow-hidden opacity-0 group-hover:opacity-100 transition"><div className="h-full w-[60%] rounded-full" style={{ background: ACCENT }} /></div>
                </div>
              ))}
              <button onClick={() => showToast(`Agregar en ${col}`)} className="w-full h-8 rounded-[10px] border border-dashed border-[#232323] text-[11px] text-[#555] hover:text-[#8a8a8a]">+ Agregar tarjeta</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
