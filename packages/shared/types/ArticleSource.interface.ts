export interface ArticleSource {
  _id?: string;
  slug?: string;
  name: string;
  description?: string;
  url?: string;
  iconUrl?: string;
  imageUrl?: string;
  category?: string[];
  language?: string[];
  country?: string[];
  priority?: number;
  totalArticles?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
