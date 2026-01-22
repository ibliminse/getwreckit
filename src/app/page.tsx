"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Pixel art car component
function PixelCar({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg width="64" height="32" viewBox="0 0 16 8" style={{ imageRendering: "pixelated", ...style }}>
      {/* Car body */}
      <rect x="2" y="2" width="12" height="4" fill={color} />
      <rect x="4" y="1" width="6" height="1" fill={color} />
      {/* Windows */}
      <rect x="5" y="2" width="2" height="2" fill="#87CEEB" />
      <rect x="8" y="2" width="2" height="2" fill="#87CEEB" />
      {/* Wheels */}
      <rect x="3" y="6" width="2" height="2" fill="#333" />
      <rect x="11" y="6" width="2" height="2" fill="#333" />
      {/* Headlights */}
      <rect x="14" y="3" width="1" height="2" fill="#FFE66D" />
    </svg>
  );
}

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

function HomeContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

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

      {/* Racing cars */}
      <div className="fixed bottom-24 left-0 w-full pointer-events-none">
        <div className="animate-race-right" style={{ animationDelay: "0s" }}>
          <PixelCar color="#FF6B6B" />
        </div>
      </div>
      <div className="fixed bottom-32 left-0 w-full pointer-events-none">
        <div className="animate-race-right-slow" style={{ animationDelay: "2s" }}>
          <PixelCar color="#4ECDC4" />
        </div>
      </div>
      <div className="fixed bottom-40 left-0 w-full pointer-events-none">
        <div className="animate-race-left">
          <PixelCar color="#FFE66D" />
        </div>
      </div>

      {/* Road */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#333] pointer-events-none">
        {/* Road lines */}
        <div className="absolute top-1/2 -translate-y-1/2 w-[200%] flex animate-road">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-8 h-2 bg-[#FFE66D] mx-4" />
            </div>
          ))}
        </div>
        {/* Road edges */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF6B6B]" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#FF6B6B]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl text-center mb-24">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-pixel text-[var(--accent)] tracking-wider"
            style={{
              textShadow: "0 0 20px var(--accent), 0 0 40px var(--accent), 0 0 60px var(--accent)",
            }}
          >
            WRECKIT
          </h1>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <span className="px-4 py-2 bg-[#ff6b6b] font-pixel text-xs text-white">SHIP FASTER</span>
          <span className="px-4 py-2 bg-[#ffe66d] font-pixel text-xs text-black">GET SEEN</span>
          <span className="px-4 py-2 bg-[#a8e6cf] font-pixel text-xs text-black">COMPOUND VALUE</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 leading-snug"
        >
          Free AI coding tools that ship.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base md:text-lg text-[var(--text-secondary)] mb-8"
        >
          Built by AI. Powered by{" "}
          <span className="text-[var(--accent)] font-semibold">$WRECKIT</span>.
        </motion.p>

        {/* Email form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center"
        >
          <input
            type="email"
            placeholder="ENTER EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pixel-input w-full sm:w-64 text-center"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="pixel-btn whitespace-nowrap disabled:opacity-50"
          >
            {isSubmitting ? "JOINING..." : "JOIN NOW"}
          </button>
        </motion.form>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-[var(--text-muted)]"
        >
          {waitlistCount !== null && waitlistCount > 0 ? (
            <>
              <span className="text-[var(--accent)] font-semibold">
                {waitlistCount.toLocaleString()}
              </span>{" "}
              developers in queue
            </>
          ) : (
            "Be first in line"
          )}
        </motion.div>
      </div>

      {/* Navigation tabs */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-0 right-0 flex justify-center gap-3 px-4 z-20"
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
            className="px-4 py-2 bg-[var(--bg-surface)] border-2 border-[var(--border)] font-pixel text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>
    </main>
  );
}

export default function Home() {
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
      <HomeContent />
    </Suspense>
  );
}
