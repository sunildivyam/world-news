/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsBatch } from "@worldnews/shared";
import { createNewsBatch } from "@worldnews/shared/news-engine-apis";
import NewsBatchForm from "@/lib/components/NewsBatchForm";

export default function CreateNewsBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: NewsBatch) => {
    setLoading(true);
    setError(null);

    try {
      await createNewsBatch(data);
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

  return (
    <NewsBatchForm
      mode="create"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      onCancel={handleCancel}
    />
  );
}
