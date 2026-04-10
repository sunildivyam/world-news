/* eslint-disable @typescript-eslint/no-explicit-any */
// app/article-contents/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function ContentDashboard() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch("/api/content-engine/status");
    const data = await res.json();
    setStatus(data);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const startEngine = async () => {
    setLoading(true);
    await fetch("/api/content-engine/start", { method: "POST" });
    setLoading(false);
    fetchStatus();
  };

  const stopEngine = async () => {
    setLoading(true);
    await fetch("/api/content-engine/stop", { method: "POST" });
    setLoading(false);
    fetchStatus();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Content Engine Dashboard</h1>

        {/* Status */}
        <div className="mb-6">
          <p className="text-lg">
            Status:{" "}
            <span
              className={`font-semibold ${
                status?.isRunning ? "text-green-600" : "text-red-600"
              }`}
            >
              {status?.isRunning ? "Running" : "Stopped"}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={startEngine}
            disabled={loading || status?.isRunning}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Start
          </button>

          <button
            onClick={stopEngine}
            disabled={loading || !status?.isRunning}
            className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Stop
          </button>
        </div>

        {/* Progress */}
        <div>
          <h2 className="font-semibold mb-2">Progress</h2>

          <div className="bg-gray-200 overflow-hidden flex flex-col gap-2 p-4 m-4">
            <label>
              Headlines Processed({status?.progress?.headlines?.length || 0})
            </label>
            <ol style={{ listStyle: "auto" }} className="p-4">
              {status?.progress?.headlines?.map((hl: any, index: number) => (
                <li
                  key={hl.id + index}
                  className="border-b border-solid border-indigo-400"
                >
                  <label>{hl.title}</label> <span>{hl.id}</span>{" "}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gray-200 overflow-hidden flex flex-col gap-2 p-4 m-4">
            <label>
              Articles Processed({status?.progress?.articles?.length || 0})
            </label>
            <ol style={{ listStyle: "auto" }} className="p-4">
              {status?.progress?.articles?.map((art: any, index: number) => (
                <li
                  key={art.id + index}
                  className="border-b border-solid border-indigo-400"
                >
                  <label>{art.title}</label>
                  <p>{art.id}</p>
                  <p>Tenant: {art.tenantId}</p>
                  <p>Language: {art.language}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-gray-200 overflow-hidden flex flex-col gap-2 p-4 m-4">
            <label>Logs ({status?.progress?.logs?.length || 0})</label>
            <ol style={{ listStyle: "auto" }} className="p-4">
              {status?.progress?.logs?.map((log: string, index: number) => (
                <li
                  key={index}
                  className="border-b border-solid border-indigo-400"
                >
                  {log}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
