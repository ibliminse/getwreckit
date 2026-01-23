import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Rate limiting: 5 join attempts per IP per hour
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(randomBytes[i] % chars.length);
  }
  return code;
}

// RFC 5322 compliant email regex (simplified but strict)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false; // Max email length per RFC
  return EMAIL_REGEX.test(email);
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { email, referredBy } = await request.json();

    if (!isValidEmail(email)) {
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
