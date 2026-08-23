import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const supabase = getSupabaseServerClient();
    let userId: string | null = null;

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, website_url } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "INVALID_NAME", message: "Startup name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Check if user already owns a startup
    const { data: existingUserStartup } = await supabase
      .from("startups")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (existingUserStartup) {
      return NextResponse.json(
        { error: "USER_HAS_STARTUP", message: "You already have a registered startup" },
        { status: 409 }
      );
    }

    // Check if name is unique
    const { data: existingName } = await supabase
      .from("startups")
      .select("id")
      .ilike("name", name.trim())
      .single();

    if (existingName) {
      return NextResponse.json(
        { error: "STARTUP_NAME_EXISTS", message: `A startup with the name '${name}' already exists` },
        { status: 409 }
      );
    }

    // Create startup row
    const { data: newStartup, error: createErr } = await supabase
      .from("startups")
      .insert({
        owner_id: userId,
        name: name.trim(),
        description: description?.trim() || null,
        website_url: website_url?.trim() || null,
        total_bid: 0.00,
      })
      .select()
      .single();

    if (createErr) {
      console.error("Startup creation DB error:", createErr);
      return NextResponse.json({ error: "CREATE_FAILED", message: createErr.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: newStartup.id,
        name: newStartup.name,
        description: newStartup.description,
        website_url: newStartup.website_url,
        total_bid: parseFloat(newStartup.total_bid || 0),
        created_at: newStartup.created_at,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/startups error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: err.message }, { status: 500 });
  }
}
