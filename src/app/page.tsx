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
      <rect x="14" y="3" width="1" height="2" fill="#ffd700" />
    </svg>
  );
}

// Pixel star component
function PixelStar({ size = 8, color = "#ffd700", delay = 0 }: { size?: number; color?: string; delay?: number }) {
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

// Floating memes configuration - desktop positions
const FLOATING_MEMES_DESKTOP = [
  { src: "https://wreckitgames.xyz/memes/webp/wreck-it.webp", className: "animate-float-1", position: { top: "15%", left: "5%" }, size: 100 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-1.webp", className: "animate-float-2", position: { top: "20%", right: "8%" }, size: 90 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-3.webp", className: "animate-float-3", position: { bottom: "35%", left: "3%" }, size: 80 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-5.webp", className: "animate-float-1", position: { bottom: "40%", right: "5%" }, size: 85 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-2.webp", className: "animate-float-2", position: { top: "45%", left: "8%" }, size: 75 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-4.webp", className: "animate-float-3", position: { top: "50%", right: "3%" }, size: 80 },
];

// Floating memes configuration - mobile positions (corners, smaller)
const FLOATING_MEMES_MOBILE = [
  { src: "https://wreckitgames.xyz/memes/webp/wreck-it.webp", className: "animate-float-1", position: { top: "8%", left: "5%" }, size: 50 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-1.webp", className: "animate-float-2", position: { top: "8%", right: "5%" }, size: 50 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-3.webp", className: "animate-float-3", position: { bottom: "18%", left: "5%" }, size: 45 },
  { src: "https://wreckitgames.xyz/memes/webp/ralph-5.webp", className: "animate-float-1", position: { bottom: "18%", right: "5%" }, size: 45 },
];

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
      {/* Vignette/gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(15, 15, 26, 0.4) 50%, rgba(15, 15, 26, 0.9) 100%)"
        }}
      />

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
              color={["#ffd700", "#ff534e", "#231a38", "#FFF"][Math.floor(Math.random() * 4)]}
              delay={Math.random() * 2}
            />
          </div>
        ))}
      </div>

      {/* Floating memes - Desktop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
        {FLOATING_MEMES_DESKTOP.map((meme, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className={`absolute ${meme.className}`}
            style={{ ...meme.position }}
          >
            <img
              src={meme.src}
              alt=""
              width={meme.size}
              height={meme.size}
              className="rounded-lg opacity-80"
              style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating memes - Mobile */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden md:hidden">
        {FLOATING_MEMES_MOBILE.map((meme, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`absolute ${meme.className}`}
            style={{ ...meme.position }}
          >
            <img
              src={meme.src}
              alt=""
              width={meme.size}
              height={meme.size}
              className="rounded-md opacity-70"
              style={{ filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.2))" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Racing cars */}
      <div className="fixed bottom-24 left-0 w-full pointer-events-none">
        <div className="animate-race-right" style={{ animationDelay: "0s" }}>
          <PixelCar color="var(--accent-secondary)" />
        </div>
      </div>
      <div className="fixed bottom-32 left-0 w-full pointer-events-none">
        <div className="animate-race-right-slow" style={{ animationDelay: "2s" }}>
          <PixelCar color="var(--accent)" />
        </div>
      </div>
      <div className="fixed bottom-40 left-0 w-full pointer-events-none">
        <div className="animate-race-left">
          <PixelCar color="#8b5cf6" />
        </div>
      </div>

      {/* Road */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-surface)] pointer-events-none">
        {/* Road lines */}
        <div className="absolute top-1/2 -translate-y-1/2 w-[200%] flex animate-road">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-8 h-2 bg-[var(--accent)] mx-4" />
            </div>
          ))}
        </div>
        {/* Road edges */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--accent-secondary)]" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[var(--accent-secondary)]" />
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
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <span className="px-6 py-3 bg-[var(--accent-secondary)] font-pixel text-[10px] text-white border-4 border-[var(--bg-dark)]">
            SHIP FASTER
          </span>
          <span className="px-6 py-3 bg-[var(--accent)] font-pixel text-[10px] text-black border-4 border-[var(--bg-dark)]">
            GET SEEN
          </span>
          <span className="px-6 py-3 bg-[var(--bg-elevated)] font-pixel text-[10px] text-[var(--accent)] border-4 border-[var(--accent)]">
            COMPOUND VALUE
          </span>
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
            className="px-4 py-2 bg-[var(--bg-surface)] border-2 border-[var(--border)] font-pixel text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200"
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
