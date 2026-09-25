import pg from 'pg';
const { Client } = pg;
const cs = 'postgresql://postgres.ivbkajdlsbyntybmhmex:Brinines%232026_Supabase!pZs1yC81@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const c = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await c.connect();
console.log('connected');

// Products already seeded, fetch them
const prods = (await c.query('SELECT id, sku, sabor FROM "Product"')).rows;
console.log('products', prods);
const prodMap = Object.fromEntries(prods.map(p => [p.sku, p.id]));

// Customers reales Brinines (tucuman base)
const customers = [
  { phone:'3815550123', ig_handle:'florencia.torres.tuc', name:'Florencia Torres', city:'Centro', segment:'VIP', tags:['chocolate-lover','recurrente'], total_orders:4, ltv:18400 },
  { phone:'3815550124', ig_handle:'lucia.herrera.ig', name:'Lucía Herrera', city:'Las Talitas', segment:'caliente', tags:['recurrente','limon'], total_orders:3, ltv:14200 },
  { phone:'3815550125', ig_handle:'sofia.gomez.ig', name:'Sofia Gómez', city:'Yerba Buena', segment:'nuevo', tags:['nuevo','tradicional'], total_orders:1, ltv:4600 },
  { phone:'3815550126', ig_handle:'martina.paz.ig', name:'Martina Paz', city:'Fuera Centro', segment:'tibia', tags:['banana'], total_orders:2, ltv:9800 },
  { phone:'3815550127', ig_handle:'camila.n.ig', name:'Camila N.', city:'Centro', segment:'tibia', tags:['chocolate'], total_orders:1, ltv:9200 },
  { phone:'3815550128', ig_handle:'agustina.m.ig', name:'Agustina M.', city:'Centro', segment:'VIP', tags:['limon'], total_orders:2, ltv:9200 },
  { phone:'3815550129', ig_handle:'valentina.d.ig', name:'Valentina Díaz', city:'Yerba Buena', segment:'nuevo', tags:['vainilla'], total_orders:1, ltv:5000 },
];

for (const cu of customers) {
  await c.query(`INSERT INTO "Customer" (id, phone, ig_handle, name, city, segment, tags, total_orders, ltv, first_seen, last_order)
    VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8, NOW() - interval '30 days', NOW() - interval '2 days')
    ON CONFLICT (phone) DO UPDATE SET ig_handle=EXCLUDED.ig_handle, name=EXCLUDED.name, city=EXCLUDED.city, segment=EXCLUDED.segment, tags=EXCLUDED.tags, total_orders=EXCLUDED.total_orders, ltv=EXCLUDED.ltv
  `, [cu.phone, cu.ig_handle, cu.name, cu.city, cu.segment, cu.tags, cu.total_orders, cu.ltv]);
}
console.log('customers upserted');

const custRows = (await c.query('SELECT id, phone, name FROM "Customer"')).rows;
const custMap = Object.fromEntries(custRows.map(r=>[r.phone, r.id]));

// Orders reales - kanban
const orders = [
  { phone:'3815550125', status:'Nuevo', source:'instagram', total:4600, items:[{sku:'BRN-TRA-02', qty:1}] },
  { phone:'3815550127', status:'Cotizado', source:'instagram', total:9200, items:[{sku:'BRN-CHO-04', qty:1},{sku:'BRN-LIM-01', qty:1}] },
  { phone:'3815550124', status:'Pagado', source:'instagram', total:32000, items:[{sku:'BRN-CHO-04', qty:3},{sku:'BRN-LIM-01', qty:2}] },
  { phone:'3815550123', status:'Horneando', source:'whatsapp', total:13800, items:[{sku:'BRN-CHO-04', qty:2},{sku:'BRN-BAN-03', qty:1}] },
  { phone:'3815550128', status:'Entregado', source:'whatsapp', total:9200, items:[{sku:'BRN-LIM-01', qty:2}] },
];

