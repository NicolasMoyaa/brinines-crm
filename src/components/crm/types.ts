// components/crm/types.ts — Fase 0.6 — Tipos compartidos del CRM (props tipadas entre shell y vistas)

export type ToastFn = (m: string) => void;
export type TabSetter = (v: string) => void;
export type BoolSetter = (v: boolean | ((p: boolean) => boolean)) => void;

export type Kpi = { label: string; value: string; delta: string; sub: string; accent: boolean };
export type Pedido = { name: string; initials: string; flavor: string; amount: string; status: string; time: string };
export type Contact = {
  id: number | string; name: string; phone: string; city: string; tag: string;
  flavor?: string; ltv: string; orders: number; last: string; status: string; avatar: string;
};
export type Conversation = {
  id: string; name: string; avatar: string; lastMsg: string; time: string;
  tag: string; flavor: string; unread: number;
};
export type Pipelines = Record<string, Pedido[]>;
export type Automation = { name: string; trigger: string; desc: string; runs: number; conv: string; active: boolean };
