"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const RECENT_SIGNUPS = [
  "dev from San Francisco",
  "engineer from London",
  "founder from NYC",
  "builder from Austin",
  "dev from Berlin",
  "engineer from Tokyo",
  "founder from Miami",
  "builder from Seattle",
];

function HomeContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [recentSignup, setRecentSignup] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  // Fetch waitlist count on load
  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((res) => res.json())
      .then((data) => setWaitlistCount(data.count))
      .catch(() => setWaitlistCount(null));
  }, []);

  // Fake live activity indicator for social proof
  useEffect(() => {
    const showRandomSignup = () => {
      const randomSignup = RECENT_SIGNUPS[Math.floor(Math.random() * RECENT_SIGNUPS.length)];
      setRecentSignup(randomSignup);
      setShowSignup(true);
      setTimeout(() => setShowSignup(false), 3000);
    };

    // Show first one after 5 seconds
    const initialTimeout = setTimeout(showRandomSignup, 5000);
    // Then every 8-15 seconds
    const interval = setInterval(() => {
      showRandomSignup();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referredBy }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = `/welcome?ref=${data.referralCode}&pos=${data.position}`;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to join waitlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] rounded-full blur-[250px] opacity-[0.05]" />
      </div>

      {/* Live signup notification */}
      <AnimatePresence>
        {showSignup && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] flex items-center gap-2 shadow-lg"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>A {recentSignup} just joined</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="text-[var(--accent)]">WRECKIT</span>
          </span>
        </motion.div>

        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6"
        >
          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-[var(--accent)]">
            First 1,000 get lifetime free access
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-[1.1]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Free AI Coding Tools
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] mb-8"
        >
          Ship faster with AI. Zero cost. No limits.
        </motion.p>

        {/* Email form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] text-base placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
        </motion.form>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-sm text-[var(--text-muted)]">
            {waitlistCount !== null && waitlistCount > 0 ? (
              <>
                <span className="text-[var(--text-primary)] font-semibold">
                  {waitlistCount.toLocaleString()}
                </span>{" "}
                developers ahead of you
              </>
            ) : (
              "Be first in line"
            )}
          </p>
          {/* Trust indicators */}
          <p className="text-xs text-[var(--text-muted)]">
            No spam. Unsubscribe anytime.
          </p>
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
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)]/50 backdrop-blur border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Token Data
        </a>
        <a
          href="https://wreckitgames.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)]/50 backdrop-blur border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Games
        </a>
        <a
          href="https://x.com/wreckitcc"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface)]/50 backdrop-blur border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          Twitter
        </a>
      </motion.nav>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
