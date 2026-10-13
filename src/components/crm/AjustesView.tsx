// components/crm/AjustesView.tsx — Fase 0.6 — Vista Ajustes + Meta Panel (extracción verbatim)
"use client";
import { Settings, Calendar, Image as ImageIcon, MessageSquare, Zap } from "lucide-react";
import { ACCENT } from "./theme";
import type { BoolSetter, ToastFn } from "./types";

export function AjustesView({ connGoogle, setConnGoogle, connMeta, setConnMeta, connUpstash, setConnUpstash, waConnected, setWaConnected, lastSync, maskSecret, showToast, probarConexion }: {
  connGoogle: boolean; setConnGoogle: BoolSetter;
  connMeta: boolean; setConnMeta: BoolSetter;
  connUpstash: boolean; setConnUpstash: BoolSetter;
  waConnected: boolean; setWaConnected: BoolSetter;
  lastSync: Record<string, string>;
  maskSecret: (v: string) => string;
  showToast: ToastFn;
  probarConexion: (id: string) => void;
}) {
  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[22px] font-extrabold tracking-[-0.02em] flex items-center gap-2"><Settings size={22} /> Ajustes</div>
          <div className="text-[12px] text-[#666] mt-1">Gestión centralizada de conexiones e integraciones • Activar, desactivar, reconectar y verificar estado sin exponer secretos</div>
        </div>
        <span className="hidden md:inline text-[10px] mono px-2.5 py-1 rounded-full bg-[#121212] border border-[#1e1e1e] text-[#6a6a6a]">v1 • Registry escalable</span>
      </div>

      {/* Conexiones */}
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-[14px]">Conexiones</span>
          <span className="text-[11px] mono text-[#666] bg-[#0f0f0f] border border-[#1e1e1e] px-2 py-1 rounded-full">4 activas • registry.ts</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Google Calendar */}
          <div className="rounded-[14px] bg-[#0f0f0f] border border-[#1e1e1e] p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#1a1a1a] border border-[#232323] grid place-items-center"><Calendar size={16} className="text-[#a3ff12]" /></div>
                <div><div className="text-[13px] font-bold">Google Calendar</div><div className="text-[11px] text-[#666]">Horneadas → eventos 60+10 min</div></div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${connGoogle ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : "bg-[#141414] border-[#222] text-[#777]"}`}>{connGoogle ? "CONECTADO" : "DESACTIVADO"}</span>
            </div>
            <div className="text-[11px] mono text-[#555]">Env: {maskSecret(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "")} • <span className="text-[#6a6a6a]">{connGoogle ? "Configurado" : "Pausado"}</span> • Última sync: {lastSync.google}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setConnGoogle(v => !v)} className={`relative w-10 h-5 rounded-full transition ${connGoogle ? "bg-[#a3ff12]" : "bg-[#222] border border-[#2a2a2a]"}`} aria-label="Toggle Google"><span className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition ${connGoogle ? "left-[20px]" : "left-[2px] bg-[#666]"}`} /></button>
              <span className="text-[11px] font-medium text-[#8a8a8a]">{connGoogle ? "Activado" : "Desactivado"}</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => showToast("Google OAuth stub — requiere GOOGLE_CLIENT_ID")} className="h-7 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium hover:bg-[#1e1e1e]">Reconectar</button>
                <button onClick={() => probarConexion("google")} className="h-7 px-3 rounded-full text-black font-bold text-[11px]" style={{ background: ACCENT }}>Probar</button>
              </div>
            </div>
          </div>
          {/* Instagram Graph */}
          <div className="rounded-[14px] bg-[#0f0f0f] border border-[#1e1e1e] p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#1a1a1a] border border-[#232323] grid place-items-center"><ImageIcon size={16} className="text-[#a3ff12]" /></div>
                <div><div className="text-[13px] font-bold">Instagram Graph</div><div className="text-[11px] text-[#666]">v20.0 • IG 462599807...</div></div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${connMeta ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : "bg-[#141414] border-[#222] text-[#777]"}`}>{connMeta ? "CONECTADO" : "DESACTIVADO"}</span>
            </div>
            <div className="text-[11px] mono text-[#555]">ID: 462599807041091902815 • Token: {connMeta ? "configurado (server)" : "no configurado"} • Última sync: {lastSync.meta}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setConnMeta(v => !v)} className={`relative w-10 h-5 rounded-full transition ${connMeta ? "bg-[#a3ff12]" : "bg-[#222] border border-[#2a2a2a]"}`} aria-label="Toggle Meta"><span className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition ${connMeta ? "left-[20px]" : "left-[2px] bg-[#666]"}`} /></button>
              <span className="text-[11px] font-medium text-[#8a8a8a]">{connMeta ? "Activado" : "Desactivado"}</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => showToast("Meta OAuth stub — requiere IG_ACCESS_TOKEN")} className="h-7 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium hover:bg-[#1e1e1e]">Reconectar</button>
                <button onClick={() => probarConexion("meta")} className="h-7 px-3 rounded-full text-black font-bold text-[11px]" style={{ background: ACCENT }}>Probar</button>
              </div>
            </div>
          </div>
          {/* WhatsApp */}
          <div className="rounded-[14px] bg-[#0f0f0f] border border-[#1e1e1e] p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#1a1a1a] border border-[#232323] grid place-items-center"><MessageSquare size={16} className="text-[#a3ff12]" /></div>
                <div><div className="text-[13px] font-bold">WhatsApp Cloud</div><div className="text-[11px] text-[#666]">Wa 5493813562078</div></div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${waConnected ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : "bg-[#1a1500] border-[#2a2200] text-[#ffd21f]"}`}>{waConnected ? "CONECTADO" : "DESCONECTADO"}</span>
            </div>
            <div className="text-[11px] mono text-[#555]">Uso: 156/200 • Última sync: {lastSync.wa}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setWaConnected(v => !v); showToast(!waConnected ? "WhatsApp conectado" : "WhatsApp desconectado"); }} className={`relative w-10 h-5 rounded-full transition ${waConnected ? "bg-[#a3ff12]" : "bg-[#222] border border-[#2a2a2a]"}`} aria-label="Toggle WA"><span className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition ${waConnected ? "left-[20px]" : "left-[2px] bg-[#666]"}`} /></button>
              <span className="text-[11px] font-medium text-[#8a8a8a]">{waConnected ? "Activado" : "Desactivado"}</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => showToast(waConnected ? "WhatsApp reconectado" : "Conectar WhatsApp — requiere token")} className="h-7 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium hover:bg-[#1e1e1e]">Reconectar</button>
                <button onClick={() => probarConexion("wa")} className="h-7 px-3 rounded-full text-black font-bold text-[11px]" style={{ background: ACCENT }}>Probar</button>
              </div>
            </div>
          </div>
          {/* Upstash */}
          <div className="rounded-[14px] bg-[#0f0f0f] border border-[#1e1e1e] p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#1a1a1a] border border-[#232323] grid place-items-center"><Zap size={16} className="text-[#a3ff12]" /></div>
                <div><div className="text-[13px] font-bold">Upstash Redis</div><div className="text-[11px] text-[#666]">BullMQ • Queue</div></div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${connUpstash ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : "bg-[#141414] border-[#222] text-[#777]"}`}>{connUpstash ? "CONECTADO" : "DESACTIVADO"}</span>
            </div>
            <div className="text-[11px] mono text-[#555]">Env: {maskSecret(process.env.NEXT_PUBLIC_UPSTASH_URL || "")} • Última sync: {lastSync.upstash}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setConnUpstash(v => !v)} className={`relative w-10 h-5 rounded-full transition ${connUpstash ? "bg-[#a3ff12]" : "bg-[#222] border border-[#2a2a2a]"}`} aria-label="Toggle Upstash"><span className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition ${connUpstash ? "left-[20px]" : "left-[2px] bg-[#666]"}`} /></button>
              <span className="text-[11px] font-medium text-[#8a8a8a]">{connUpstash ? "Activado" : "Desactivado"}</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => showToast("Upstash stub — requiere UPSTASH_REDIS_REST_URL")} className="h-7 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium hover:bg-[#1e1e1e]">Reconectar</button>
                <button onClick={() => probarConexion("upstash")} className="h-7 px-3 rounded-full text-black font-bold text-[11px]" style={{ background: ACCENT }}>Probar</button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-[#0f1a0a] border border-[#1e3a0f] px-4 py-3 text-[11px] text-[#8ab66a] flex items-center gap-2"><Settings size={14} /> Registry escalable: agregar una conexión nueva = 1 entrada en <span className="mono bg-black/20 px-1.5 py-0.5 rounded">lib/connections/registry.ts</span> — UI la renderiza automáticamente.</div>
      </div>

      {/* Meta Panel */}
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><ImageIcon size={18} className="text-[#a3ff12]" /><span className="font-bold text-[14px]">Meta — Panel de Control</span><span className="text-[11px] mono px-2 py-0.5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] text-[#666]">@brinines_</span></div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${connMeta ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : "bg-[#141414] border-[#222] text-[#777]"}`}>{connMeta ? "VIVO" : "STUB"}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-[12px] bg-[#0f0f0f] border border-[#1e1e1e] p-3"><div className="text-[11px] text-[#666] mono">SEGUIDORES</div><div className="text-[18px] font-extrabold mt-1">201</div><div className="text-[10px] text-[#8ab66a]">+12 hoy</div></div>
          <div className="rounded-[12px] bg-[#0f0f0f] border border-[#1e1e1e] p-3"><div className="text-[11px] text-[#666] mono">ER</div><div className="text-[18px] font-extrabold mt-1">3.88%</div><div className="text-[10px] text-[#8a8a8a]">7.8 likes avg</div></div>
          <div className="rounded-[12px] bg-[#0f0f0f] border border-[#1e1e1e] p-3"><div className="text-[11px] text-[#666] mono">TOP POST</div><div className="text-[13px] font-bold mt-1">BRN-CHO-04</div><div className="text-[10px] text-[#8ab66a]">12 likes • 2 comments</div></div>
        </div>
        <div className="rounded-[12px] bg-[#0f0f0f] border border-[#1e1e1e] p-4">
          <div className="text-[12px] font-bold mb-2">Conexión Instagram Graph v20.0</div>
          <div className="text-[11px] mono text-[#555] space-y-1"><div>ID: 462599807041091902815 • Token: {connMeta ? "configurado (server)" : "no configurado"}</div><div>Estado: {connMeta ? "Configurado (stub hasta token real)" : "Pausado por Ajustes"} • Última sync: {lastSync.meta}</div></div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => probarConexion("meta")} className="h-8 px-4 rounded-full text-black font-bold text-[12px]" style={{ background: ACCENT }}>Probar conexión</button>
            <button onClick={() => showToast("Meta inbox stub — 3 conversaciones cargadas")} className="h-8 px-4 rounded-full bg-[#1a1a1a] border border-[#232323] text-[12px] font-medium">Cargar conversaciones</button>
            <button onClick={() => showToast("DM stub enviado")} className="h-8 px-4 rounded-full bg-[#1a1a1a] border border-[#232323] text-[12px] font-medium">Enviar DM prueba</button>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              { name: "Florencia T.", msg: "Hola, quiero 3x Chocolate", time: "2m" },
              { name: "Lucia H.", msg: "¿Tienen stock de Limón?", time: "18m" },
              { name: "Sofia G.", msg: "Gracias! riquísimo", time: "1h" },
            ].map(c => (
              <div key={c.name} className="rounded-[10px] bg-[#0a0a0a] border border-[#1a1a1a] p-3"><div className="text-[12px] font-semibold">{c.name}</div><div className="text-[11px] text-[#8a8a8a] truncate">{c.msg}</div><div className="text-[10px] mono text-[#555] mt-1">{c.time}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
