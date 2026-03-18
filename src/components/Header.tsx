"use client";

import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";
import CategoryNavSmart from "./CategoryNavSmart";
import CategoryNav from "./CategoryNav";

export default function Header() {
  const { userCtx, tenantConfig } = useContext(AppContext) || {};
  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 backdrop-blur-md">
      {tenantConfig?.navigation.style === "smart" && <CategoryNavSmart />}
      {tenantConfig?.navigation.style !== "smart" && <CategoryNav />}
    </header>
  );
}
