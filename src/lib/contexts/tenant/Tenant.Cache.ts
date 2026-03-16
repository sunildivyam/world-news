import { Tenant } from "@/types/Tenant";

const tenantCache = new Map<string, Tenant>();

export function getCachedTenant(key: string) {
  return tenantCache.get(key);
}

export function cacheTenant(key: string, tenant: Tenant) {
  tenantCache.set(key, tenant);
}
