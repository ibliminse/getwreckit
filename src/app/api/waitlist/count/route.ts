import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = (await kv.get<number>("waitlist:count")) || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Waitlist count error:", error);
    // Return a fallback count if KV is not configured
    return NextResponse.json({ count: 0 });
  }
}
