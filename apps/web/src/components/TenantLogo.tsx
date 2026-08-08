import { useContext } from "react";
import { AppContext } from "./AppContext.Provider";
import { cn } from "@/lib/utils";

export default function TenantLogo({ displayName, logoUrl }: { displayName: string; logoUrl: string }) {
  // const { userCtx } = useContext(AppContext) ?? {};
  // const tenantConfig = userCtx?.tenantCtx?.tenant?.settings!;

  if (!displayName && !logoUrl) return null;

  return (
    <div className={cn(["flex items-center justify-start", displayName ? "pr-8 pl-2" : "px-2"])} style={{ minWidth: "max-content" }}>
      <img src={logoUrl} alt="Logo" className="h-8 w-8" />
      <span className="whitespace-nowrap">{displayName}</span>
    </div>
  );
}
