"use client";
import { useState } from "react";
import { LayoutDashboard, MessageSquare, Users, Kanban, Zap, BarChart3, Calendar, Search, Plus, Phone, Check, Sparkles } from "lucide-react";

// BRININES CRM v1 - GoHighLevel Clone — PREMIUM DARK ($97/mo aesthetic)
// Referencia: GoHighLevel + Close CRM | @brinines_ 201 followers | GoHighLevel all-in-one pipelines+inbox+automations flat pricing
// Alta calidad — no html del 2000: Inter + JetBrains Mono, #0b0b0b/#121212/#a3ff12, blur, borders, motion sutil

const ACCENT = "#a3ff12";

const kpis = [
  { label: "LEADS TOTAL", value: "201", delta: "+12 hoy", sub: "IG + WhatsApp", accent: false },
  { label: "ÓRDENES EST.", value: "12", delta: "+3 hoy", sub: "Este mes", accent: false },
  { label: "REVENUE", value: "$72.000", delta: "+23%", sub: "ARS estimado", accent: true },
  { label: "CONVERSIÓN", value: "3,88%", delta: "↑ 0.6%", sub: "Lead → Pago", accent: false },
];

const ventasSabor = [
  { name: "Chocolate doble", count: 12, pct: 100, color: ACCENT },
  { name: "Tradicional vainilla", count: 6, pct: 50, color: "#fff" },
  { name: "Banana con nuez", count: 5, pct: 41, color: "#8a8a8a" },
  { name: "Limón glaseado", count: 4, pct: 33, color: "#555" },
];

const pedidos = [
  { name: "Florencia T.", initials: "FT", flavor: "3x Chocolate", amount: "$13.800", status: "Horneando", time: "1h" },
  { name: "Lucía H.", initials: "LH", flavor: "Chocolate", amount: "$4.600", status: "Pagado", time: "2m" },
  { name: "Martina P.", initials: "MP", flavor: "Banana", amount: "$4.600", status: "Nuevo", time: "18m" },
  { name: "Sofia G.", initials: "SG", flavor: "Tradicional", amount: "$4.600", status: "Entregado", time: "5h" },
  { name: "Camila N.", initials: "CN", flavor: "2x Choco", amount: "$9.200", status: "Cotizado", time: "Ayer" },
];

const contacts = [
  { id: 1, name: "Florencia Torres", phone: "381 555-0123", city: "Centro", tag: "chocolate-lover", flavor: "Chocolate", ltv: "$18.400", orders: 4, last: "hace 2d", status: "VIP", avatar: "FT" },
  { id: 2, name: "Lucía Herrera", phone: "381 555-0124", city: "Las Talitas", tag: "recurrente", flavor: "Limón", ltv: "$14.200", orders: 3, last: "hace 5d", status: "caliente", avatar: "LH" },
  { id: 3, name: "Sofia Gómez", phone: "381 555-0125", city: "Yerba Buena", tag: "nuevo", flavor: "Tradicional", ltv: "$4.600", orders: 1, last: "hoy", status: "nuevo", avatar: "SG" },
  { id: 4, name: "Martina Paz", phone: "381 555-0126", city: "Fuera Centro", tag: "banana", flavor: "Banana", ltv: "$9.800", orders: 2, last: "hace 1d", status: "tibia", avatar: "MP" },
];

const conversations = [
  { id: "c1", name: "Lucía H.", avatar: "LH", lastMsg: "Quiero 3 de chocolate y 2 de limón, zona Centro", time: "2m", tag: "pedido", flavor: "Chocolate", unread: 2 },
  { id: "c2", name: "Martina P.", avatar: "MP", lastMsg: "Hola! Qué sabores tienen hoy? 😊", time: "18m", tag: "consulta", flavor: "Banana", unread: 0 },
  { id: "c3", name: "Sofia G.", avatar: "SG", lastMsg: "Gracias! Llegó perfecto 🥐", time: "5h", tag: "postventa", flavor: "Tradicional", unread: 0 },
];

