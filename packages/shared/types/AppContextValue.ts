import type { TenantConfig } from "./TenantConfig.interface";
import type { UserContext } from "./UserContext.interface";

export interface AppContextValue {
  userCtx: UserContext;
  tenantConfig: TenantConfig | null;
}
