import { fetchTenants, Tenant } from "@worldnews/shared";
interface NewsBatchInfo {
  tenants: string[];
  country: string[];
  language: string[];
  category: string[];
}

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
