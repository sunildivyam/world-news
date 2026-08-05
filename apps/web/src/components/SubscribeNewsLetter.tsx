"use client";

import { Send } from "lucide-react";

export default function SubscribeNewsLetter() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
      <div className="relative">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <span className="text-[11px] text-slate-400 block">
        No spam. Unsubscribe at any time.
      </span>
    </form>
  );
}
