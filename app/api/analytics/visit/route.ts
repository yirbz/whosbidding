import { NextResponse } from "next/server";
import { db } from "@/lib/adapters/db";

const BASELINE_VISITORS = 0;

export async function GET() {
  try {
    const res = await db.query("SELECT total_visitors FROM site_analytics WHERE id = 'global'");
    const total = res.rows[0]?.total_visitors;
    return NextResponse.json({ total_visitors: total !== undefined ? Number(total) : BASELINE_VISITORS });
  } catch {
    return NextResponse.json({ total_visitors: BASELINE_VISITORS });
  }
}

export async function POST() {
  try {
    const res = await db.query("SELECT increment_site_visitors() as total");
    const count = res.rows[0]?.total;
    return NextResponse.json({ total_visitors: count !== undefined ? Number(count) : BASELINE_VISITORS + 1 });
  } catch {
    return NextResponse.json({ total_visitors: BASELINE_VISITORS + 1 });
  }
}
