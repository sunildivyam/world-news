"use client";

import { categories } from "@/app-constants/categories.constants";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { resolveUserContextFromLocalstorage } from "@/lib/contexts/user/UserContextClient.Resolver";
import { PageTypeEnum } from "@/types/PageType.enum";
import { TenantConfig } from "@/types/TenantConfig.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryNav from "./CategoriesNav";

export default function Header({
  userCtx,
  tenantConfig,
}: {
  userCtx: UserContext;
  tenantConfig: TenantConfig;
}) {
  const pathname = usePathname();

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

      <CategoryNav userCtx={userCtx} tenantConfig={tenantConfig} />
    </header>
  );
}
