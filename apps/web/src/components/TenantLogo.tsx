import { useContext } from "react";
import { AppContext } from "./AppContext.Provider";

export default function TenantLogo({
  displayName,
  logoUrl,
}: {
  displayName: string;
  logoUrl: string;
}) {
  // const { userCtx } = useContext(AppContext) ?? {};
  // const tenantConfig = userCtx?.tenantCtx?.tenant?.settings!;

  if (!displayName && !logoUrl) return null;

  return (
    <div
      className="flex items-center justify-between pr-8"
      style={{ minWidth: "max-content" }}
    >
      <img src={logoUrl} alt="Logo" className="h-8 w-8 mr-2" />
      <span className="whitespace-nowrap">{displayName}</span>
    </div>
  );
}
