export interface NewsEvent {
  _id?: string;
  name: string;
  label: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
