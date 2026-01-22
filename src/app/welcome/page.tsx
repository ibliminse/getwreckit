"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

// Pixel star component
function PixelStar({ size = 8, color = "#FFE66D", delay = 0 }: { size?: number; color?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        imageRendering: "pixelated",
      }}
    />
  );
}

function WelcomeContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
  const initialPosition = parseInt(searchParams.get("pos") || "0", 10);

  const [position, setPosition] = useState(initialPosition);
  const [referralCount, setReferralCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const referralLink = `https://getwreckit.xyz?ref=${referralCode}`;

  const fetchStatus = useCallback(async () => {
    if (!referralCode) return;
    try {
      const res = await fetch(`/api/waitlist/status?ref=${referralCode}`);
      const data = await res.json();
      if (res.ok) {
        setPosition(data.position);
        setReferralCount(data.referralCount);
        setTotalCount(data.totalCount);
      }
    } catch {
      // Ignore errors
    }
  }, [referralCode]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTwitter = () => {
    const messages = [
      `I'm #${position} on the WRECKIT waitlist.\n\nFree AI coding tools are coming. First 1,000 get lifetime access.\n\nDon't sleep on this:`,
      `Just secured my spot for free AI coding tools.\n\nWRECKIT is giving the first 1,000 users lifetime access.\n\nI'm #${position} in line. Get ahead of me:`,
      `Devs are racing to get on the WRECKIT waitlist.\n\nFree AI coding tools. No catch.\n\nI'm #${position}. See you at the top:`,
    ];
    const text = encodeURIComponent(messages[Math.floor(Math.random() * messages.length)]);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden scanlines">
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
            }}
          >
            <PixelStar
              size={Math.random() > 0.5 ? 4 : 2}
              color={["#FFE66D", "#4ECDC4", "#FF6B6B", "#FFF"][Math.floor(Math.random() * 4)]}
              delay={Math.random() * 2}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-pixel text-[var(--accent)] animate-glow">
            WRECKIT
          </h1>
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="pixel-box p-4 inline-block mb-4">
            <span className="font-pixel text-[24px] text-[var(--accent-secondary)]">✓</span>
          </div>
          <h2 className="font-pixel text-sm md:text-base text-[var(--text-primary)]">
            YOU'RE IN!
          </h2>
        </motion.div>

        {/* Position display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 pixel-box p-6"
        >
          <div className="font-pixel text-[8px] text-[var(--text-muted)] mb-2">
            YOUR POSITION
          </div>
          <div className="font-pixel text-4xl md:text-5xl text-[var(--accent-yellow)] mb-2">
            #{position.toLocaleString()}
          </div>
          {totalCount > 0 && (
            <div className="font-pixel text-[8px] text-[var(--text-muted)]">
              OUT OF {totalCount.toLocaleString()} PLAYERS
            </div>
          )}
        </motion.div>

        {/* Referral section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="font-pixel text-[10px] text-[var(--text-primary)] mb-2">
            LEVEL UP YOUR SPOT
          </h3>
          <p className="font-pixel text-[8px] text-[var(--text-secondary)] mb-4">
            EACH REFERRAL = <span className="text-[var(--accent)]">+100 SPOTS</span>
          </p>

          {referralCount > 0 && (
            <div className="pixel-box p-3 mb-4 inline-block">
              <span className="font-pixel text-[8px] text-[var(--accent-secondary)]">
                {referralCount} REFERRAL{referralCount !== 1 ? "S" : ""}
              </span>
            </div>
          )}

          {/* Share buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={shareTwitter}
              className="pixel-btn w-full flex items-center justify-center gap-2"
              style={{ background: "#1DA1F2" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              SHARE
            </button>

            <button
              onClick={copyLink}
              className="pixel-btn w-full"
              style={{ background: "var(--bg-surface)", border: "4px solid var(--border)" }}
            >
              {copied ? "COPIED!" : "COPY LINK"}
            </button>
          </div>
        </motion.div>

        {/* Referral link display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pixel-box p-3"
        >
          <p className="font-pixel text-[6px] text-[var(--text-muted)] break-all">
            {referralLink}
          </p>
        </motion.div>
      </div>

      {/* Navigation tabs */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-0 right-0 flex justify-center gap-2 px-4 z-20"
      >
        {[
          { label: "LORE", href: "https://wreckitlore.xyz" },
          { label: "GAMES", href: "https://wreckitgames.xyz" },
          { label: "TWITTER", href: "https://x.com/wreckitcc" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-box px-3 py-2 font-pixel text-[8px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>
    </main>
  );
}

export default function Welcome() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
          <div className="font-pixel text-[var(--accent)] animate-pixel-blink">
            LOADING...
          </div>
        </main>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
