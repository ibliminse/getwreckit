import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: NextRequest) {
  // Simple auth via query param - set ADMIN_SECRET in Vercel env vars
  const secret = request.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all emails from the hash
    const emails = await kv.hgetall("waitlist:emails");

    if (!emails) {
      return NextResponse.json({ users: [], count: 0 });
    }

    // Convert to array and sort by position
    const users = Object.values(emails)
      .map((user: any) => ({
        email: user.email,
        position: user.position,
        referralCode: user.referralCode,
        referralCount: user.referralCount || 0,
        referredBy: user.referredBy,
        joinedAt: new Date(user.joinedAt).toISOString(),
      }))
      .sort((a, b) => a.position - b.position);

    return NextResponse.json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("List waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    );
  }
}
