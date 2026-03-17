"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/app-constants/categories.constants";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { TenantConfig } from "@/types/TenantConfig.interface";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { PageTypeEnum } from "@/types/PageType.enum";

export default function CategoryNav({
  userCtx,
  tenantConfig,
}: {
  userCtx: UserContext;
  tenantConfig: TenantConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (value: string) => {
    return pathname?.includes(value);
  };

  return (
    <nav className="w-full border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 flex-wrap">
            {categories.map((cat) => {
              const catUrl = resolveUrl(
                userCtx,
                PageTypeEnum.category,
                cat.value,
              );
              return (
                <Link
                  key={cat.value}
                  href={catUrl}
                  className={`text-sm font-medium transition ${
                    isActive(cat.value)
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {cat.label}
                </Link>
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
                className={`block w-6 h-0.5 ${tenantConfig.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
              ></span>
              <span
                className={`block w-6 h-0.5 ${tenantConfig.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
              ></span>
              <span
                className={`block w-6 h-0.5 ${tenantConfig.theme.mode === "dark" ? "bg-white" : "bg-black"}`}
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
                <Link
                  key={cat.value}
                  href={catUrl}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium ${
                    isActive(cat.value) ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