const pipelines: Record<string, typeof pedidos> = {
  "Nuevo Lead": [{ name: "Sofia G.", initials: "SG", flavor: "Tradicional", amount: "$4.600", status: "Nuevo", time: "5h" }],
  "Cotizado": [{ name: "Camila N.", initials: "CN", flavor: "2x Choco", amount: "$9.200", status: "Cotizado", time: "Ayer" }],
  "Pagado": [{ name: "Lucía H.", initials: "LH", flavor: "Chocolate", amount: "$4.600", status: "Pagado", time: "2m" }],
  "Horneando": [{ name: "Florencia T.", initials: "FT", flavor: "3x Chocolate", amount: "$13.800", status: "Horneando", time: "1h" }],
  "Entregado": [{ name: "Agustina M.", initials: "AM", flavor: "2x Limón", amount: "$9.200", status: "Entregado", time: "Ayer" }],
};

const automations = [
  { name: "Story Reply Auto DM", trigger: "story_reply", desc: "Respuesta automática a story replies con catálogo + precios", runs: 142, conv: "18%", active: true },
  { name: "Abandono 2h", trigger: "dm_received 2h", desc: "Foto chocolate top + botón WA si no ordenó en 2h", runs: 89, conv: "12%", active: true },
  { name: "Post-Entrega Review 48h", trigger: "order_delivered +48h", desc: "Pedir review + 10% próxima compra", runs: 27, conv: "41%", active: true },
  { name: "Churn 21d", trigger: "last_order >21d", desc: "¿Extrañás el de chocolate? + oferta", runs: 34, conv: "9%", active: false },
];

function Sidebar({ tab, setTab }: { tab: string; setTab: (v: string) => void }) {
  const Nav = ({ id, label, icon: Icon, count }: { id: string; label: string; icon: typeof LayoutDashboard; count?: number }) => {
    const active = tab === id;
    return (
      <button onClick={() => setTab(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition ${active ? "bg-[#1e1e1e] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-[#2a2a2a]" : "text-[#8a8a8a] hover:text-[#c8c8c8] hover:bg-[#161616] border border-transparent"}`}>
        <Icon size={16} className={`${active ? "opacity-100" : "opacity-70"}`} />
        <span className="flex-1 text-left">{label}</span>
        {count !== undefined && <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white text-black" : "bg-[#222] text-[#777]"}`}>{count}</span>}
        {active && <div className="w-1 h-4 rounded-full" style={{ background: ACCENT }} />}
      </button>
    );
  };
  return (
    <div className="w-[252px] shrink-0 bg-[#0f0f0f] border-r border-[#1c1c1c] flex flex-col hidden lg:flex">
      <div className="h-[64px] flex items-center gap-3 px-5 border-b border-[#1c1c1c]">
        <div className="w-8 h-8 rounded-[9px] bg-white text-black grid place-items-center font-black text-[15px] tracking-tighter">B</div>
        <div className="leading-none">
          <div className="font-extrabold text-[14px] tracking-[-0.02em]">BRININES</div>
          <div className="text-[10px] tracking-[0.14em] text-[#6a6a6a] font-semibold mt-[2px]">CRM • V1 GHL CLONE</div>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: ACCENT }} />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">PRINCIPAL</div>
          <div className="space-y-1">
            <Nav id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <Nav id="conversations" label="Conversations" icon={MessageSquare} count={3} />
            <Nav id="contacts" label="Contacts" icon={Users} count={201} />
            <Nav id="pipelines" label="Pipelines" icon={Kanban} />
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">AUTOMATIZACIÓN</div>
          <div className="space-y-1">
            <Nav id="automations" label="Automations" icon={Zap} count={8} />
            <Nav id="reporting" label="Reporting" icon={BarChart3} />
            <Nav id="calendar" label="Calendar" icon={Calendar} />
          </div>
        </div>
        <div className="mx-1 mt-6 rounded-[14px] bg-[#151515] border border-[#232323] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wide text-[#9a9a9a]">WHATSAPP USAGE</span>
            <span className="text-[10px] mono text-[#666]">78%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#222] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "78%", background: ACCENT }} />
          </div>
          <div className="text-[11px] text-[#666] mt-2">156 / 200 conversaciones este mes</div>
        </div>
      </div>
      <div className="p-3 border-t border-[#1c1c1c]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-[#151515] border border-[#232323]">
          <div className="w-7 h-7 rounded-full bg-[#222] grid place-items-center text-[11px] font-bold">NM</div>
          <div className="flex-1 leading-none">
            <div className="text-[12.5px] font-semibold">Nico Moyaa</div>
            <div className="text-[11px] text-[#6a6a6a]">Owner • Admin</div>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#1e1e1e] grid place-items-center text-[12px]">⋯</div>
        </div>
      </div>
    </div>
  );
}

