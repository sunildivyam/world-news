"use client";

import { useContext, useEffect, useRef, useState } from "react";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { usePathname } from "next/navigation";
import { AppContext } from "./AppContext.Provider";
import { SectionError } from "./SectionError";
import { AppError, Category, TenantConfig } from "@worldnews/shared/types";
import { resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { PageTypeEnum } from "@worldnews/shared/types";
import TenantLogo from "./TenantLogo";
import { fetchTenantCategories } from "@worldnews/shared/news-engine-apis";

export default function CategoryNavSmart() {
  const { userCtx } = useContext(AppContext) || {};
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const pathname = usePathname();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setTenantConfig(userCtx?.tenantCtx?.tenant?.settings!);

    fetchTenantCategories(userCtx?.tenantId)
      .then((cats: Category[] | null) => {
        setCategories(cats || []);
      })
      .catch(() => {
        setCategories([]);
      });
  }, [userCtx]);

  const isActive = (value: string) => pathname?.includes(value);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            // scrolling down
            setVisible(false);
          } else {
            // scrolling up
            setVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!userCtx)
    return (
      <SectionError
        error={new AppError("CategoryNav", "User Context missing", 400)}
      />
    );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 border-b border-gray-300 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background:
          tenantConfig?.theme.mode === "dark" ? "#00000095" : "#ffffff95",
        color: tenantConfig?.theme.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* <div className="font-bold text-lg">WorldNews</div> */}
          <TenantLogo />

          <div className="hidden md:flex gap-4 flex-wrap mt-4 mb-4">
            {categories.map((cat) => {
              const catUrl = resolveUrl(
                userCtx,
                PageTypeEnum.category,
                cat.name,
              );
              return (
                <NoPrefetchLink
                  key={cat.name}
                  href={catUrl}
                  className={`text-sm font-medium transition ${
                    isActive(cat.name)
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  {cat.label}
                </NoPrefetchLink>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-4 min-w-max">
            {categories.map((cat) => {
              const catUrl = resolveUrl(
                userCtx,
                PageTypeEnum.category,
                cat.name,
              );
              return (
                <NoPrefetchLink
                  key={cat.name}
                  href={catUrl}
                  className={`text-sm whitespace-nowrap ${
                    isActive(cat.name)
                      ? "text-red-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {cat.label}
                </NoPrefetchLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
