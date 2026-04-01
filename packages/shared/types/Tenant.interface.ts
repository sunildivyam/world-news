/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Address } from "./Address.interface";
import type { TenantConfig } from "./TenantConfig.interface";

export interface Tenant {
  // mendatory fields
  id?: string;
  tenantId: string;
  name: string;
  primaryLanguage: string;
  primaryCountry: string;
  createdDate: Date | string;
  updatedDate: Date | string;
  isActive: boolean;
  // Optional fields
  description?: string;
  domain?: string;
  subdomain?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  settings: TenantConfig;
  subscriptionPlan?: string;
  customFields?: Record<string, any>;
  country?: string[];
  language?: string[];
  category?: string[];
}
