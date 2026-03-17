import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { TenantConfig } from "./TenantConfig.interface";

export interface AppContextValue {
  userCtx: UserContext;
  tenantConfig: TenantConfig | null;
}
