import { NextResponse } from "next/server";
import { db } from "@/lib/adapters/db";

export async function GET() {
  try {
    const total = await db.getVisitorCount();
    return NextResponse.json({ total_visitors: total });
  } catch {
    return NextResponse.json({ total_visitors: 0 });
  }
}

export async function POST() {
  try {
    const count = await db.incrementVisitors();
    return NextResponse.json({ total_visitors: count });
  } catch {
    return NextResponse.json({ total_visitors: 1 });
  }
}
