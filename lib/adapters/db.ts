import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_INTERNAL_URL ||
  "postgres://postgres:postgres@localhost:54332/postgres";

// Global database connection pool
const globalPool =
  (globalThis as any).__pgPool ||
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).__pgPool = globalPool;
}

export const db = {
  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await globalPool.query(text, params);
      const duration = Date.now() - start;
      if (duration > 500) {
        console.warn(`[DB_SLOW_QUERY] ${duration}ms: ${text}`);
      }
      return res;
    } catch (err: any) {
      console.error(`[DB_QUERY_ERROR] ${text}:`, err.message);
      throw err;
    }
  },

  async confirmBidAtomic(
    handle: string,
    websiteUrl: string | null | undefined,
    targetBid: number,
    paddleTransactionId: string
  ) {
    const res = await globalPool.query(
      "SELECT confirm_bid_atomic($1, $2, $3, $4) as result",
      [handle, websiteUrl || null, targetBid, paddleTransactionId]
    );
    return res.rows[0]?.result;
  },

  async getLeaderboard(limit = 50, offset = 0) {
    const res = await globalPool.query(
      `SELECT id, handle, website_url, total_bid, created_at, updated_at
       FROM startups
       ORDER BY total_bid DESC, updated_at ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.rows;
  },

  async getRecentActivity(limit = 10) {
    const res = await globalPool.query(
      `SELECT id, startup_id, handle, target_bid, paddle_transaction_id, status, created_at
       FROM bids
       WHERE status = 'confirmed'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  },

  async recordPendingBid(handle: string, targetBid: number, paddleTxnId: string) {
    const res = await globalPool.query(
      `INSERT INTO bids (handle, target_bid, paddle_transaction_id, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [handle, targetBid, paddleTxnId]
    );
    return res.rows[0];
  },

  async getPendingBidByTxnId(paddleTxnId: string) {
    const res = await globalPool.query(
      `SELECT handle, target_bid, startup_id
       FROM bids
       WHERE paddle_transaction_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [paddleTxnId]
    );
    return res.rows[0] || null;
  },

  async getLeader() {
    const res = await globalPool.query(
      `SELECT total_bid, handle
       FROM startups
       ORDER BY total_bid DESC, updated_at ASC
       LIMIT 1`
    );
    return res.rows[0] || null;
  },
};
