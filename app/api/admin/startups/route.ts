import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin";
import { db } from "@/lib/adapters/db";

export async function GET(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Admin authentication required" }, { status: 401 });
  }

  try {
    const startups = await db.getAllStartupsAdmin(200, 0);
    return NextResponse.json({ success: true, data: startups });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch startups", error: err.message },
      { status: 500 }
    );
  }
}
