import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const referralCode = request.nextUrl.searchParams.get("ref");

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 });
    }

    // Look up email by referral code
    const email = await kv.hget<string>("waitlist:codes", referralCode);
    if (!email) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Get user data
    const userData = await kv.hget("waitlist:emails", email) as any;
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get total count
    const totalCount = (await kv.get<number>("waitlist:count")) || 0;

    return NextResponse.json({
      position: userData.position,
      referralCount: userData.referralCount || 0,
      totalCount,
      referralCode: userData.referralCode,
    });
  } catch (error) {
    console.error("Waitlist status error:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}
