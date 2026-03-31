export interface NewsBatch {
  id?: string;
  tenants: string[]; // list of tenants
  country: string[]; // merged list of tenant's allowed countries
  category: string[]; // merged list of tenant's allowed categories
  language: string[]; // merged list of tenant's allowed languages
  scheduledAt?: Date | string;
  startedAt?: Date | string;
  finishedAt?: Date | string;
}
