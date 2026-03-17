"use client";

import { categories } from "@/app-constants/categories.constants";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { resolveUserContextFromLocalstorage } from "@/lib/contexts/user/UserContextClient.Resolver";
import { PageTypeEnum } from "@/types/PageType.enum";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [userCtx, setUserCtx] = useState<UserContext | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUserCtx(resolveUserContextFromLocalstorage());
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={resolveUrl(userCtx)}
          className="text-2xl font-extrabold text-brand"
        >
          GlobalNews
        </Link>
      </div>

      <nav className="border-t">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-6 py-3">
          {categories.map((cat) => {
            const catUrl = resolveUrl(
              userCtx,
              PageTypeEnum.category,
              cat.value,
            );
            const isActive = pathname === catUrl;
            return (
              <Link
                key={cat.value}
                href={catUrl}
                className={`whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? "text-brand border-b-2 border-brand pb-1"
                    : "text-gray-600 hover:text-brand"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
