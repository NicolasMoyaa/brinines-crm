// lib/db.ts — Prisma singleton + stub-safe
// No throw en build si DATABASE_URL falta — retorna proxy stub
import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function createPrisma(): PrismaClient | any {
  if (!process.env.DATABASE_URL) {
    console.warn("[db] stub: DATABASE_URL missing — Prisma stub, no queries");
    // Proxy stub que no rompe builds ni imports
    return new Proxy({}, {
      get(_t, prop) {
        if (prop === "$connect" || prop === "$disconnect") return async () => {};
        // Para product/customer etc retorna objeto con métodos stub
        return new Proxy({}, {
          get(_t2, method) {
            return async (...args: unknown[]) => {
              console.warn(`[db stub] ${String(prop)}.${String(method)} called without DATABASE_URL`, args);
              if (String(method).includes("count") || String(method).includes("findMany")) return 0;
              if (String(method).includes("findUnique") || String(method).includes("findFirst")) return null;
              return null;
            };
          }
        });
      }
    });
  }
  if (global.prismaGlobal) return global.prismaGlobal;
  const client = new PrismaClient();
  if (process.env.NODE_ENV !== "production") global.prismaGlobal = client;
  return client;
}

export const prisma: PrismaClient = createPrisma() as PrismaClient;
export const db = prisma;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
