"use client";

import React, { useState, useTransition } from "react";

// Lucide Icons
import {
  Rss,
  Bell,
  CheckCircle2,
  Loader2,
  Zap,
  SlidersHorizontal,
  Filter,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

// Import your server action here
import { subscribeFeedNotify } from "@/actions/feeds";
import ComingSoon from "@/components/ComingSoon";

interface FeedsPageProps {
  companyName: string;
  contactEmail: string;
}

export default function FeedsPage({
  companyName,
  contactEmail,
}: FeedsPageProps) {
  // Category Filter Preview State
  const [selectedCategory, setSelectedCategory] = useState("technology");

  // Newsletter Notification Form State
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const categories = [
    { id: "technology", label: "Tech & AI", count: "1,240 feeds" },
    { id: "markets", label: "Finance & Markets", count: "890 feeds" },
    { id: "world", label: "World News", count: "2,100 feeds" },
    { id: "science", label: "Science & Space", count: "450 feeds" },
    { id: "culture", label: "Culture & Media", count: "620 feeds" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus(null);

    startTransition(async () => {
      try {
        const res = await subscribeFeedNotify(email, selectedCategory);
        if (res?.success) {
          setStatus({
            type: "success",
            message: `You're registered for early access to our ${categories.find((c) => c.id === selectedCategory)?.label || "Live"} stream!`,
          });
          setEmail("");
        } else {
          setStatus({
            type: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      } catch (err) {
        setStatus({
          type: "error",
          message: "Unable to connect to the server. Please try again later.",
        });
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-slate-50 to-transparent pointer-events-none" />

        {/* ================= HERO & COMING SOON HEADER ================= */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center my-auto">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-8 shadow-sm">
            <Rss className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Live Feed Indexer v2.0 In Development
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Real-Time News Streams <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
              Launching Soon
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're building a high-throughput feed engine that aggregates,
            de-duplicates, and categorizes news from over 5,000 sources in
            sub-second latency.
          </p>

          {/* ================= MOCK FEED FILTER PREVIEW ================= */}
          <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Stream Status
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Custom Feed Pipeline
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Items Teaser */}
            <div className="mt-6 space-y-3 font-sans">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 opacity-75">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      [Indexing Pipeline] Dynamic categorization for{" "}
                      {categories.find((c) => c.id === selectedCategory)?.label}
                      ...
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Connecting to{" "}
                      {categories.find((c) => c.id === selectedCategory)?.count}{" "}
                      globally
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-200 text-slate-600 font-semibold shrink-0">
                  BUILDING
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200/60 text-slate-400 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    Custom keyword filters & instant push notifications setting
                    up...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= EARLY ACCESS FORM ================= */}
          <div className="mt-12 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Want Priority Beta Access?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Get an invitation as soon as the live feed indexer goes online for
              your favorite topic.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 gap-2 shrink-0"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Get Invite
                    <Bell className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Success / Error Message */}
            {status && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{status.message}</span>
              </div>
            )}
          </div>

          {/* ================= ROADMAP TEASERS ================= */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-200/80 pt-12">
            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  &lt; 50ms Latency
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingesting wire reports and RSS updates seconds after
                  publication.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Custom Keywords
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create tailor-made streams for niche topics, companies, or
                  keywords.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Source Verification
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtering out spam, duplicate stories, and unverified blogs
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </main>

        <ComingSoon companyName={companyName} contactEmail={contactEmail} />
      </div>
    </>
  );
}
