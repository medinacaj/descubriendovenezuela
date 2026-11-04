import pg from "pg";
const globalDb = globalThis as unknown as { pool?: pg.Pool };
export const pool =
  globalDb.pool ??
  new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
if (process.env.NODE_ENV !== "production") globalDb.pool = pool;
