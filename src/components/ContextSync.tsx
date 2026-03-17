// components/ContextSync.tsx
"use client";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { useEffect } from "react";

export default function ContextSync({ context }: { context: UserContext }) {
  useEffect(() => {
    if (typeof window !== "undefined" && context.tenantId) {
      // Save to localStorage
      localStorage.setItem("userContext", JSON.stringify(context));
    }
  }, [context]);

  return null; // This component doesn't render anything
}
