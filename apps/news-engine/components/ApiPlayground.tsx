"use client";

import { useState } from "react";

export default function ApiPlayground() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);

    const res = await fetch("/api/headlines");
    const json = await res.json();

    setData(json);
    setLoading(false);
  };

  return (
    <section id="playground" className="px-6">
      <h2 className="text-3xl font-semibold text-center">
        Try the API Instantly
      </h2>

      <div className="mt-8 max-w-3xl mx-auto">
        <button
          onClick={fetchNews}
          className="px-5 py-2 bg-black text-white rounded-lg"
        >
          {loading ? "Loading..." : "Fetch Headlines"}
        </button>

        <pre className="mt-6 p-4 bg-gray-900 text-green-400 rounded-xl overflow-auto text-sm">
          {data ? JSON.stringify(data, null, 2) : "Click to fetch data..."}
        </pre>
      </div>
    </section>
  );
}
