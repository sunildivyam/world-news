export interface ApiKey {
  id?: string;
  tenantId: string;
  key: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
