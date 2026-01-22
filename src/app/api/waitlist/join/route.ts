import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { email, referredBy } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already on waitlist
    const existing = await kv.hget("waitlist:emails", normalizedEmail);
    if (existing) {
      const data = existing as { referralCode: string; position: number };
      return NextResponse.json({
        message: "Already on waitlist",
        referralCode: data.referralCode,
        position: data.position,
      });
    }

    // Get current count for position
    const count = (await kv.get<number>("waitlist:count")) || 0;
    const position = count + 1;

    // Generate referral code
    const referralCode = generateReferralCode();

    // Store user data
    const userData = {
      email: normalizedEmail,
      referralCode,
      position,
      referredBy: referredBy || null,
      referralCount: 0,
      joinedAt: Date.now(),
    };

    await kv.hset("waitlist:emails", { [normalizedEmail]: userData });
    await kv.hset("waitlist:codes", { [referralCode]: normalizedEmail });
    await kv.set("waitlist:count", position);

    // If referred, credit the referrer
    if (referredBy) {
      const referrerEmail = await kv.hget<string>("waitlist:codes", referredBy);
      if (referrerEmail) {
        const referrerData = await kv.hget("waitlist:emails", referrerEmail) as any;
        if (referrerData) {
          const newReferralCount = (referrerData.referralCount || 0) + 1;
          // Move referrer up 100 spots per referral (min position is 1)
          const newPosition = Math.max(1, referrerData.position - 100);
          await kv.hset("waitlist:emails", {
            [referrerEmail]: {
              ...referrerData,
              referralCount: newReferralCount,
              position: newPosition,
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: "Successfully joined waitlist",
      referralCode,
      position,
    });
  } catch (error) {
    console.error("Waitlist join error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
