// components/crm/ContactsView.tsx — Fase 0.6 — Vista Contactos (extracción verbatim)
"use client";
import { Search } from "lucide-react";
import { ACCENT } from "./theme";
import { contacts } from "./data";
import type { Contact, ToastFn } from "./types";

export function ContactsView({ contactsReal, showToast }: {
  contactsReal: Contact[] | null;
  showToast: ToastFn;
}) {
  return (
    <div className="p-4 lg:p-6 max-w-[1320px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Contactos {contactsReal && <span className="text-[12px] font-bold px-2 py-1 rounded-full bg-[#0f1a0a] border border-[#1e3a0f] text-[#a3ff12] ml-2">● REAL {contactsReal.length} DB</span>}</div><div className="text-[12px] text-[#666] mt-1">{contactsReal ? `${contactsReal.length} contactos • DB Supabase sa-east-1 • tiempo real` : "201 contactos • 8 VIP • Tucumán base • LTV real"}</div></div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" /><input placeholder="Buscar por nombre, tag, sabor..." className="h-9 w-[280px] bg-[#121212] border border-[#1e1e1e] rounded-full pl-9 pr-3 text-[13px] placeholder:text-[#555] outline-none focus:border-[#2a2a2a]" /></div>
          <button onClick={() => showToast("Export CSV generado")} className="h-9 px-4 rounded-full bg-[#1a1a1a] border border-[#262626] text-[13px] font-medium">Exportar</button>
          <button onClick={() => showToast("Nuevo contacto demo creado")} className="h-9 px-4 rounded-full text-black font-bold text-[13px]" style={{ background: ACCENT }}>+ Nuevo contacto</button>
        </div>
      </div>
      <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[640px] hidden md:table">
            <thead><tr className="text-[10px] tracking-[0.14em] font-bold text-[#5a5a5a] border-b border-[#1a1a1a]"><th className="py-3 px-5">CONTACTO</th><th className="py-3 px-3">UBICACIÓN</th><th className="py-3 px-3">TAG</th><th className="py-3 px-3">SABOR FAV</th><th className="py-3 px-3">LTV</th><th className="py-3 px-3">PEDIDOS</th><th className="py-3 px-5 text-right">ESTADO</th></tr></thead>
            <tbody>{(contactsReal || contacts).map(c => (<tr key={c.id} className="border-b border-[#151515] last:border-0 hover:bg-[#101010] transition"><td className="py-3.5 px-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold">{c.avatar}</div><div><div className="text-[13px] font-semibold">{c.name}</div><div className="text-[11px] mono text-[#666]">{c.phone}</div></div></div></td><td className="py-3.5 px-3 text-[12px] text-[#8a8a8a]">{c.city}</td><td className="py-3.5 px-3"><span className="text-[11px] px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#8a8a8a] mono">{c.tag}</span></td><td className="py-3.5 px-3 text-[12px]">{(c as Contact).flavor || c.tag}</td><td className="py-3.5 px-3 text-[12px] font-bold mono">{c.ltv}</td><td className="py-3.5 px-3 text-[12px] mono text-[#8a8a8a]">{c.orders} • {c.last}</td><td className="py-3.5 px-5 text-right"><span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${c.status === "VIP" ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : c.status === "caliente" ? "bg-[#1a1500] border-[#2a2200] text-[#ffd21f]" : "bg-[#141414] border-[#222] text-[#8a8a8a]"}`}>{c.status.toUpperCase()}</span></td></tr>))}</tbody>
          </table>
        </div>
        {/* Mobile cards 375px */}
        <div className="md:hidden p-3 space-y-2">
          {(contactsReal || contacts).map(c => (
            <div key={c.id} className="rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold shrink-0">{c.avatar}</div>
              <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold truncate">{c.name}</div><div className="text-[11px] mono text-[#666] truncate">{c.phone} • {c.city}</div><div className="flex items-center gap-1.5 mt-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#8a8a8a] mono">{c.tag}</span><span className="text-[10px] text-[#666]">{c.flavor}</span></div></div>
              <div className="text-right"><div className="text-[12px] font-bold mono">{c.ltv}</div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.status === "VIP" ? "bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]" : c.status === "caliente" ? "bg-[#1a1500] border-[#2a2200] text-[#ffd21f]" : "bg-[#141414] border-[#222] text-[#8a8a8a]"}`}>{c.status.toUpperCase()}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
