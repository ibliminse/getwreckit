"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
  const initialPosition = parseInt(searchParams.get("pos") || "0", 10);

  const [position, setPosition] = useState(initialPosition);
  const [referralCount, setReferralCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const referralLink = `https://getwreckit.xyz?ref=${referralCode}`;

  // Fetch latest status
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
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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
    const text = encodeURIComponent(
      "I just joined the WRECKIT waitlist for early access to free AI coding tools. Join me:"
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] rounded-full blur-[200px] opacity-[0.07]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="text-[var(--accent)]">WRECKIT</span>
          </span>
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            You're on the list!
          </h1>
        </motion.div>

        {/* Position display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]"
        >
          <div className="text-sm text-[var(--text-muted)] mb-1">
            Your position
          </div>
          <div
            className="text-5xl md:text-6xl font-bold text-[var(--accent)] mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            #{position.toLocaleString()}
          </div>
          {totalCount > 0 && (
            <div className="text-sm text-[var(--text-muted)]">
              out of {totalCount.toLocaleString()} developers
            </div>
          )}
        </motion.div>

        {/* Referral section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Move up the list
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Each referral moves you up{" "}
            <span className="text-[var(--accent)] font-semibold">100 spots</span>
          </p>

          {referralCount > 0 && (
            <div className="text-sm text-[var(--text-secondary)] mb-4">
              You've referred{" "}
              <span className="text-[var(--accent)] font-semibold">
                {referralCount}
              </span>{" "}
              {referralCount === 1 ? "person" : "people"}
            </div>
          )}

          {/* Share buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={shareTwitter}
              className="w-full py-3 px-4 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on Twitter
            </button>

            <button
              onClick={copyLink}
              className="w-full py-3 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] font-medium transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy referral link
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Referral link display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-[var(--text-muted)] break-all p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]"
        >
          {referralLink}
        </motion.div>
      </div>

      {/* Navigation tabs */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-0 right-0 flex justify-center gap-2 px-4"
      >
        <a
          href="https://wreckitlore.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Token Data
        </a>
        <a
          href="https://wreckitgames.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Games
        </a>
        <a
          href="https://x.com/wreckitcc"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Twitter
        </a>
      </motion.nav>
    </main>
  );
}

export default function Welcome() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
