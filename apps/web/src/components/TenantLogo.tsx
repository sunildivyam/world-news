import { useContext } from "react";
import { AppContext } from "./AppContext.Provider";

export default function TenantLogo() {
  const { userCtx } = useContext(AppContext) ?? {};
  const tenantConfig = userCtx?.tenantCtx?.tenant?.settings!;

  if (!tenantConfig) return null;

  return (
    <div
      className="flex items-center justify-between pr-8"
      style={{ minWidth: "max-content" }}
    >
      <img
        src={tenantConfig.branding.logoUrl}
        alt="Logo"
        className="h-8 w-8 mr-2"
      />
      <span className="whitespace-nowrap">
        {tenantConfig.branding.displayName}
      </span>
    </div>
  );
}