export default function BrininesCRM() {
  const [tab, setTab] = useState("dashboard");
  const [waConnected, setWaConnected] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#e8e8e8] antialiased overflow-hidden selection:bg-[#a3ff12]/30">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-full text-[13px] font-medium shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ACCENT }} />{toast}
        </div>
      )}
      <div className="flex h-screen">
        <Sidebar tab={tab} setTab={setTab} />
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0b0b]">
          {/* Top bar */}
          <div className="h-[64px] shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-[#1c1c1c] bg-[#0f0f0f]/80 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="brinines" className="w-8 h-8 rounded-full object-cover hidden sm:block" />
                <div className="leading-none">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13.5px]">BRININES CRM OS v1 - GHL Clone</span>
                    <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#262626] text-[#8a8a8a] mono">201 followers</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-[#6a6a6a] mt-1 hidden sm:flex items-center gap-1.5"><span>Tucumán • Budines artesanales</span><span className="opacity-40">•</span><span className="text-[#8a8a8a]">GoHighLevel aesthetic • Wa 5493813562078</span></div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-[#1e1e1e]">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/24?img=${10+i}`} alt="" className="w-6 h-6 rounded-full border-2 border-[#0f0f0f]" />)}
                </div>
                <span className="text-[11px] text-[#666]">+198 activos hoy</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-[11px] mono text-[#5a5a5a] bg-[#111] border border-[#1e1e1e] px-3 py-1.5 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Pipeline activo</div>
              <button onClick={() => { setWaConnected(!waConnected); showToast(waConnected ? "WhatsApp desconectado" : "WhatsApp conectado ✓ Brinines listo"); }} className={`h-9 px-4 rounded-full text-[13px] font-bold tracking-tight flex items-center gap-2 border transition ${waConnected ? "bg-[#1a1a1a] border-[#2a2a2a] text-white" : "text-black border-transparent"}`} style={waConnected ? {} : { background: ACCENT }}>
                {waConnected ? "● WhatsApp conectado" : "◍ Connect WhatsApp"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "dashboard" && (
              <div className="p-4 lg:p-6 space-y-6 max-w-[1320px] mx-auto">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {kpis.map(k => (
                    <div key={k.label} className="relative rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-4 overflow-hidden group hover:border-[#262626] transition">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-[0.12] -translate-y-8 translate-x-8" style={{ background: k.accent ? ACCENT : "#fff" }} />
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] tracking-[0.14em] font-bold text-[#5a5a5a]">{k.label}</span>
                        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[#7a7a7a]"><Sparkles size={14} /></div>
                      </div>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-[26px] font-extrabold tracking-[-0.03em] leading-none">{k.value}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold mb-1 border" style={{ background: k.label.includes("REVENUE") ? "#12210a" : "#1a1a1a", color: k.label.includes("REVENUE") ? ACCENT : "#8a8a8a", borderColor: k.label.includes("REVENUE") ? "#1f3a0f" : "#232323" }}>{k.delta}</span>
                      </div>
                      <div className="text-[11px] text-[#666] mt-1.5">{k.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                  <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-bold text-[14px] tracking-tight">Ventas por sabor</div>
                        <div className="text-[11px] text-[#666] mt-0.5">Últimos 30 días • 27 budines • @brinines_ 201 followers</div>
                      </div>
                      <span className="text-[10px] mono px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#222] text-[#777]">TUC • BRININES</span>
                    </div>
                    <div className="space-y-3">
                      {ventasSabor.map(s => (
                        <div key={s.name}>
                          <div className="flex items-center justify-between text-[12px] mb-1.5"><span className="font-medium">{s.name}</span><span className="mono text-[#8a8a8a]">{s.count} uds • {s.pct}%</span></div>
                          <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} /></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] p-3"><div className="text-[10px] text-[#5a5a5a] font-bold tracking-wide">TOP HORA</div><div className="text-[13px] font-semibold mt-1">18:00-20:00</div><div className="text-[11px] text-[#666]">Retiros tarde</div></div>
                      <div className="rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] p-3"><div className="text-[10px] text-[#5a5a5a] font-bold tracking-wide">TICKET PROM</div><div className="text-[13px] font-semibold mt-1">$5.400 ARS</div><div className="text-[11px] text-[#666]">+ envío</div></div>
                      <div className="rounded-xl p-3 border" style={{ background: `${ACCENT}14`, borderColor: `${ACCENT}30` }}><div className="text-[10px] font-bold tracking-wide" style={{ color: ACCENT }}>MÁS PEDIDO</div><div className="text-[13px] font-bold mt-1 text-white">Chocolate</div><div className="text-[11px]" style={{ color: ACCENT }}>44% ventas • 12 likes</div></div>
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-[14px]">Últimos pedidos</span>
                      <button onClick={() => setTab("pipelines")} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#8a8a8a] hover:text-white">Ver pipeline →</button>
                    </div>
                    <div className="space-y-2.5">
                      {pedidos.map(p => (
                        <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#222] transition">
                          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] grid place-items-center text-[11px] font-bold">{p.initials}</div>
                          <div className="flex-1 min-w-0"><div className="text-[12.5px] font-semibold truncate">{p.name} • {p.flavor}</div><div className="text-[11px] text-[#666]">{p.time} • {p.amount}</div></div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border tracking-wide ${p.status==="Pagado"?"bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]":p.status==="Horneando"?"bg-[#1a1500] border-[#2a2200] text-[#ffd21f]":p.status==="Entregado"?"bg-[#0f1a1a] border-[#1a2a2a] text-[#6ee7b7]":p.status==="Cotizado"?"bg-[#141414] border-[#222] text-[#9a9a9a]":"bg-[#1a1a1a] border-[#2a2a2a] text-[#c8c8c8]"}`}>{p.status.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 flex gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden flex">
                        <div className="h-full bg-[#3a3a3a]" style={{ width: "15%" }} /><div className="h-full bg-[#5a5a5a]" style={{ width: "15%" }} /><div className="h-full" style={{ width: "15%", background: ACCENT }} /><div className="h-full bg-[#ffd21f]" style={{ width: "30%" }} /><div className="h-full bg-[#6ee7b7]" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] text-[#4a4a4a] mono">BRININES CRM OS — bg-[#a3ff12] accent — 5 SKUs: BRN-LIM-01 5500, BRN-TRA-02 5000, BRN-BAN-03 6500, BRN-CHO-04 7000, BRN-MIX-05 6000</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "contacts" && (
              <div className="p-4 lg:p-6 max-w-[1320px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Contacts</div><div className="text-[12px] text-[#666] mt-1">201 contactos • 8 VIP • Tucumán base • LTV real</div></div>
                  <div className="flex items-center gap-2">
                    <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" /><input placeholder="Buscar por nombre, tag, sabor..." className="h-9 w-[280px] bg-[#121212] border border-[#1e1e1e] rounded-full pl-9 pr-3 text-[13px] placeholder:text-[#555] outline-none focus:border-[#2a2a2a]" /></div>
                    <button onClick={() => showToast("Export CSV generado")} className="h-9 px-4 rounded-full bg-[#1a1a1a] border border-[#262626] text-[13px] font-medium">Export</button>
                    <button onClick={() => showToast("Nuevo contacto demo creado")} className="h-9 px-4 rounded-full text-black font-bold text-[13px]" style={{ background: ACCENT }}>+ New contact</button>
                  </div>
                </div>
                <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[720px]">
                    <thead><tr className="text-[10px] tracking-[0.14em] font-bold text-[#5a5a5a] border-b border-[#1a1a1a]"><th className="py-3 px-5">CONTACTO</th><th className="py-3 px-3">UBICACIÓN</th><th className="py-3 px-3">TAG</th><th className="py-3 px-3">SABOR FAV</th><th className="py-3 px-3">LTV</th><th className="py-3 px-3">PEDIDOS</th><th className="py-3 px-5 text-right">ESTADO</th></tr></thead>
                    <tbody>{contacts.map(c => (<tr key={c.id} className="border-b border-[#151515] last:border-0 hover:bg-[#101010] transition"><td className="py-3.5 px-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold">{c.avatar}</div><div><div className="text-[13px] font-semibold">{c.name}</div><div className="text-[11px] mono text-[#666]">{c.phone}</div></div></div></td><td className="py-3.5 px-3 text-[12px] text-[#8a8a8a]">{c.city}</td><td className="py-3.5 px-3"><span className="text-[11px] px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#8a8a8a] mono">{c.tag}</span></td><td className="py-3.5 px-3 text-[12px]">{c.flavor}</td><td className="py-3.5 px-3 text-[12px] font-bold mono">{c.ltv}</td><td className="py-3.5 px-3 text-[12px] mono text-[#8a8a8a]">{c.orders} • {c.last}</td><td className="py-3.5 px-5 text-right"><span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${c.status==="VIP"?"bg-[#12210a] border-[#1e3a0f] text-[#a3ff12]":c.status==="caliente"?"bg-[#1a1500] border-[#2a2200] text-[#ffd21f]":"bg-[#141414] border-[#222] text-[#8a8a8a]"}`}>{c.status.toUpperCase()}</span></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "conversations" && (
              <div className="flex h-[calc(100vh-64px)]">
                <div className="w-[320px] shrink-0 border-r border-[#1c1c1c] bg-[#0f0f0f] hidden md:flex flex-col">
                  <div className="p-3 border-b border-[#1c1c1c] flex items-center gap-2">
                    <div className="flex-1 relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" /><input placeholder="Search conversations..." className="h-8 w-full bg-[#121212] border border-[#1e1e1e] rounded-full pl-8 pr-3 text-[12px] placeholder:text-[#555] outline-none" /></div>
                    <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[12px]">◧</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map(c => (
                      <button key={c.id} className="w-full text-left p-3 flex gap-3 border-b border-[#141414] hover:bg-[#111] transition">
                        <div className="w-9 h-9 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold shrink-0">{c.avatar}</div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between"><span className="text-[13px] font-semibold truncate">{c.name}</span><span className="text-[10px] mono text-[#5a5a5a]">{c.time}</span></div>
                          <div className="text-[11.5px] text-[#7a7a7a] truncate mt-0.5">{c.lastMsg}</div>
                          <div className="flex items-center gap-1.5 mt-1.5"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#222] text-[#666] tracking-wide">{c.tag.toUpperCase()}</span><span className="text-[10px] text-[#555]">• {c.flavor}</span></div>
                        </div>
                        {c.unread>0 && <div className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold text-black self-center" style={{ background: ACCENT }}>{c.unread}</div>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-[#0b0b0b] min-w-0">
                  <div className="h-[56px] border-b border-[#1c1c1c] bg-[#0f0f0f] flex items-center justify-between px-4">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1e1e1e] grid place-items-center text-[11px] font-bold">LH</div><div><div className="text-[13px] font-bold flex items-center gap-2">Lucía H. <span className="w-2 h-2 rounded-full bg-emerald-400" /></div><div className="text-[11px] text-[#666]">3815550124 • Chocolate lover</div></div></div>
                    <div className="flex items-center gap-1.5"><button onClick={() => showToast("Llamada WhatsApp iniciada")} className="h-8 px-3 rounded-full bg-[#1a1a1a] border border-[#232323] text-[11px] font-medium flex items-center gap-1"><Phone size={12} /> Call</button><button onClick={() => showToast("Pedido movido a Pagado")} className="h-8 px-3 rounded-full text-black font-bold text-[11px] flex items-center gap-1" style={{ background: ACCENT }}><Check size={12} /> Marcar Pagado</button></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {[{from:"them",text:"Hola! Quiero 3 de chocolate y 2 de limón, zona Centro",time:"14:22"},{from:"me",text:"¡Dale Lucía! 😊 Te armé el pedido:\n3 x chocolate ($7000) = $21000\n2 x limon ($5500) = $11000\nSubtotal: $32000\nEnvío CENTRO: GRATIS 🎉\n────────────────────────\nTotal: $32000\n¿Confirmo?",time:"14:23"},{from:"system",text:"Lucía confirmó — pedido #PED-42 • $32.000 • Pagado",time:"14:24"}].map((m,i)=>(
                      <div key={i} className={`flex ${m.from==="me"?"justify-end":m.from==="system"?"justify-center":"justify-start"}`}>
                        {m.from==="system" ? <div className="text-[11px] px-3 py-1.5 rounded-full bg-[#151515] border border-[#222] text-[#7a7a7a] mono">{m.text} • {m.time}</div> :
                          <div className={`max-w-[68%] px-3.5 py-2.5 rounded-[18px] text-[13px] leading-[1.4] whitespace-pre-wrap ${m.from==="me"?"text-black rounded-br-[6px]":"bg-[#171717] border border-[#232323] text-[#e0e0e0] rounded-bl-[6px]"}`} style={m.from==="me"?{background:ACCENT}:{}}>{m.text}<div className={`text-[10px] mt-1 mono ${m.from==="me"?"text-black/60":"text-[#666]"}`}>{m.time} {m.from==="me"?"✓✓":""}</div></div>}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#1c1c1c] bg-[#0f0f0f]">
                    <div className="flex items-center gap-2"><div className="flex-1 h-10 bg-[#121212] border border-[#1e1e1e] rounded-full flex items-center px-1"><input placeholder="Escribe un mensaje... usa / para snippets" className="flex-1 bg-transparent outline-none text-[13px] px-3 placeholder:text-[#555]" /><button onClick={() => showToast("Mensaje enviado")} className="w-8 h-8 rounded-full grid place-items-center text-black font-bold" style={{ background: ACCENT }}>↗</button></div></div>
                    <div className="flex gap-1.5 mt-2">{["Precio $4.600","Alias brinines.mp","Retiro 18hs","Gracias 🥐"].map(s => <button key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-[#151515] border border-[#222] text-[#777] hover:text-[#c8c8c8]">{s}</button>)}</div>
                  </div>
                </div>
              </div>
            )}

            {tab === "pipelines" && (
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-5 max-w-[1600px] mx-auto">
                  <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Pipelines • Orders</div><div className="text-[12px] text-[#666] mt-1">Kanban Close CRM • Nuevo → Cotizado → Pagado → Horneando → Entregado</div></div>
                  <div className="flex items-center gap-2"><span className="text-[11px] mono text-[#666] bg-[#121212] border border-[#1e1e1e] px-3 py-1.5 rounded-full">Total pipeline: $50.600 ARS</span><button onClick={() => showToast("Nuevo pedido creado")} className="h-8 px-3 rounded-full text-black font-bold text-[12px] flex items-center gap-1" style={{ background: ACCENT }}><Plus size={14} /> Nuevo pedido</button></div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 max-w-[1600px] mx-auto">
                  {Object.entries(pipelines).map(([col, items]) => (
                    <div key={col} className="w-[260px] shrink-0 rounded-[16px] bg-[#101010] border border-[#1c1c1c] flex flex-col">
                      <div className="p-3.5 flex items-center justify-between border-b border-[#1a1a1a]">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: col==="Nuevo Lead"?"#6a6a6a":col==="Cotizado"?"#8a8a8a":col==="Pagado"?ACCENT:col==="Horneando"?"#ffd21f":"#6ee7b7" }} /><span className="text-[11px] font-bold tracking-[0.08em]">{col.toUpperCase()}</span><span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#1a1a1a] mono text-[#666]">{items.length}</span></div><span className="text-[#444]">⋯</span>
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
            )}

            {tab === "automations" && (
              <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Automations</div><div className="text-[12px] text-[#666] mt-1">8 flujos activos • 549 runs este mes • $72k atribuido • GHL Clone</div></div>
                  <button onClick={() => showToast("Nueva automatización creada (demo)")} className="h-9 px-4 rounded-full text-black font-bold text-[13px]" style={{ background: ACCENT }}>+ Nueva automatización</button>
                </div>
                <div className="space-y-3">
                  {automations.map(a => (
                    <div key={a.name} className={`rounded-[16px] border p-4 flex items-center gap-4 transition ${a.active?"bg-[#121212] border-[#1e1e1e]":"bg-[#0f0f0f] border-[#161616] opacity-70"}`}>
                      <div className={`w-10 h-10 rounded-[12px] grid place-items-center border ${a.active?"bg-[#151515] border-[#232323]":"bg-[#111] border-[#1a1a1a] text-[#555]"}`}><Zap size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="text-[13.5px] font-bold">{a.name}</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#232323] text-[#6a6a6a] mono">{a.trigger}</span></div>
                        <div className="text-[11.5px] text-[#6a6a6a] mt-1 leading-snug truncate">{a.desc}</div>
                      </div>
                      <div className="hidden md:flex items-center gap-6">
                        <div className="text-right"><div className="text-[11px] text-[#5a5a5a] font-bold tracking-wide">RUNS</div><div className="text-[13px] font-bold mono">{a.runs}</div></div>
                        <div className="text-right"><div className="text-[11px] text-[#5a5a5a] font-bold tracking-wide">CONV</div><div className="text-[13px] font-bold mono" style={{ color: a.active?ACCENT:"#666" }}>{a.conv}</div></div>
                        <div className={`w-[44px] h-[26px] rounded-full p-[2px] flex ${a.active?"justify-end":"justify-start bg-[#1e1e1e] border border-[#2a2a2a]"}`} style={a.active?{background:ACCENT}:{}}><div className="w-[22px] h-[22px] rounded-full bg-white shadow-sm" style={a.active?{}:{background:"#3a3a3a"}} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "reporting" && (
              <div className="p-4 lg:p-6 max-w-[1100px] mx-auto space-y-6">
                <div><div className="text-[22px] font-extrabold tracking-[-0.02em]">Reporting</div><div className="text-[12px] text-[#666] mt-1">Atribución por automatización y canal • Últimos 30 días</div></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">INGRESO POR AUTOMATIZACIÓN</div><div className="text-[28px] font-extrabold mt-2">$48.300 <span className="text-[14px] font-medium text-[#666]">ARS</span></div><div className="text-[11px] text-[#666] mt-1">67% del total viene de autos</div></div>
                  <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="text-[11px] font-bold tracking-wide text-[#5a5a5a]">CANAL ORIGEN</div><div className="mt-4 space-y-3"><div><div className="flex justify-between text-[12px] mb-1"><span>Instagram Story</span><span className="mono">58%</span></div><div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:"58%", background: ACCENT }}/></div></div><div><div className="flex justify-between text-[12px] mb-1"><span>WhatsApp Directo</span><span className="mono">27%</span></div><div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width:"27%" }}/></div></div></div></div>
                  <div className="rounded-[16px] p-5 border text-black" style={{ background: ACCENT, borderColor: `${ACCENT}50` }}><div className="text-[11px] font-bold tracking-wide text-black/60">RESUMEN MES</div><div className="text-[14px] font-bold mt-3 leading-snug">Tu automatización #1 (Story Reply) generó 34 leads extra sin esfuerzo.</div><button onClick={() => setTab("automations")} className="mt-4 h-8 px-4 rounded-full bg-black text-white text-[12px] font-bold">Revisar autos →</button></div>
                </div>
                <div className="rounded-[16px] bg-[#121212] border border-[#1e1e1e] p-5"><div className="font-bold text-[13px]">Funnel completo</div><div className="mt-4 flex flex-col md:flex-row items-stretch gap-3">{[{label:"Visitas perfil",v:"1.240"},{label:"DMs",v:"201"},{label:"Cotizados",v:"67"},{label:"Pagados",v:"32"},{label:"Entregados",v:"27"}].map((f,i)=>(
                  <div key={f.label} className="flex-1">
                    <div className="text-[11px] text-[#666]">{f.label}</div><div className="text-[16px] font-bold mono mt-1">{f.v}</div><div className="h-1.5 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.max(24, 100 - i*18)}%`, background: i===3?ACCENT:"#fff" }}/></div>
                  </div>
                ))}</div></div>
              </div>
            )}

            {tab === "calendar" && (
              <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
                <div className="text-[22px] font-extrabold tracking-[-0.02em]">Calendar • Horneadas</div><div className="text-[12px] text-[#666] mt-1 mb-6">Agenda de producción y entregas • Vista semanal</div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[{day:"Lun 11",slots:[{time:"18:00",name:"Lucía H.",flavor:"Chocolate"}]},{day:"Mar 12",slots:[{time:"17:30",name:"Martina P.",flavor:"Banana"},{time:"19:00",name:"Camila N.",flavor:"2x Choco"}]},{day:"Mié 13",slots:[]},{day:"Jue 14",slots:[{time:"18:30",name:"Florencia T.",flavor:"3x Choco",hl:true}]},{day:"Vie 15",slots:[{time:"16:00",name:"Sofia G.",flavor:"Tradicional"}]},{day:"Sáb 16",slots:[{time:"10:00",name:"Agustina M.",flavor:"2x Limón"},{time:"11:30",name:"Valentina D.",flavor:"Limón"}]},{day:"Dom 17",slots:[],closed:true}].map(d => (
                    <div key={d.day} className={`rounded-[14px] border p-3 min-h-[220px] ${d.closed?"bg-[#0a0a0a] border-[#141414]":"bg-[#121212] border-[#1e1e1e]"}`}>
                      <div className="text-[11px] font-bold tracking-wide">{d.day.toUpperCase()}</div>
                      <div className="mt-3 space-y-2">{d.slots.length===0 ? <div className="text-[11px] text-[#444] mt-8 text-center">{d.closed?"Cerrado • Descanso":"Sin horneadas"}</div> : d.slots.map(s=>(
                        <div key={s.time} className={`rounded-[10px] p-2.5 border text-[11px] ${(s as {hl?:boolean}).hl?"border-[#3a3a0a] text-black":"bg-[#0f0f0f] border-[#1e1e1e] text-[#c8c8c8]"}`} style={(s as {hl?:boolean}).hl?{background:ACCENT}:{}}><div className="font-bold mono">{s.time}</div><div className="font-medium mt-0.5">{s.name}</div><div className={`text-[10px] ${(s as {hl?:boolean}).hl?"text-black/60":"text-[#666]"}`}>{s.flavor}</div></div>
                      ))}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="h-6 border-t border-[#141414] bg-[#0a0a0a] flex items-center justify-between px-4 text-[10px] mono text-[#3a3a3a]">
            <span>BRININES CRM v1 • GoHighLevel Clone • Dark Premium • $97/mo aesthetic • bru-brutal + Inter</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All systems operational • Tucumán</span>
          </div>
        </div>
      </div>
    </div>
  );
}
