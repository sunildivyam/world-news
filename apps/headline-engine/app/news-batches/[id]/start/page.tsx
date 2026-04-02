"use client";

import { useParams } from "next/navigation";

export default function EditNewsBatchPage() {
  // const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <h1>Batch {id} Progress</h1>
    </div>
  );
}
