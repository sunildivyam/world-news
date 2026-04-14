"use client";

import { AppContext } from "./AppContext.Provider";
import { useContext, useEffect, useState } from "react";
import CategoryNavSmart from "./CategoryNavSmart";
import CategoryNav from "./CategoryNav";
import { TenantConfig } from "@worldnews/shared/types";

export default function Header() {
  const { userCtx } = useContext(AppContext) || {};
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);

  useEffect(() => {
    setTenantConfig(userCtx?.tenantCtx?.tenant?.settings!);
  }, [userCtx]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 backdrop-blur-md">
      {tenantConfig?.navigation.style === "smart" && <CategoryNavSmart />}
      {tenantConfig?.navigation.style !== "smart" && <CategoryNav />}
    </header>
  );
}
