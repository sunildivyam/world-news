import { Tenant } from "../../../types/Tenant";

export interface TenantContext {
  tenant?: Tenant;
  language?: string;
  domain?: string;

  geo: {
    country?: string;
    region?: string;
    city?: string;
    ip?: string;
  };
}
