// components/crm/Sidebar.tsx — Fase 0.6 — Sidebar desktop + drawer mobile (extracción verbatim)
"use client";
import { LayoutDashboard, MessageSquare, Users, Kanban, Zap, BarChart3, Calendar, Image as ImageIcon, Settings, X } from "lucide-react";
import { ACCENT } from "./theme";
import type { TabSetter } from "./types";

const PRINCIPAL = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "conversations", label: "Conversaciones", Icon: MessageSquare, count: 3 },
  { id: "contacts", label: "Contactos", Icon: Users, count: 201 },
  { id: "pipelines", label: "Embudo", Icon: Kanban },
] as { id: string; label: string; Icon: typeof LayoutDashboard; count?: number }[];

const AUTOMATIZACION = [
  { id: "automations", label: "Automatizaciones", Icon: Zap, count: 8 },
  { id: "reporting", label: "Reportes", Icon: BarChart3 },
  { id: "calendar", label: "Calendario", Icon: Calendar },
  { id: "contenido", label: "Contenido", Icon: ImageIcon },
] as { id: string; label: string; Icon: typeof LayoutDashboard; count?: number }[];

const SISTEMA = [
  { id: "ajustes", label: "Ajustes", Icon: Settings },
] as { id: string; label: string; Icon: typeof LayoutDashboard }[];

function Nav({ id, label, icon: Icon, count, tab, setTab }: { id: string; label: string; icon: typeof LayoutDashboard; count?: number; tab: string; setTab: TabSetter }) {
  const active = tab === id;
  return (
    <button onClick={() => setTab(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition ${active ? "bg-[#1e1e1e] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-[#2a2a2a]" : "text-[#8a8a8a] hover:text-[#c8c8c8] hover:bg-[#161616] border border-transparent"}`}>
      <Icon size={16} className={`${active ? "opacity-100" : "opacity-70"}`} />
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white text-black" : "bg-[#222] text-[#777]"}`}>{count}</span>}
      {active && <div className="w-1 h-4 rounded-full" style={{ background: ACCENT }} />}
    </button>
  );
}

function NavGroups({ tab, setTab, onNavigate }: { tab: string; setTab: TabSetter; onNavigate?: () => void }) {
  const go = (id: string) => { setTab(id); onNavigate?.(); };
  const item = ({ id, label, Icon, count }: { id: string; label: string; Icon: typeof LayoutDashboard; count?: number }) => {
    const active = tab === id;
    return <button key={id} onClick={() => go(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition ${active ? "bg-[#1e1e1e] text-white border border-[#2a2a2a]" : "text-[#8a8a8a] hover:text-[#c8c8c8] hover:bg-[#161616] border border-transparent"}`}><Icon size={16} className={active ? "opacity-100" : "opacity-70"} /><span className="flex-1 text-left">{label}</span>{count !== undefined && <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white text-black" : "bg-[#222] text-[#777]"}`}>{count}</span>}</button>;
  };
  return (
    <>
      <div>
        <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">PRINCIPAL</div>
        <div className="space-y-1">{PRINCIPAL.map(item)}</div>
      </div>
      <div>
        <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">AUTOMATIZACIÓN</div>
        <div className="space-y-1">{AUTOMATIZACION.map(item)}</div>
      </div>
      <div>
        <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">SISTEMA</div>
        <div className="space-y-1">{SISTEMA.map(item)}</div>
      </div>
    </>
  );
}

export function Sidebar({ tab, setTab }: { tab: string; setTab: TabSetter }) {
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
            <Nav id="dashboard" label="Dashboard" icon={LayoutDashboard} tab={tab} setTab={setTab} />
            <Nav id="conversations" label="Conversaciones" icon={MessageSquare} count={3} tab={tab} setTab={setTab} />
            <Nav id="contacts" label="Contactos" icon={Users} count={201} tab={tab} setTab={setTab} />
            <Nav id="pipelines" label="Embudo" icon={Kanban} tab={tab} setTab={setTab} />
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">AUTOMATIZACIÓN</div>
          <div className="space-y-1">
            <Nav id="automations" label="Automatizaciones" icon={Zap} count={8} tab={tab} setTab={setTab} />
            <Nav id="reporting" label="Reportes" icon={BarChart3} tab={tab} setTab={setTab} />
            <Nav id="calendar" label="Calendario" icon={Calendar} tab={tab} setTab={setTab} />
            <Nav id="contenido" label="Contenido" icon={ImageIcon} tab={tab} setTab={setTab} />
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.16em] font-bold text-[#4a4a4a] px-3 mb-2">SISTEMA</div>
          <div className="space-y-1">
            <Nav id="ajustes" label="Ajustes" icon={Settings} tab={tab} setTab={setTab} />
          </div>
        </div>
        <div className="mx-1 mt-6 rounded-[14px] bg-[#151515] border border-[#232323] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wide text-[#9a9a9a]">USO WHATSAPP</span>
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

export function MobileDrawer({ tab, setTab, open, onClose }: { tab: string; setTab: TabSetter; open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed left-0 top-0 h-full w-[280px] z-50 bg-[#0f0f0f] border-r border-[#1c1c1c] flex flex-col transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      <div className="h-[64px] flex items-center gap-3 px-5 border-b border-[#1c1c1c] shrink-0">
        <div className="w-8 h-8 rounded-[9px] bg-white text-black grid place-items-center font-black text-[15px] tracking-tighter">B</div>
        <div className="leading-none flex-1">
          <div className="font-extrabold text-[14px] tracking-[-0.02em]">BRININES</div>
          <div className="text-[10px] tracking-[0.14em] text-[#6a6a6a] font-semibold mt-[2px]">CRM • V1 GHL CLONE</div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#232323] grid place-items-center text-[#8a8a8a]"><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <NavGroups tab={tab} setTab={setTab} onNavigate={onClose} />
      </div>
      <div className="p-3 border-t border-[#1c1c1c]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-[#151515] border border-[#232323]">
          <div className="w-7 h-7 rounded-full bg-[#222] grid place-items-center text-[11px] font-bold">NM</div>
          <div className="flex-1 leading-none"><div className="text-[12.5px] font-semibold">Nico Moyaa</div><div className="text-[11px] text-[#6a6a6a]">Owner • Admin</div></div>
        </div>
      </div>
    </div>
  );
}
