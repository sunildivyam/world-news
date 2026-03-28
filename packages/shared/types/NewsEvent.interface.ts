export interface NewsEvent {
  id?: string;
  name: string;
  label: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
