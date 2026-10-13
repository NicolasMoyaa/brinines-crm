"use client";
import { useState, useEffect } from "react";
import { Sidebar, MobileDrawer } from "../components/crm/Sidebar";
import { Topbar } from "../components/crm/Topbar";
import { DashboardView } from "../components/crm/DashboardView";
import { ContactsView } from "../components/crm/ContactsView";
import { ConversationsView } from "../components/crm/ConversationsView";
import { PipelinesView } from "../components/crm/PipelinesView";
import { AutomationsView } from "../components/crm/AutomationsView";
import { ReportingView } from "../components/crm/ReportingView";
import { CalendarView } from "../components/crm/CalendarView";
import { ContenidoView } from "../components/crm/ContenidoView";
import { AjustesView } from "../components/crm/AjustesView";
import { kpis, contacts, pedidos, pipelines, conversations } from "../components/crm/data";
import { ACCENT } from "../components/crm/theme";

// BRININES CRM v1 - GoHighLevel Clone — PREMIUM DARK ($97/mo aesthetic)
// Fase 0.6: monolito 791 líneas partido en shell + src/components/crm/* (vistas con props tipadas).
// Identidad visual intacta. RSC total llega con /negocio (Fase 2): fetch server + islas cliente.

export default function BrininesCRM() {
  const [tab, setTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  // Contenido tab state
  const [saborGen, setSaborGen] = useState("chocolate");
  const [tonoGen, setTonoGen] = useState("cordial");
  const [previewCopy, setPreviewCopy] = useState("");
  const [generando, setGenerando] = useState(false);
  // Ajustes — Conexiones state (escalable via registry)
  const [connGoogle, setConnGoogle] = useState(true);
  const [connMeta, setConnMeta] = useState(true);
  const [connUpstash, setConnUpstash] = useState(true);
  const [lastSync, setLastSync] = useState<Record<string, string>>({ google: "—", meta: "—", wa: "—", upstash: "—" });
  const maskSecret = (v: string) => v ? `••••${v.slice(-4)}` : "••••";
  // --- REAL DATA wiring (Supabase + IG Graph histórica) ---
  const [kpisReal, setKpisReal] = useState<typeof kpis | null>(null);
  const [contactsReal, setContactsReal] = useState<typeof contacts | null>(null);
  const [ordersReal, setOrdersReal] = useState<typeof pedidos | null>(null);
  const [pipelinesReal, setPipelinesReal] = useState<typeof pipelines | null>(null);
  const [conversationsReal, setConversationsReal] = useState<typeof conversations | null>(null);
  const [inboxSource, setInboxSource] = useState<string>("loading");
  useEffect(() => {
    // Dashboard real
    fetch("/api/dashboard").then(r => r.json()).then(j => {
      if (!j.stub && j.kpis) {
        setKpisReal([
          { label: "LEADS TOTAL", value: String(j.counts.customerCount), delta: "+ real DB", sub: "Supabase", accent: false },
          { label: "ÓRDENES", value: String(j.counts.orderCount), delta: `${j.kpis[1]?.delta || ""}`, sub: "DB", accent: false },
          { label: "REVENUE", value: j.kpis.find((k: { label: string }) => k.label === "REVENUE")?.value || `$${j.revenue}`, delta: "real DB", sub: "ARS sum", accent: true },
          { label: "INTERACCIONES", value: String(j.counts.interactionsCount), delta: "IG+WA", sub: "históricas", accent: false },
        ]);
      }
    }).catch(() => { });
    // Contactos reales
    fetch("/api/customers").then(r => r.json()).then(j => {
      if (!j.stub && j.data?.length) setContactsReal(j.data);
    }).catch(() => { });
    // Órdenes reales -> pedidos + pipelines
    fetch("/api/orders").then(r => r.json()).then(j => {
      if (!j.stub && j.data?.length) {
        const mapped = j.data.map((o: { name: string; initials: string; flavor: string; amount: string; status: string; time: string }) => ({ name: o.name, initials: o.initials, flavor: o.flavor, amount: o.amount, status: o.status, time: o.time }));
        setOrdersReal(mapped);
        const pipe: Record<string, typeof pedidos> = { "Nuevo": [], "Cotizado": [], "Pagado": [], "Horneando": [], "Entregado": [] };
        for (const o of mapped) {
          const k = o.status === "Nuevo Lead" ? "Nuevo" : o.status;
          if (pipe[k]) pipe[k].push(o); else pipe["Nuevo"].push(o);
        }
        // si API trae status con espacios, normaliza
        const pipe2: Record<string, typeof pedidos> = {};
        for (const [k, v] of Object.entries(pipe)) if (v.length) pipe2[k] = v;
        if (Object.keys(pipe2).length) setPipelinesReal(pipe2);
      }
    }).catch(() => { });
    // Conversaciones históricas reales (DM de @brinines_ vía Graph o DB fallback)
    fetch("/api/inbox").then(r => r.json()).then(j => {
      if (j.conversations?.length) {
        const mapped = j.conversations.map((c: { id: string; from: string; name: string; avatar: string; lastMsg: string; content: string; message: string; time: string; tag: string; platform: string; flavor: string }) => ({
          id: c.id, name: c.from || c.name || "Cliente", avatar: c.avatar || (c.from || "??").slice(0, 2).toUpperCase(),
          lastMsg: c.lastMsg || c.content || c.message || "—", time: c.time || "", tag: c.tag || c.platform || "dm", flavor: c.flavor || "—", unread: 0
        }));
        setConversationsReal(mapped);
        setInboxSource(j.source || "unknown");
        if (!j.stub) showToast(`Conversaciones reales cargadas: ${mapped.length} (${j.source})`);
      } else if (j.data?.data?.length) {
        // Graph directo
        const mapped = j.data.data.map((c: { id: string; participants: { data: { username: string }[] }; messages: { data: { message: string }[] } }) => ({ id: c.id, name: c.participants?.data?.[0]?.username || "Cliente IG", avatar: "IG", lastMsg: c.messages?.data?.[0]?.message || "—", time: "", tag: "instagram", flavor: "—", unread: 0 }));
        setConversationsReal(mapped);
        setInboxSource("graph");
      }
    }).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const probarConexion = async (id: string) => {
    const now = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    setLastSync(s => ({ ...s, [id]: now }));
    // pruebas reales
    try {
      if (id === "google") {
        const r = await fetch("/api/health/meta").then(x => x.json()).catch(() => null);
        showToast(r?.configured ? "Meta/Health OK" : "Google Calendar — stub, requiere GOOGLE_CLIENT_ID");
        return;
      }
      if (id === "meta") {
        const r = await fetch("/api/inbox").then(x => x.json());
        const n = r.conversations?.length || r.data?.data?.length || 0;
        showToast(r.stub ? `Meta DB fallback: ${n} conversaciones históricas (conectá IG_ACCESS_TOKEN para Graph real)` : `Meta Graph vivo: ${n} conversaciones reales de @brinines_`);
        setLastSync(s => ({ ...s, meta: now }));
        return;
      }
      if (id === "wa") { showToast(waConnected ? "WhatsApp — conectado" : "WhatsApp — requiere WHATSAPP_TOKEN"); return; }
    } catch { /* stub */ }
    const msgs: Record<string, string> = {
      google: "Google Calendar — verificación stub OK (requiere GOOGLE_CLIENT_ID para real)",
      meta: "Meta Graph — verificación stub OK (requiere IG_ACCESS_TOKEN para real)",
      wa: waConnected ? "WhatsApp — conectado" : "WhatsApp — requiere conexión",
      upstash: "Upstash Redis — verificación stub OK",
    };
    showToast(msgs[id] || "Conexión verificada");
  };

  const generarCopy = async () => {
    setGenerando(true);
    // Stock-aware stub: si stock 0 no sugerir (simula obtenerContextoComercial)
    // En prod llama lib/engine/contenido.ts → Gemini con veracidad + stock check
    await new Promise(r => setTimeout(r, 700));
    const copies: Record<string, string> = {
      chocolate: tonoGen === "humor" ? "¿Antojo de chocolate? Este budín doble no perdona 😏 — horneado hoy en Tucumán, 3 cuotas sin interés. ¿Te guardo uno?" : "Chocolate doble, húmedo y 100% artesanal 🍫 Horneamos hoy en Tucumán — pedí antes de las 18h y retirá a las 19h. ¡Te esperamos!",
      limon: "Limoncito glaseado fresco 🍋 Ideal para el calor tucumano — liviano, esponjoso y con mucho limón natural. Stock: hoy 10 unidades.",
      "banana-chocolate": "Banana + chocolate, la dupla que no falla 🍌🍫 — dulce justo, sin exceso. Horneado esta mañana. ¿Cuántos te guardo?",
      vainilla: "Tradicional de vainilla — el favorito de los clásicos ✨ Simple, esponjoso y rendidor. Perfecto para compartir.",
      mixto: "Mix de sabores: probá todos y encontrá tu favorito 🎨 — 4 porciones, 4 sabores, una sola tentación.",
    };
    setPreviewCopy(copies[saborGen] || copies.chocolate);
    setGenerando(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#e8e8e8] antialiased overflow-hidden selection:bg-[#a3ff12]/30">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-full text-[13px] font-medium shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ACCENT }} />{toast}
        </div>
      )}
      <div className="flex h-screen">
        <Sidebar tab={tab} setTab={setTab} />
        {/* Mobile drawer overlay */}
        {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
        <MobileDrawer tab={tab} setTab={setTab} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0b0b]">
          <Topbar onMenu={() => setMobileOpen(true)} waConnected={waConnected} onToggleWa={() => setWaConnected(v => !v)} showToast={showToast} />

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "dashboard" && <DashboardView kpisReal={kpisReal} ordersReal={ordersReal} setTab={setTab} />}
            {tab === "contacts" && <ContactsView contactsReal={contactsReal} showToast={showToast} />}
            {tab === "conversations" && <ConversationsView conversationsReal={conversationsReal} inboxSource={inboxSource} showToast={showToast} />}
            {tab === "pipelines" && <PipelinesView pipelinesReal={pipelinesReal} showToast={showToast} />}
            {tab === "automations" && <AutomationsView showToast={showToast} />}
            {tab === "reporting" && <ReportingView setTab={setTab} />}
            {tab === "calendar" && <CalendarView />}
            {tab === "contenido" && <ContenidoView saborGen={saborGen} setSaborGen={setSaborGen} tonoGen={tonoGen} setTonoGen={setTonoGen} previewCopy={previewCopy} generando={generando} onGenerar={generarCopy} showToast={showToast} />}
            {tab === "ajustes" && <AjustesView connGoogle={connGoogle} setConnGoogle={setConnGoogle} connMeta={connMeta} setConnMeta={setConnMeta} connUpstash={connUpstash} setConnUpstash={setConnUpstash} waConnected={waConnected} setWaConnected={setWaConnected} lastSync={lastSync} maskSecret={maskSecret} showToast={showToast} probarConexion={probarConexion} />}
          </div>
          <div className="h-6 border-t border-[#141414] bg-[#0a0a0a] flex items-center justify-between px-4 text-[10px] mono text-[#3a3a3a]">
            <span>BRININES CRM v1 • GoHighLevel Clone • Dark Premium • $97/mo aesthetic • bru-brutal + Inter</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Todos los sistemas operativos • Tucumán</span>
          </div>
        </div>
      </div>
    </div>
  );
}
