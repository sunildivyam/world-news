import { Tenant } from "@/types/Tenant";

export const tenants: Tenant[] = [
  {
    id: "globalnews",
    name: "Global News",
    primaryLanguage: "en",
    primaryCountry: "us",
    createdDate: new Date(),
    updatedDate: new Date(),
    isActive: true,
    domain: "globalnews.com",
  },
  {
    id: "globalnewsA",
    name: "Global News A",
    primaryLanguage: "hi",
    primaryCountry: "in",
    createdDate: new Date(),
    updatedDate: new Date(),
    isActive: true,
    domain: "globalnewsA.com",
  },
];
