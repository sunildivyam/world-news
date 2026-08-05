"use client";

import React, { useState, useEffect, useTransition } from "react";
import Head from "next/head";
import Link from "next/link";

// Lucide Icons
import {
  Newspaper,
  Sparkles,
  Bell,
  CheckCircle2,
  Loader2,
  Rss,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { subscribeNewsletter } from "@/actions/newsletter";

// Import your server action here

interface ComingSoonProps {
  companyName: string;
  contactEmail: string;
}

export default function ComingSoon({
  companyName,
  contactEmail,
}: ComingSoonProps) {
  // Countdown State (Target Date: Launch Date)
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  // Newsletter Form State
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Live Timer Countdown Effect
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 14); // Set 14 days out from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus(null);

    startTransition(async () => {
      try {
        const res = await subscribeNewsletter(email);
        if (res?.success) {
          setStatus({
            type: "success",
            message:
              "You're on the list! We'll notify you as soon as we go live.",
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
      <Head>
        <title>Coming Soon | {companyName}</title>
        <meta
          name="description"
          content={`${companyName} is launching soon. Subscribe to get early access to our next-gen news aggregator platform.`}
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-slate-50 to-transparent pointer-events-none" />

        {/* ================= HERO & COUNTDOWN ================= */}
        <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center my-auto">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Next-Gen News Aggregation
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Something Big is <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
              On The Horizon
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are building a faster, smarter way to read the world’s news.
            Real-time indexing, zero clutter, and 100% direct attribution to
            original publishers.
          </p>

          {/* ================= COUNTDOWN TIMER ================= */}
          <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Days
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Hours
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Mins
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-blue-600">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Secs
              </span>
            </div>
          </div>

          {/* ================= EMAIL NOTIFY FORM ================= */}
          <div className="mt-10 max-w-md mx-auto">
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
                    Notify Me
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

            <p className="text-xs text-slate-400 mt-3">
              Join 2,500+ readers waiting for early access. Zero spam ever.
            </p>
          </div>

          {/* ================= FEATURE TEASERS ================= */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-200/80 pt-12">
            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Real-Time Streams
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indexing news feeds instantly as articles drop worldwide.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Rss className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  5,000+ Sources
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated feeds across technology, markets, policy, and world
                  news.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Zero Clickbait
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Smart deduplication and clean, publisher-first redirection.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
