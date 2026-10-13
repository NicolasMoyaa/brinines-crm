// components/crm/Topbar.tsx — Fase 0.6 — Barra superior (extracción verbatim)
"use client";
import { Menu } from "lucide-react";
import { ACCENT, IG_AVATAR } from "./theme";
import type { ToastFn } from "./types";

export function Topbar({ onMenu, waConnected, onToggleWa, showToast }: {
  onMenu: () => void;
  waConnected: boolean;
  onToggleWa: () => void;
  showToast: ToastFn;
}) {
  return (
    <div className="h-[64px] shrink-0 flex items-center justify-between px-3 lg:px-6 border-b border-[#1c1c1c] bg-[#0f0f0f]/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
        <button onClick={onMenu} className="lg:hidden w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-white shrink-0" aria-label="Abrir menú"><Menu size={16} /></button>
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          {IG_AVATAR ? (
            <img src={IG_AVATAR} alt="Brinines @brinines_" className="w-8 h-8 rounded-full object-cover hidden sm:block border border-[#232323]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white text-black grid place-items-center font-black text-[13px] hidden sm:grid border border-[#232323]" title="Brinines @brinines_">B</div>
          )}
          <div className="leading-none min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[13.5px] truncate"><span className="hidden sm:inline">BRININES CRM OS v1 - GHL Clone</span><span className="sm:hidden">BRININES</span></span>
              <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#262626] text-[#8a8a8a] mono">201 seguidores</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
            </div>
            <div className="text-[11px] text-[#6a6a6a] mt-1 hidden sm:flex items-center gap-1.5"><span>Tucumán • Budines artesanales</span><span className="opacity-40">•</span><span className="text-[#8a8a8a] hidden md:inline">Estética GoHighLevel • Wa 5493813562078</span></div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-[#1e1e1e]">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/24?img=${10 + i}`} alt="" className="w-6 h-6 rounded-full border-2 border-[#0f0f0f]" />)}
          </div>
          <span className="text-[11px] text-[#666]">+198 activos hoy</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 text-[11px] mono text-[#5a5a5a] bg-[#111] border border-[#1e1e1e] px-3 py-1.5 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Embudo activo</div>
        <button onClick={() => { onToggleWa(); showToast(waConnected ? "WhatsApp desconectado" : "WhatsApp conectado ✓ Brinines listo"); }} className={`h-9 px-4 rounded-full text-[13px] font-bold tracking-tight flex items-center gap-2 border transition ${waConnected ? "bg-[#1a1a1a] border-[#2a2a2a] text-white" : "text-black border-transparent"}`} style={waConnected ? {} : { background: ACCENT }}>
          {waConnected ? "● WhatsApp conectado" : "◍ Conectar WhatsApp"}
        </button>
      </div>
    </div>
  );
}
