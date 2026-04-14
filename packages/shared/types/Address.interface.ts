export interface Address {
  _id?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  district?: string; // For Indian addresses
  landmark?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
