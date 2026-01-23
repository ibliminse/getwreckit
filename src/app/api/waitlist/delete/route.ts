import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: NextRequest) {
  // Auth via Authorization header or query param
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET;

  const headerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!adminSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Get user data to find their referral code
    const userData = await kv.hget("waitlist:emails", normalizedEmail) as any;
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete from emails hash
    await kv.hdel("waitlist:emails", normalizedEmail);

    // Delete from codes hash
    if (userData.referralCode) {
      await kv.hdel("waitlist:codes", userData.referralCode);
    }

    return NextResponse.json({
      message: "User deleted",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Delete waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
