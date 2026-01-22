"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function HomeContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  // Fetch waitlist count on load
  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((res) => res.json())
      .then((data) => setWaitlistCount(data.count))
      .catch(() => setWaitlistCount(null));
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
        // Redirect to position page with referral code
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

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          The AI Coding Revolution
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] mb-10"
        >
          Free AI coding tools. Built by AI. Powered by $WRECKIT.
        </motion.p>

        {/* Email form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] text-base placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Joining..." : "Get Early Access"}
          </button>
        </motion.form>

        {/* Waitlist count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-[var(--text-muted)]"
        >
          {waitlistCount !== null ? (
            <>
              <span className="text-[var(--text-secondary)] font-medium">
                {waitlistCount.toLocaleString()}
              </span>{" "}
              developers on the waitlist
            </>
          ) : (
            "Join thousands of developers"
          )}
        </motion.p>
      </div>

      {/* Footer links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-8 left-0 right-0 flex justify-center gap-6 text-sm text-[var(--text-muted)]"
      >
        <a
          href="https://wreckitlore.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          Token Data
        </a>
        <a
          href="https://wreckitgames.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          Games
        </a>
        <a
          href="https://x.com/wreckitcc"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          Twitter
        </a>
      </motion.div>
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
