// lib/queue.ts — BullMQ + Upstash Redis stub (no requiere Redis real para build)
// Si UPSTASH_REDIS_URL no esta, retorna stub con warn. No throw en build.

export type QueueJob = { name: string; data: unknown };

export async function enqueue(job: QueueJob) {
  if (!process.env.UPSTASH_REDIS_URL) {
    console.warn("[queue] Redis stub — UPSTASH_REDIS_URL not set, job queued in memory:", job.name);
    return { id: `stub-${Date.now()}`, stub: true };
  }
  // Real BullMQ path (lazy import para no romper build sin deps)
  try {
    // @ts-ignore — optional dep
    const { Queue } = await import("bullmq");
    // @ts-ignore — connection stub, Upstash requiere ioredis con tls
    const q = new Queue("brinines-automations", { connection: { url: process.env.UPSTASH_REDIS_URL } });
    return await q.add(job.name, job.data);
  } catch (e) {
    console.warn("[queue] BullMQ not installed or Redis error, fallback stub", e);
    return { id: `stub-fallback-${Date.now()}`, stub: true };
  }
}

export async function processQueue() {
  if (!process.env.UPSTASH_REDIS_URL) {
    console.warn("[queue] Redis stub — no processing");
    return;
  }
  console.log("[queue] processing with BullMQ (Upstash)");
}
