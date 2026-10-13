// components/crm/CalendarView.tsx — Fase 0.6 — Vista Calendario/horneadas (extracción verbatim)
"use client";
import { Clock } from "lucide-react";
import { ACCENT } from "./theme";

const WEEK = [
  { day: "Lun 11", slots: [{ time: "18:00", name: "Lucía H.", flavor: "Chocolate" }] },
  { day: "Mar 12", slots: [{ time: "17:30", name: "Martina P.", flavor: "Banana" }, { time: "19:00", name: "Camila N.", flavor: "2x Choco" }] },
  { day: "Mié 13", slots: [] as { time: string; name: string; flavor: string; hl?: boolean }[] },
  { day: "Jue 14", slots: [{ time: "18:30", name: "Florencia T.", flavor: "3x Choco", hl: true }] },
  { day: "Vie 15", slots: [{ time: "16:00", name: "Sofia G.", flavor: "Tradicional" }] },
  { day: "Sáb 16", slots: [{ time: "10:00", name: "Agustina M.", flavor: "2x Limón" }, { time: "11:30", name: "Valentina D.", flavor: "Limón" }] },
  { day: "Dom 17", slots: [] as { time: string; name: string; flavor: string; hl?: boolean }[], closed: true },
];

export function CalendarView() {
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <div className="text-[22px] font-extrabold tracking-[-0.02em]">Calendario • Horneadas</div><div className="text-[12px] text-[#666] mt-1 mb-6">Agenda de producción y entregas • Vista semanal • Google Calendar con alarma 60+10 min</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {WEEK.map(d => (
          <div key={d.day} className={`rounded-[14px] border p-3 min-h-[220px] ${d.closed ? "bg-[#0a0a0a] border-[#141414]" : "bg-[#121212] border-[#1e1e1e]"}`}>
            <div className="text-[11px] font-bold tracking-wide">{d.day.toUpperCase()}</div>
            <div className="mt-3 space-y-2">{d.slots.length === 0 ? <div className="text-[11px] text-[#444] mt-8 text-center">{d.closed ? "Cerrado • Descanso" : "Sin horneadas"}</div> : d.slots.map(s => (
              <div key={s.time} className={`rounded-[10px] p-2.5 border text-[11px] ${s.hl ? "border-[#3a3a0a] text-black" : "bg-[#0f0f0f] border-[#1e1e1e] text-[#c8c8c8]"}`} style={s.hl ? { background: ACCENT } : {}}><div className="font-bold mono">{s.time}</div><div className="font-medium mt-0.5">{s.name}</div><div className={`text-[10px] ${s.hl ? "text-black/60" : "text-[#666]"}`}>{s.flavor}</div></div>
            ))}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[#0f1a0a] border border-[#1e3a0f] px-4 py-3 flex items-center gap-2 text-[11px] text-[#8ab66a]"><Clock size={14} /> Google Calendar conectado — cada horneada crea evento con alarma 60 min + 10 min (popup nativo iPhone).</div>
    </div>
  );
}
