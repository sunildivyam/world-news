import { Address } from "./Address";

export interface Tenant {
  // mendatory fields
  id: string;
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
  settings?: Record<string, any>; // Wep app theme, style, Display Name and other preferences
  subscriptionPlan?: string;
  customFields?: Record<string, any>;
}
