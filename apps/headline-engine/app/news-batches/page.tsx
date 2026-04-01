/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsBatch } from "@worldnews/shared";
import {
  fetchNewsBatches,
  deleteNewsBatch,
} from "@worldnews/shared/news-engine-apis";

export default function NewsBatchesPage() {
  const [newsBatches, setNewsBatches] = useState<NewsBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsBatches();
  }, []);

  const loadNewsBatches = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsBatches();
      setNewsBatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news batch?")) return;

    try {
      await deleteNewsBatch(id);
      setNewsBatches(newsBatches.filter((batch) => batch.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Batches</h1>
        <Link
          href="/news-batches/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Batch
        </Link>
      </div>

      <div className="grid gap-4">
        {newsBatches.map((batch, index) => (
          <div key={batch.id || index} className="border p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Batch ID: {batch.id}</h2>
                <p className="text-sm text-gray-600">
                  Tenants: {batch.tenants.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Countries: {batch.country.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Categories: {batch.category.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Languages: {batch.language.join(", ")}
                </p>
                {batch.scheduledAt && (
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(batch.scheduledAt).toLocaleString()}
                  </p>
                )}
                {batch.startedAt && (
                  <p className="text-sm text-gray-600">
                    Started: {new Date(batch.startedAt).toLocaleString()}
                  </p>
                )}
                {batch.finishedAt && (
                  <p className="text-sm text-gray-600">
                    Finished: {new Date(batch.finishedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/news-batches/${batch.id}/edit`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => batch.id && handleDelete(batch.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {newsBatches.length === 0 && (
        <p className="text-gray-500 text-center py-8">No news batches found.</p>
      )}
    </div>
  );
}
