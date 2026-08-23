import { NextResponse } from "next/server";
import { db } from "@/lib/adapters/db";

export async function GET() {
  try {
    const rows = await db.getRecentActivity(10);
    return NextResponse.json({ data: rows || [] });
  } catch (err: any) {
    console.warn("Unexpected activity API fallback:", err?.message || err);
    return NextResponse.json({ data: [] });
  }
}
