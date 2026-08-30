"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  LogOut,
  RefreshCw,
  Shield,
  AlertTriangle,
  Check,
  Ban,
} from "lucide-react";

interface AdminStartup {
  id: string;
  handle: string;
  website_url?: string | null;
  total_bid: number | string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [startups, setStartups] = useState<AdminStartup[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<"all" | "visible" | "hidden">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Quick hide input
  const [quickHandle, setQuickHandle] = useState<string>("");
  const [isQuickHiding, setIsQuickHiding] = useState<boolean>(false);

  // Check auth on load
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const json = await res.json();
      setIsAuthenticated(json.authenticated);
      if (json.authenticated) {
        fetchStartups();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchStartups = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("/api/admin/startups");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setStartups(json.data || []);
      } else {
        toast.error(json.message || "Failed to load startups");
      }
    } catch (err: any) {
      toast.error("Network error while loading startups");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      toast.error("Please enter the admin master key");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Authentication successful");
        setIsAuthenticated(true);
        setPasswordInput("");
        fetchStartups();
      } else {
        toast.error(json.message || "Invalid master key");
      }
    } catch {
      toast.error("Failed to connect to authentication server");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setStartups([]);
      toast.info("Logged out of admin session");
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleToggleHide = async (startup: AdminStartup) => {
    const nextHiddenState = !startup.is_hidden;
    setActionLoadingId(startup.id);

    try {
      const res = await fetch("/api/admin/startups/toggle-hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: startup.id,
          is_hidden: nextHiddenState,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(
          nextHiddenState
            ? `Hidden: ${startup.handle} is now suppressed from public leaderboard`
            : `Restored: ${startup.handle} is now live on public leaderboard`
        );
        // Optimistic local update
        setStartups((prev) =>
          prev.map((s) => (s.id === startup.id ? { ...s, is_hidden: nextHiddenState } : s))
        );
      } else {
        toast.error(json.message || "Failed to update status");
      }
    } catch {
      toast.error("Failed to communicate with moderation service");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickHide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickHandle.trim()) {
      toast.error("Please enter a handle or domain to suppress");
      return;
    }

    setIsQuickHiding(true);
    try {
      const res = await fetch("/api/admin/startups/toggle-hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: quickHandle.trim(),
          is_hidden: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Suppressed: "${quickHandle.trim()}" hidden from public board`);
        setQuickHandle("");
        fetchStartups();
      } else {
        toast.error(json.message || "Failed to hide handle");
      }
    } catch {
      toast.error("Error communicating with suppression service");
    } finally {
      setIsQuickHiding(false);
    }
  };

  // Filtered startups
  const filteredStartups = startups.filter((s) => {
    const matchesSearch =
      s.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.website_url && s.website_url.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === "visible") return !s.is_hidden;
    if (filterMode === "hidden") return s.is_hidden;
    return true;
  });

  const totalCount = startups.length;
  const visibleCount = startups.filter((s) => !s.is_hidden).length;
  const hiddenCount = startups.filter((s) => s.is_hidden).length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#0d0d0f] flex items-center justify-center font-inter">
        <div className="flex items-center gap-3 text-[#4d4d4d] dark:text-[#a1a1aa]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#ff682c]" />
          <span>Verifying security clearance...</span>
        </div>
      </div>
    );
  }

  // 1. Password Entry / Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#0d0d0f] flex items-center justify-center p-4 font-inter text-[#202020] dark:text-[#f4f4f5]">
        <div className="w-full max-w-md bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ff682c]/10 text-[#ff682c] flex items-center justify-center mx-auto mb-4 border border-[#ff682c]/20">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-polysans font-bold tracking-tight text-[#202020] dark:text-[#f4f4f5]">
              Moderation Portal
            </h1>
            <p className="text-sm text-[#828282] dark:text-[#71717a]">
              Enter the master secret key to moderate and suppress non-bidding platforms.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#666] dark:text-[#888]">
                Master Secret Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="wb_admin_..."
                  autoFocus
                  className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#f5f5f5] dark:bg-[#202024] border border-[#e0e0e0] dark:border-[#333] text-sm text-[#202020] dark:text-white placeholder-[#999] focus:outline-none focus:border-[#ff682c] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#888] absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-[#888] hover:text-[#202020] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 rounded-xl bg-[#202020] dark:bg-[#f4f4f5] text-white dark:text-[#0d0d0f] font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Unlock Observatory</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#888] hover:text-[#ff682c] transition-colors"
            >
              ← Return to Public Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#0d0d0f] text-[#202020] dark:text-[#f4f4f5] font-inter">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-md border-b border-[#e8e8e8] dark:border-[#27272a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-polysans font-bold text-lg hover:opacity-80">
              <span className="text-[#202020] dark:text-white">whosbidding</span>
              <span className="text-[#ff682c]">.lol</span>
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#ff682c]/10 text-[#ff682c] border border-[#ff682c]/20 font-semibold uppercase tracking-wider">
              Moderation Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-medium text-[#666] dark:text-[#aaa] hover:text-[#202020] dark:hover:text-white px-3 py-1.5 rounded-lg border border-[#e0e0e0] dark:border-[#333] transition-colors flex items-center gap-1.5"
            >
              <span>View Public Board</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-[#ff4d4f] hover:bg-[#ff4d4f]/10 px-3 py-1.5 rounded-lg border border-[#ff4d4f]/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a]">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#888]">Total Registered</div>
            <div className="text-3xl font-polysans font-bold text-[#202020] dark:text-white mt-1">
              {totalCount}
            </div>
            <div className="text-xs text-[#888] mt-1">All time entries placed</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a]">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#10b981]">Publicly Visible</div>
            <div className="text-3xl font-polysans font-bold text-[#10b981] mt-1">
              {visibleCount}
            </div>
            <div className="text-xs text-[#888] mt-1">Active on leaderboard rank list</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a]">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#ff682c]">Suppressed / Hidden</div>
            <div className="text-3xl font-polysans font-bold text-[#ff682c] mt-1">
              {hiddenCount}
            </div>
            <div className="text-xs text-[#888] mt-1">Non-bidding platforms suppressed</div>
          </div>
        </div>

        {/* Quick Suppress Banner */}
        <div className="p-5 rounded-2xl bg-[#f5f1eb] dark:bg-[#1f1e24] border border-[#e5ded3] dark:border-[#302e38] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#202020] dark:text-[#f4f4f5]">
            <AlertTriangle className="w-4 h-4 text-[#ff682c]" />
            <span>Quick Suppress Tool (Instant Hide)</span>
          </div>
          <p className="text-xs text-[#666] dark:text-[#aaa]">
            Quickly suppress any non-bidding platform by exact handle or URL domain. It will be immediately removed from the leaderboard.
          </p>
          <form onSubmit={handleQuickHide} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="text"
              value={quickHandle}
              onChange={(e) => setQuickHandle(e.target.value)}
              placeholder="e.g. TurboDocx.com or some-unrelated-saas.com"
              className="flex-1 h-10 px-3.5 rounded-xl bg-white dark:bg-[#141416] border border-[#d8d0c4] dark:border-[#3d3a46] text-xs text-[#202020] dark:text-white placeholder-[#888] focus:outline-none focus:border-[#ff682c]"
            />
            <button
              type="submit"
              disabled={isQuickHiding}
              className="h-10 px-5 rounded-xl bg-[#ff682c] text-white text-xs font-semibold hover:bg-[#e0561e] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isQuickHiding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
              <span>Suppress Now</span>
            </button>
          </form>
        </div>

        {/* Startups Table & Management */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "all"
                    ? "bg-[#202020] dark:bg-white text-white dark:text-[#0d0d0f] shadow-sm font-semibold"
                    : "text-[#666] dark:text-[#aaa] hover:text-[#202020] dark:hover:text-white"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilterMode("visible")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "visible"
                    ? "bg-[#202020] dark:bg-white text-white dark:text-[#0d0d0f] shadow-sm font-semibold"
                    : "text-[#666] dark:text-[#aaa] hover:text-[#202020] dark:hover:text-white"
                }`}
              >
                Visible ({visibleCount})
              </button>
              <button
                onClick={() => setFilterMode("hidden")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "hidden"
                    ? "bg-[#202020] dark:bg-white text-white dark:text-[#0d0d0f] shadow-sm font-semibold"
                    : "text-[#666] dark:text-[#aaa] hover:text-[#202020] dark:hover:text-white"
                }`}
              >
                Hidden / Suppressed ({hiddenCount})
              </button>
            </div>

            {/* Search Bar & Refresh */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search handle or URL..."
                  className="w-full h-9 pl-8 pr-3 rounded-xl bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] text-xs text-[#202020] dark:text-white placeholder-[#999] focus:outline-none focus:border-[#ff682c]"
                />
                <Search className="w-3.5 h-3.5 text-[#888] absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={fetchStartups}
                disabled={isLoadingList}
                title="Refresh List"
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] flex items-center justify-center text-[#666] dark:text-[#aaa] hover:text-[#202020] dark:hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? "animate-spin text-[#ff682c]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f8f6] dark:bg-[#141416] border-b border-[#e8e8e8] dark:border-[#27272a] text-[#888] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Platform / Handle</th>
                    <th className="px-5 py-3.5">Total Bid</th>
                    <th className="px-5 py-3.5">Moderation Status</th>
                    <th className="px-5 py-3.5">Registered</th>
                    <th className="px-5 py-3.5 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efefef] dark:divide-[#242428]">
                  {filteredStartups.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-[#888]">
                        {isLoadingList ? "Loading platforms..." : "No matching platforms found."}
                      </td>
                    </tr>
                  ) : (
                    filteredStartups.map((s) => {
                      const isPending = actionLoadingId === s.id;
                      const bidAmount = typeof s.total_bid === "number" ? s.total_bid : parseFloat(s.total_bid);

                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-[#faf9f6] dark:hover:bg-[#1c1c20] transition-colors ${
                            s.is_hidden ? "bg-[#fff7f5]/40 dark:bg-[#251b18]/20" : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-sm text-[#202020] dark:text-white flex items-center gap-1.5">
                              <span>{s.handle}</span>
                              {s.website_url && (
                                <a
                                  href={s.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#888] hover:text-[#ff682c]"
                                  title={s.website_url}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            {s.website_url && (
                              <div className="text-[11px] text-[#888] font-mono truncate max-w-xs mt-0.5">
                                {s.website_url}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-polysans font-bold text-sm text-[#202020] dark:text-white">
                              ${bidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {s.is_hidden ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ff4d4f]/10 text-[#ff4d4f] border border-[#ff4d4f]/20">
                                <Ban className="w-3 h-3" />
                                <span>Suppressed (Hidden)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                                <Check className="w-3 h-3" />
                                <span>Publicly Live</span>
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-[#888] text-[11px]">
                            {new Date(s.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleToggleHide(s)}
                              disabled={isPending}
                              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5 ${
                                s.is_hidden
                                  ? "bg-[#10b981] text-white hover:bg-[#059669]"
                                  : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-white"
                              }`}
                            >
                              {isPending ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : s.is_hidden ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Ban className="w-3 h-3" />
                              )}
                              <span>{s.is_hidden ? "Restore to Board" : "Hide from Board"}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
