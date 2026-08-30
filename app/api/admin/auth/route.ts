import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminRequest,
} from "@/lib/auth/admin";

export async function GET(req: Request) {
  const isAuthed = verifyAdminRequest(req);
  return NextResponse.json({ authenticated: isAuthed });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin password" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json({ success: true, message: "Authenticated" });

    // Set secure HTTP-only cookie
    res.cookies.set("whosbidding_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Authentication error", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set("whosbidding_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