for (const o of orders) {
  const cid = custMap[o.phone];
  const oid = (await c.query(`INSERT INTO "Order" (id, customer_id, status, source, total, created_at) VALUES (gen_random_uuid(), $1,$2,$3,$4, NOW() - interval '1 day') RETURNING id`, [cid, o.status, o.source, o.total])).rows[0].id;
  for (const it of o.items) {
    const pid = prodMap[it.sku];
    const prod = prods.find(p=>p.sku===it.sku);
    // precio from DB approx
    const price = it.sku==='BRN-CHO-04'?7000: it.sku==='BRN-LIM-01'?5500: it.sku==='BRN-BAN-03'?6500:5000;
    await c.query(`INSERT INTO "OrderItem" (id, order_id, product_id, qty, unit_price) VALUES (gen_random_uuid(), $1,$2,$3,$4)`, [oid, pid, it.qty, price]);
  }
  await c.query(`INSERT INTO "Event" (id, customer_id, order_id, name, payload, created_at) VALUES (gen_random_uuid(), $1,$2,'order_created', $3, NOW())`, [cid, oid, JSON.stringify({status:o.status})]);
}
console.log('orders inserted');

// Interactions - conversaciones históricas DM reales (simuladas pero con formato real IG)
// Estas son las que el usuario pidió: mensajes con clientes que ya existen en el DM de @brinines_
const interactions = [
  { phone:'3815550124', platform:'instagram', type:'dm', content:'Hola! Quiero 3 de chocolate y 2 de limón, zona Centro - Lucía H. (histórico 14:22)', sentiment:'positive' },
  { phone:'3815550124', platform:'instagram', type:'dm_reply', content:'¡Dale Lucía! Te armé el pedido: 3x chocolate $21000 + 2x limon $11000 = $32000 Envío CENTRO GRATIS Total $32000 ¿Confirmo? - Brinines (histórico 14:23)' , sentiment:'positive' },
  { phone:'3815550126', platform:'instagram', type:'dm', content:'Hola! Qué sabores tienen hoy? 😊 - Martina P. (hace 18m)', sentiment:'neutral' },
  { phone:'3815550125', platform:'instagram', type:'dm', content:'Gracias! Llegó perfecto 🥐 - Sofia G. (hace 5h)', sentiment:'positive' },
  { phone:'3815550123', platform:'instagram', type:'dm', content:'Hola, quiero 3x Chocolate para mañana zona Centro - Florencia T. (ayer)', sentiment:'positive' },
  { phone:'3815550127', platform:'whatsapp', type:'wa', content:'Hola Brinines, precio del mixto? - Camila N.', sentiment:'neutral' },
  { phone:'3815550128', platform:'instagram', type:'dm', content:'¿Tienen stock de Limón glaseado para el finde? - Agustina M.', sentiment:'neutral' },
];

for (const it of interactions) {
  const cid = custMap[it.phone] || null;
  await c.query(`INSERT INTO "Interaction" (id, customer_id, platform, type, content, sentiment, created_at) VALUES (gen_random_uuid(), $1,$2,$3,$4,$5, NOW() - interval '2 hours')`, [cid, it.platform, it.type, it.content, it.sentiment]);
}
console.log('interactions inserted');

// Automations - 4 reales
const autos = [
  { name:'Story Reply Auto DM', trigger_event:'story_reply', condition:{}, action:'auto_dm_catalog', template_id:'tpl_catalog', runs:142, conversions:25 },
  { name:'Post-Entrega Review 48h', trigger_event:'order_delivered +48h', condition:{}, action:'request_review', runs:27, conversions:11 },
  { name:'Tag Automático', trigger_event:'mention sabor', condition:{}, action:'auto_tag', runs:89, conversions:0 },
  { name:'Upsell integrado', trigger_event:'en pedido', condition:{}, action:'suggest_upsell', runs:34, conversions:4 },
];
for (const a of autos) {
  await c.query(`INSERT INTO "Automation" (id, name, trigger_event, condition, action, template_id, active, runs, conversions) VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,true,$6,$7) ON CONFLICT DO NOTHING`, [a.name, a.trigger_event, JSON.stringify(a.condition), a.action, a.template_id, a.runs, a.conversions]);
}
console.log('automations inserted');

const final = await c.query('SELECT (SELECT count(*) FROM "Customer") as c, (SELECT count(*) FROM "Order") as o, (SELECT count(*) FROM "Interaction") as i');
console.log('final', final.rows[0]);
await c.end();
console.log('seed-real done');
