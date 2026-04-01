/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewsBatch } from "@worldnews/shared";
import {
  fetchNewsBatch,
  updateNewsBatch,
} from "@worldnews/shared/news-engine-apis";
import NewsBatchForm from "@/lib/components/NewsBatchForm";

export default function EditNewsBatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<NewsBatch | undefined>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsBatch(id);
  }, [id]);

  const loadNewsBatch = async (id: string) => {
    try {
      setFetchLoading(true);
      const data = await fetchNewsBatch(id);
      if (data) {
        setInitialData(data);
      } else {
        setError("News batch not found");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<NewsBatch>) => {
    setLoading(true);
    setError(null);

    try {
      await updateNewsBatch(id, data);
      router.push("/news-batches");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/news-batches");
  };

  if (fetchLoading) return <div className="p-4">Loading...</div>;
  if (error && !initialData)
    return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <NewsBatchForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      onCancel={handleCancel}
    />
  );
}
