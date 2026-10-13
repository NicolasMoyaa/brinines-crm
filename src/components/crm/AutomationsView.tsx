// components/crm/AutomationsView.tsx — Fase 0.6 — Vista Automatizaciones (extracción verbatim)
"use client";
import { Zap } from "lucide-react";
import { ACCENT } from "./theme";
import { automations } from "./data";
import type { ToastFn } from "./types";

export function AutomationsView({ showToast }: { showToast: ToastFn }) {
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Automatizaciones</div><div className="text-[12px] text-[#666] mt-1">4 flujos MOTOR-fidelity • 292 ejecuciones este mes • $48k atribuido • GHL Clone</div></div>
        <button onClick={() => showToast("Nueva automatización creada (demo)")} className="h-9 px-4 rounded-full text-black font-bold text-[13px]" style={{ background: ACCENT }}>+ Nueva automatización</button>
      </div>
      <div className="space-y-3">
        {automations.map(a => (
          <div key={a.name} className={`rounded-[16px] border p-4 flex items-center gap-4 transition ${a.active ? "bg-[#121212] border-[#1e1e1e]" : "bg-[#0f0f0f] border-[#161616] opacity-70"}`}>
            <div className={`w-10 h-10 rounded-[12px] grid place-items-center border ${a.active ? "bg-[#151515] border-[#232323]" : "bg-[#111] border-[#1a1a1a] text-[#555]"}`}><Zap size={16} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="text-[13.5px] font-bold">{a.name}</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#6a6a6a] mono">{a.trigger}</span></div>
              <div className="text-[11.5px] text-[#6a6a6a] mt-1 leading-snug truncate">{a.desc}</div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right"><div className="text-[11px] text-[#5a5a5a] font-bold tracking-wide">EJECUCIONES</div><div className="text-[13px] font-bold mono">{a.runs}</div></div>
              <div className="text-right"><div className="text-[11px] text-[#5a5a5a] font-bold tracking-wide">CONV</div><div className="text-[13px] font-bold mono" style={{ color: a.active ? ACCENT : "#666" }}>{a.conv}</div></div>
              <div className={`w-[44px] h-[26px] rounded-full p-[2px] flex ${a.active ? "justify-end" : "justify-start bg-[#1e1e1e] border border-[#2a2a2a]"}`} style={a.active ? { background: ACCENT } : {}}><div className="w-[22px] h-[22px] rounded-full bg-white shadow-sm" style={a.active ? {} : { background: "#3a3a3a" }} /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[14px] bg-[#0f1a0a] border border-[#1e3a0f] p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#12210a] border border-[#1e3a0f] grid place-items-center text-[12px]">🛡️</div>
        <div><div className="text-[12px] font-bold text-[#a3ff12]">MOTOR fidelity — 4 invasivas desactivadas</div><div className="text-[11px] text-[#8ab66a] mt-1">Churn 21d • Abandono 2h • Recurrencia 14d fija • Bienvenida masiva → reemplazadas por Segmentación silenciosa + Experimentos + Contenido orgánico. Filosofía Tucumán: no forzar venta.</div></div>
      </div>
    </div>
  );
}
