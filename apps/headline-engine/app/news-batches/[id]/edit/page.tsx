"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewsBatch } from "@worldnews/shared";
import {
  fetchNewsBatch,
  updateNewsBatch,
} from "@worldnews/shared/news-engine-apis";

export default function EditNewsBatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<Partial<NewsBatch>>({
    tenants: [],
    country: [],
    category: [],
    language: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsBatch();
  }, [id]);

  const loadNewsBatch = async () => {
    try {
      setFetchLoading(true);
      const data = await fetchNewsBatch(id);
      if (data) {
        setFormData(data);
      } else {
        setError("News batch not found");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateNewsBatch(id, formData as Partial<NewsBatch>);
      router.push("/news-batches");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: keyof NewsBatch, value: string) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  const handleDateChange = (
    field: "scheduledAt" | "startedAt" | "finishedAt",
    value: string,
  ) => {
    setFormData({ ...formData, [field]: value ? new Date(value) : undefined });
  };

  if (fetchLoading) return <div className="p-4">Loading...</div>;
  if (error && !formData.tenants)
    return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit News Batch</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tenants (comma-separated)
          </label>
          <input
            type="text"
            value={(formData.tenants || []).join(", ")}
            onChange={(e) => handleArrayChange("tenants", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="tenant1, tenant2, tenant3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Countries (comma-separated)
          </label>
          <input
            type="text"
            value={(formData.country || []).join(", ")}
            onChange={(e) => handleArrayChange("country", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="US, GB, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Categories (comma-separated)
          </label>
          <input
            type="text"
            value={(formData.category || []).join(", ")}
            onChange={(e) => handleArrayChange("category", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="politics, sports, technology"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Languages (comma-separated)
          </label>
          <input
            type="text"
            value={(formData.language || []).join(", ")}
            onChange={(e) => handleArrayChange("language", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="en, es, fr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scheduled At</label>
          <input
            type="datetime-local"
            value={
              formData.scheduledAt
                ? new Date(formData.scheduledAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => handleDateChange("scheduledAt", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Started At</label>
          <input
            type="datetime-local"
            value={
              formData.startedAt
                ? new Date(formData.startedAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => handleDateChange("startedAt", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Finished At</label>
          <input
            type="datetime-local"
            value={
              formData.finishedAt
                ? new Date(formData.finishedAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => handleDateChange("finishedAt", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Batch"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/news-batches")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
