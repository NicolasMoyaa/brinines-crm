// components/crm/ConversationsView.tsx — Fase 0.6 — Vista Conversaciones/inbox (extracción verbatim)
"use client";
import { Search, Phone, Check } from "lucide-react";
import { ACCENT } from "./theme";
import { conversations } from "./data";
import type { Conversation, ToastFn } from "./types";

export function ConversationsView({ conversationsReal, inboxSource, showToast }: {
  conversationsReal: Conversation[] | null;
  inboxSource: string;
  showToast: ToastFn;
}) {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      <div className="w-full md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-[#1c1c1c] bg-[#0f0f0f] flex flex-col max-h-[45vh] md:max-h-none">
        <div className="p-3 border-b border-[#1c1c1c] flex items-center gap-2">
          <div className="flex-1 relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" /><input placeholder="Buscar conversaciones..." className="h-8 w-full bg-[#121212] border border-[#1e1e1e] rounded-full pl-8 pr-3 text-[12px] placeholder:text-[#555] outline-none" /></div>
          <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[12px]">◧</button>
        </div>
        {inboxSource && <div className="px-3 py-1 text-[10px] mono text-[#8ab66a] bg-[#0f1a0a] border-b border-[#1e3a0f]">{inboxSource.includes("db") ? `● Históricas DB (${(conversationsReal || conversations).length}) — al conectar IG_ACCESS_TOKEN verás DMs reales de @brinines_ en tiempo real` : inboxSource === "graph" ? `● Graph vivo — DMs reales de @brinines_` : `● ${(conversationsReal || conversations).length} conversaciones`}</div>}
        <div className="flex-1 overflow-y-auto">
          {(conversationsReal || conversations).map(c => (
            <button key={c.id} className="w-full text-left p-3 flex gap-3 border-b border-[#141414] hover:bg-[#111] transition">
              <div className="w-9 h-9 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold shrink-0">{c.avatar}</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between"><span className="text-[13px] font-semibold truncate">{c.name}</span><span className="text-[10px] mono text-[#5a5a5a]">{c.time}</span></div>
                <div className="text-[11.5px] text-[#7a7a7a] truncate mt-0.5">{c.lastMsg}</div>
                <div className="flex items-center gap-1.5 mt-1.5"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#222] text-[#666] tracking-wide">{c.tag.toUpperCase()}</span><span className="text-[10px] text-[#555]">• {c.flavor}</span></div>
              </div>
              {c.unread > 0 && <div className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold text-black self-center" style={{ background: ACCENT }}>{c.unread}</div>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#0b0b0b] min-w-0">
        <div className="h-[56px] border-b border-[#1c1c1c] bg-[#0f0f0f] flex items-center justify-between px-4">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold">LH</div><div><div className="text-[13px] font-bold flex items-center gap-2">Lucía H. <span className="w-2 h-2 rounded-full bg-emerald-400" /></div><div className="text-[11px] text-[#666]">3815550124 • Amante del chocolate</div></div></div>
          <div className="flex items-center gap-1.5"><button onClick={() => showToast("Llamada WhatsApp iniciada")} className="h-8 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium flex items-center gap-1"><Phone size={12} /> Llamar</button><button onClick={() => showToast("Pedido movido a Pagado")} className="h-8 px-3 rounded-full text-black font-bold text-[11px] flex items-center gap-1" style={{ background: ACCENT }}><Check size={12} /> Marcar Pagado</button></div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {[{ from: "them", text: "Hola! Quiero 3 de chocolate y 2 de limón, zona Centro", time: "14:22" }, { from: "me", text: "¡Dale Lucía! 😊 Te armé el pedido:\n3 x chocolate ($7000) = $21000\n2 x limon ($5500) = $11000\nSubtotal: $32000\nEnvío CENTRO: GRATIS 🎉\n────────────────────────\nTotal: $32000\n¿Confirmo?", time: "14:23" }, { from: "system", text: "Lucía confirmó — pedido #PED-42 • $32.000 • Pagado", time: "14:24" }].map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : m.from === "system" ? "justify-center" : "justify-start"}`}>
              {m.from === "system" ? <div className="text-[11px] px-3 py-1.5 rounded-full bg-[#151515] border border-[#222] text-[#7a7a7a] mono">{m.text} • {m.time}</div> :
                <div className={`max-w-[68%] px-3.5 py-2.5 rounded-[18px] text-[13px] leading-[1.4] whitespace-pre-wrap ${m.from === "me" ? "text-black rounded-br-[6px]" : "bg-[#171717] border border-[#232323] text-[#e0e0e0] rounded-bl-[6px]"}`} style={m.from === "me" ? { background: ACCENT } : {}}>{m.text}<div className={`text-[10px] mt-1 mono ${m.from === "me" ? "text-black/60" : "text-[#666]"}`}>{m.time} {m.from === "me" ? "✓✓" : ""}</div></div>}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#1c1c1c] bg-[#0f0f0f]">
          <div className="flex items-center gap-2"><div className="flex-1 h-10 bg-[#121212] border border-[#1e1e1e] rounded-full flex items-center px-1"><input placeholder="Escribe un mensaje... usa / para atajos" className="flex-1 bg-transparent outline-none text-[13px] px-3 placeholder:text-[#555]" /><button onClick={() => showToast("Mensaje enviado")} className="w-8 h-8 rounded-full grid place-items-center text-black font-bold" style={{ background: ACCENT }}>↗</button></div></div>
          <div className="flex gap-1.5 mt-2">{["Precio $4.600", "Alias brinines.mp", "Retiro 18hs", "Gracias 🥐"].map(s => <button key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-[#151515] border border-[#222] text-[#777] hover:text-[#c8c8c8]">{s}</button>)}</div>
        </div>
      </div>
    </div>
  );
}
