// components/crm/ReportingView.tsx — Fase 0.6 — Vista Reportes (extracción verbatim)
"use client";
import { ACCENT } from "./theme";
import type { TabSetter } from "./types";

export function ReportingView({ setTab }: { setTab: TabSetter }) {
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto space-y-6">
      <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Reportes</div><div className="text-[12px] text-[#666] mt-1">Atribución por automatización y canal • Últimos 30 días</div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">INGRESO POR AUTOMATIZACIÓN</div><div className="text-[28px] font-extrabold mt-2">$48.300 <span className="text-[14px] font-medium text-[#666]">ARS</span></div><div className="text-[11px] text-[#666] mt-1">67% del total viene de autos</div></div>
        <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">CANAL ORIGEN</div><div className="mt-4 space-y-3"><div><div className="flex justify-between text-[12px] mb-1"><span>Instagram Story</span><span className="mono">58%</span></div><div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: "58%", background: ACCENT }} /></div></div><div><div className="flex justify-between text-[12px] mb-1"><span>WhatsApp Directo</span><span className="mono">27%</span></div><div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: "27%" }} /></div></div></div></div>
        <div className="rounded-[16px] p-5 border text-black" style={{ background: ACCENT, borderColor: `${ACCENT}50` }}><div className="text-[11px] font-bold tracking-wide text-black/60">RESUMEN MES</div><div className="text-[14px] font-bold mt-3 leading-snug">Tu automatización #1 (Story Reply) generó 34 leads extra sin esfuerzo.</div><button onClick={() => setTab("automations")} className="mt-4 h-8 px-4 rounded-full bg-black text-white text-[12px] font-bold">Revisar autos →</button></div>
      </div>
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="font-bold text-[13px]">Embudo completo</div><div className="mt-4 flex flex-col md:flex-row items-stretch gap-3">{[{ label: "Visitas perfil", v: "1.240" }, { label: "DMs", v: "201" }, { label: "Cotizados", v: "67" }, { label: "Pagados", v: "32" }, { label: "Entregados", v: "27" }].map((f, i) => (
        <div key={f.label} className="flex-1">
          <div className="text-[11px] text-[#666]">{f.label}</div><div className="text-[16px] font-bold mono mt-1">{f.v}</div><div className="h-1.5 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.max(24, 100 - i * 18)}%`, background: i === 3 ? ACCENT : "#fff" }} /></div>
        </div>
      ))}</div></div>
    </div>
  );
}
