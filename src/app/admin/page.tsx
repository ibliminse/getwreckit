"use client";

import { useState, useEffect } from "react";

interface User {
  email: string;
  position: number;
  referralCode: string;
  referralCount: number;
  referredBy: string | null;
  joinedAt: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const fetchUsers = async () => {
    if (!secret) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/waitlist/list?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
        setAuthenticated(true);
      } else {
        setError(data.error || "Failed to fetch");
        setAuthenticated(false);
      }
    } catch {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const exportCSV = () => {
    const headers = ["Email", "Position", "Referral Code", "Referrals", "Referred By", "Joined"];
    const rows = users.map((u) => [
      u.email,
      u.position,
      u.referralCode,
      u.referralCount,
      u.referredBy || "",
      u.joinedAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wreckit-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-pixel text-[var(--accent)] text-center mb-8">
            ADMIN
          </h1>
          <input
            type="password"
            placeholder="Enter secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            className="pixel-input w-full mb-4 text-center"
          />
          <button
            onClick={fetchUsers}
            disabled={loading || !secret}
            className="pixel-btn w-full disabled:opacity-50"
          >
            {loading ? "LOADING..." : "ACCESS"}
          </button>
          {error && (
            <p className="text-[var(--accent-secondary)] text-center mt-4 text-sm">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-dark)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-pixel text-[var(--accent)]">WAITLIST</h1>
            <p className="text-[var(--text-muted)] mt-1">
              {users.length} total signups
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchUsers} className="pixel-btn text-xs px-4 py-2">
              REFRESH
            </button>
            <button
              onClick={exportCSV}
              className="pixel-btn text-xs px-4 py-2"
              style={{ background: "var(--bg-elevated)", border: "2px solid var(--accent)" }}
            >
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
            <div className="text-3xl font-pixel text-[var(--accent)]">{users.length}</div>
            <div className="text-xs text-[var(--text-muted)]">Total</div>
          </div>
          <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
            <div className="text-3xl font-pixel text-[var(--accent)]">
              {users.filter((u) => u.referredBy).length}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Referred</div>
          </div>
          <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
            <div className="text-3xl font-pixel text-[var(--accent)]">
              {users.reduce((acc, u) => acc + u.referralCount, 0)}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Referrals Made</div>
          </div>
          <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
            <div className="text-3xl font-pixel text-[var(--accent-secondary)]">
              {users.filter((u) => {
                const joined = new Date(u.joinedAt);
                const today = new Date();
                return joined.toDateString() === today.toDateString();
              }).length}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Today</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">#</th>
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">Email</th>
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">Position</th>
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">Code</th>
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">Referrals</th>
                <th className="text-left py-3 px-4 text-xs text-[var(--text-muted)] font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.email}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors"
                >
                  <td className="py-3 px-4 text-[var(--text-muted)]">{i + 1}</td>
                  <td className="py-3 px-4 text-[var(--text-primary)]">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-[var(--accent)] font-semibold">#{user.position}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[var(--text-secondary)]">
                    {user.referralCode}
                  </td>
                  <td className="py-3 px-4">
                    {user.referralCount > 0 ? (
                      <span className="px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] text-xs rounded">
                        {user.referralCount}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">
                    {formatDate(user.joinedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
