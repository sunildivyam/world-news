"use client";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import Link from "next/link";
import CategoryNav from "./CategoriesNav";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";

export default function Header() {
  const { userCtx, tenantConfig } = useContext(AppContext) ?? {};

  if (!userCtx || !tenantConfig) return null;

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={resolveUrl(userCtx)}
          className="text-2xl font-extrabold text-brand"
        >
          <div className="flex items-center justify-between">
            <img
              src={tenantConfig.branding.logoUrl}
              alt="Logo"
              className="h-8 w-8 mr-2"
            />
            <span>{tenantConfig.branding.displayName}</span>
          </div>
        </Link>
      </div>

      <CategoryNav />
    </header>
  );
}
