import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: bids, error } = await supabase
      .from("bids")
      .select("id, handle, target_bid, created_at")
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Activity feed query fallback (DB unreachable or unconfigured):", error.message);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: bids || [] });
  } catch (err: any) {
    console.warn("Unexpected activity API fallback:", err?.message || err);
    return NextResponse.json({ data: [] });
  }
}
