import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin";
import { db } from "@/lib/adapters/db";
import { invalidateLeaderboardCache } from "@/lib/adapters/redis";
import { sseBroadcaster } from "@/lib/adapters/sse-broadcaster";
import { getLeaderboardData } from "@/lib/use-cases/get-leaderboard";

export async function POST(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, handle, is_hidden } = body;

    if (typeof is_hidden !== "boolean") {
      return NextResponse.json(
        { success: false, message: "is_hidden must be a boolean" },
        { status: 400 }
      );
    }

    let updated: any = null;
    if (id) {
      updated = await db.setStartupHiddenById(id, is_hidden);
    } else if (handle) {
      updated = await db.setStartupHiddenByHandle(handle, is_hidden);
    } else {
      return NextResponse.json(
        { success: false, message: "Either id or handle is required" },
        { status: 400 }
      );
    }

    // Invalidate Redis Cache immediately
    await invalidateLeaderboardCache();

    // Broadcast real-time update to all connected SSE clients
    try {
      const fresh = await getLeaderboardData(50, 0);
      sseBroadcaster.broadcast("leaderboard_update", fresh.data);
    } catch (sseErr) {
      console.warn("[ADMIN_SSE_WARN] SSE broadcast skipped:", sseErr);
    }

    return NextResponse.json({
      success: true,
      message: `Startup ${is_hidden ? "hidden from" : "restored to"} public leaderboard`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Failed to toggle startup hidden state", error: err.message },
      { status: 500 }
    );
  }
}
