import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";

const BASELINE_VISITORS = 0;

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_analytics")
      .select("total_visitors")
      .eq("id", "global")
      .single();

    if (error || !data) {
      return NextResponse.json({ total_visitors: BASELINE_VISITORS });
    }

    return NextResponse.json({ total_visitors: Number(data.total_visitors) });
  } catch {
    return NextResponse.json({ total_visitors: BASELINE_VISITORS });
  }
}

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();

    // Call stored procedure increment_site_visitors
    const { data, error } = await supabase.rpc("increment_site_visitors");

    if (error || data === null) {
      // Fallback: update table directly or return baseline + 1
      const { data: selectData } = await supabase
        .from("site_analytics")
        .select("total_visitors")
        .eq("id", "global")
        .single();

      const currentCount = selectData ? Number(selectData.total_visitors) + 1 : BASELINE_VISITORS + 1;
      return NextResponse.json({ total_visitors: currentCount });
    }

    return NextResponse.json({ total_visitors: Number(data) });
  } catch {
    return NextResponse.json({ total_visitors: BASELINE_VISITORS + 1 });
  }
}
