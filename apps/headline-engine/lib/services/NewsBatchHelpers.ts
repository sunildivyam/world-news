import { NewsBatchInfo } from "@/types/NewsBatchInfo.interface";
import type { Tenant } from "@worldnews/shared";
import { fetchTenants } from "@worldnews/shared/news-engine-apis";

export async function getNewsBatchInfoFromTenant(): Promise<NewsBatchInfo> {
  const tenants: Tenant[] = await fetchTenants();

  const batchInfo: NewsBatchInfo = {
    tenants: [],
    country: [],
    language: [],
    category: [],
  };

  tenants.forEach((tenant: Tenant) => {
    batchInfo.tenants.push(tenant.tenantId);
    batchInfo.country.push(...(tenant.country || []));
    batchInfo.language.push(...(tenant.language || []));
    batchInfo.category.push(...(tenant.category || []));
  });

  batchInfo.country = [...new Set(batchInfo.country)];
  batchInfo.language = [...new Set(batchInfo.language)];
  batchInfo.category = [...new Set(batchInfo.category)];
  return batchInfo;
}
