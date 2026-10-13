// components/crm/ContenidoView.tsx — Fase 0.6 — Vista Contenido/generador IA (extracción verbatim)
"use client";
import { Image as ImageIcon, Wand2, Clock, Send } from "lucide-react";
import { ACCENT } from "./theme";
import type { ToastFn } from "./types";

const EDITORIAL_WEEK = [
  { day: "Lun", sabor: "Chocolate", estado: "publicado", likes: 12 },
  { day: "Mar", sabor: "—", estado: "vacio" },
  { day: "Mié", sabor: "Limón", estado: "programado" },
  { day: "Jue", sabor: "Banana", estado: "borrador" },
  { day: "Vie", sabor: "Mix", estado: "programado" },
  { day: "Sáb", sabor: "Chocolate", estado: "borrador" },
  { day: "Dom", sabor: "—", estado: "cerrado" },
] as { day: string; sabor: string; estado: string; likes?: number }[];

export function ContenidoView({ saborGen, setSaborGen, tonoGen, setTonoGen, previewCopy, generando, onGenerar, showToast }: {
  saborGen: string;
  setSaborGen: (v: string) => void;
  tonoGen: string;
  setTonoGen: (v: string) => void;
  previewCopy: string;
  generando: boolean;
  onGenerar: () => void;
  showToast: ToastFn;
}) {
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><div className="text-[22px] font-extrabold tracking-[-0.02em] flex items-center gap-2"><ImageIcon size={22} /> Contenido</div><div className="text-[12px] text-[#666] mt-1">Calendario editorial + generador IA stock-aware • Rescatado de Sheets Contenidos/Estrategias • IG Graph queue</div></div>
        <span className="text-[11px] mono px-3 py-1.5 rounded-full bg-[#121212] border border-[#1e1e1e] text-[#666]">IGQ token → POST /{`{ig_user_id}`}/media</span>
      </div>

      {/* Generador */}
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
        <div className="flex items-center gap-2 mb-4"><Wand2 size={16} className="text-[#a3ff12]" /><span className="font-bold text-[14px]">Generador con IA</span><span className="text-[11px] px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#777] mono">stock-aware • no inventa</span></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">SABOR</label><select value={saborGen} onChange={e => setSaborGen(e.target.value)} className="mt-1 w-full h-9 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-3 text-[13px] outline-none"><option value="chocolate">Chocolate doble — BRN-CHO-04</option><option value="limon">Limón glaseado — BRN-LIM-01</option><option value="banana-chocolate">Banana con chocolate — BRN-BAN-03</option><option value="vainilla">Tradicional vainilla — BRN-TRA-02</option><option value="mixto">Mix — BRN-MIX-05</option></select></div>
          <div><label className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">TONO</label><select value={tonoGen} onChange={e => setTonoGen(e.target.value)} className="mt-1 w-full h-9 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-3 text-[13px] outline-none"><option value="cordial">Cordial</option><option value="humor">Con humor</option><option value="directo">Directo</option></select></div>
          <div className="flex items-end"><button onClick={onGenerar} disabled={generando} className="w-full h-9 rounded-xl text-black font-bold text-[13px] flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: ACCENT }}>{generando ? "Generando..." : <><Wand2 size={14} /> Generar copy</>}</button></div>
        </div>
        {previewCopy && (
          <div className="mt-4 rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] p-4">
            <div className="text-[11px] font-bold tracking-wide text-[#5a5a5a] mb-2">PREVIEW COPY</div>
            <p className="text-[13px] leading-relaxed text-[#d8d8d8]">{previewCopy}</p>
            <div className="mt-3 flex gap-2"><button onClick={() => showToast("Contenido programado → IG Graph queue (stub)")} className="h-8 px-4 rounded-full text-black font-bold text-[12px] flex items-center gap-1.5" style={{ background: ACCENT }}><Clock size={12} /> Programar</button><button onClick={() => showToast("Publicado ahora (demo)")} className="h-8 px-4 rounded-full bg-[#1a1a1a] border border-[#232323] text-[12px] font-medium flex items-center gap-1.5"><Send size={12} /> Publicar ahora</button></div>
            <p className="mt-2 text-[10px] mono text-[#444]">lib/engine/contenido.ts → obtenerContextoComercial() verifica stock antes de sugerir. Si stock 0 no programa. Guardado en contenidos {`{borrador/programado/publicado}`}</p>
          </div>
        )}
      </div>

      {/* Calendario editorial week */}
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
        <div className="flex items-center justify-between mb-4"><span className="font-bold text-[14px]">Calendario editorial — esta semana</span><span className="text-[11px] mono text-[#666] bg-[#0f0f0f] border border-[#1e1e1e] px-2 py-1 rounded-full">Lun → Dom</span></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {EDITORIAL_WEEK.map(d => (
            <div key={d.day} className={`rounded-[14px] border p-3 min-h-[140px] ${d.estado === "cerrado" ? "bg-[#0a0a0a] border-[#141414]" : d.estado === "publicado" ? "bg-[#0f1a0a] border-[#1e3a0f]" : d.estado === "programado" ? "bg-[#0f0f0f] border-[#1e3a0f]" : "bg-[#0f0f0f] border-[#1e1e1e]"}`}>
              <div className="text-[11px] font-bold tracking-wide flex items-center justify-between">{d.day.toUpperCase()} {d.estado === "publicado" && <span className="w-2 h-2 rounded-full bg-emerald-400" />}</div>
              <div className="mt-3">
                {d.sabor === "—" ? <span className="text-[11px] text-[#444]">{d.estado === "cerrado" ? "Cerrado" : "Sin post"}</span> : (
                  <>
                    <div className="w-full h-16 rounded-[10px] bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[11px] text-[#666]">{d.sabor}</div>
                    <div className="mt-2 text-[11px] font-medium">{d.sabor}</div>
                    <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full font-bold border ${d.estado === "publicado" ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : d.estado === "programado" ? "bg-[#1a1500] border-[#2a2200] text-[#ffd21f]" : "bg-[#141414] border-[#222] text-[#777]"}`}>{d.estado.toUpperCase()}</span>
                    {d.likes && <div className="mt-1 text-[10px] mono text-[#666]">♥ {d.likes} • reach 210</div>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
