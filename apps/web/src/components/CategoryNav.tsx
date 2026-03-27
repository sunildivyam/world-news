"use client";

import { useContext, useState } from "react";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { usePathname } from "next/navigation";
import { categories } from "@/app-constants/categories.constants";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { PageTypeEnum } from "@worldnews/shared";
import { AppContext } from "./AppContext.Provider";
import { SectionError } from "./SectionError";
import { AppError } from "@worldnews/shared";
import TenantLogo from "./TenantLogo";

export default function CategoryNav() {
  const { userCtx, tenantConfig } = useContext(AppContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (value: string) => {
    return pathname?.includes(value);
  };

  if (!userCtx)
    return (
      <SectionError
        error={new AppError("CategoryNav", "User Context missing", 400)}
      />
    );

  return (
    <nav className="w-full border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <TenantLogo />
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 flex-wrap">
            {categories.map((cat) => {
              const catUrl = resolveUrl(
                userCtx,
                PageTypeEnum.category,
                cat.value,
              );
              return (
                <NoPrefetchLink
                  key={cat.value}
                  href={catUrl}
                  className={`text-sm font-medium transition ${
                    isActive(cat.value)
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {cat.label}
                </NoPrefetchLink>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span
                className={`block w-6 h-0.5 ${tenantConfig?.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
              ></span>
              <span
                className={`block w-6 h-0.5 ${tenantConfig?.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
              ></span>
              <span
                className={`block w-6 h-0.5 ${tenantConfig?.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-row gap-4 pb-4 pt-4 flex-wrap">
            {categories.map((cat) => {
              const catUrl = resolveUrl(
                userCtx,
                PageTypeEnum.category,
                cat.value,
              );
              return (
                <NoPrefetchLink
                  key={cat.value}
                  href={catUrl}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium ${
                    isActive(cat.value) ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {cat.label}
                </NoPrefetchLink>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
