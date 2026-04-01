/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { NewsBatch } from "@worldnews/shared";

interface NewsBatchFormProps {
  mode: "create" | "edit";
  initialData?: NewsBatch;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
}

export default function NewsBatchForm({
  mode,
  initialData,
  onSubmit,
  loading,
  error,
  onCancel,
}: NewsBatchFormProps) {
  const [formData, setFormData] = useState<Partial<NewsBatch>>({
    tenants: [],
    country: [],
    category: [],
    language: [],
  });
  const [tenantsInput, setTenantsInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
      setTenantsInput((initialData.tenants || []).join(", "));
      setCountryInput((initialData.country || []).join(", "));
      setCategoryInput((initialData.category || []).join(", "));
      setLanguageInput((initialData.language || []).join(", "));
    }
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedData = {
      tenants: tenantsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      country: countryInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: categoryInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      language: languageInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const data =
      mode === "create"
        ? ({ ...formData, ...parsedData } as NewsBatch)
        : ({ ...formData, ...parsedData } as Partial<NewsBatch>);

    await onSubmit(data);
  };

  const handleDateChange = (
    field: "scheduledAt" | "startedAt" | "finishedAt",
    value: string,
  ) => {
    setFormData({ ...formData, [field]: value ? new Date(value) : undefined });
  };

  const buttonText = mode === "create" ? "Create Batch" : "Update Batch";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Create News Batch" : "Edit News Batch"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tenants (comma-separated)
          </label>
          <input
            type="text"
            value={tenantsInput}
            onChange={(e) => setTenantsInput(e.target.value)}
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
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
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
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
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
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
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
            {loading ? loadingText : buttonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
