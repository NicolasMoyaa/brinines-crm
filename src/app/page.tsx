"use client";
import { useState } from "react";
// BRININES CRM v1 - GoHighLevel Clone - Basado en @brinines_ 201 followers
// Referencia: GoHighLevel $97/mes - Clon all-in-one. Ver BRININES_MASTER_PLAN.md
export default function BrininesCRM() {
  const [tab, setTab] = useState("dashboard");
  const kpis = [
    {label: "Leads (Followers)", value: "201", sub: "@brinines_"},
    {label: "Orders Estimados", value: "12", sub: "3.88% ER"},
    {label: "Revenue ARS", value: "$72k", sub: "últimos 30d"},
    {label: "Views 30d", value: "26", sub: "panel profesional"},
  ];
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <h1 className="text-3xl font-bold text-[#a3ff12]">BRININES CRM OS v1 - GHL Clone</h1>
      <p className="text-zinc-400">Referencia: GoHighLevel + Close CRM | @brinines_ 201 followers | Wa 5493813562078</p>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {kpis.map(k=>(
          <div key={k.label} className="border border-zinc-800 p-4 rounded-xl bg-zinc-900">
            <div className="text-zinc-400 text-xs">{k.label}</div>
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-xs text-zinc-500">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        {["dashboard","conversations","contacts","pipelines","automations","reporting"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm ${tab===t?"bg-[#a3ff12] text-black":"bg-zinc-800"}`}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="mt-6 border border-zinc-800 rounded-xl p-6 bg-zinc-900 min-h-[400px]">
        {tab==="dashboard" && <div>Dashboard con gráfico ventas por sabor: Chocolate 12, Tradicional 6, Banana 5, Limón 4. Tabla últimos pedidos. Ver artifact completo en HTML para UI premium.</div>}
        {tab==="conversations" && <div>Inbox estilo Close CRM - Lista chats izq + chat der. Mock DMs de clientes pidiendo budines.</div>}
        {tab==="contacts" && <div>Contacts LTV - 8 clientes Tucumán mock con tags chocolate-lover, limon, recurrente.</div>}
        {tab==="pipelines" && <div>Kanban: Nuevo Lead | Cotizado | Pagado | Horneando | Entregado</div>}
        {tab==="automations" && <div>8 automatizaciones con toggle: Story Reply, Abandono 2h, Review 48h, Churn 21d, Upsell, Tag Auto, Recurrencia 14d, Bienvenida</div>}
        {tab==="reporting" && <div>Reporting runs/conversiones por automatización</div>}
      </div>
      <p className="mt-6 text-xs text-zinc-600">BRININES CRM OS — bg-[#a3ff12] accent — 5 SKUs: BRN-LIM-01 5500, BRN-TRA-02 5000, BRN-BAN-03 6500, BRN-CHO-04 7000, BRN-MIX-05 6000 — Mock 201 leads</p>
    </div>
  )
}
