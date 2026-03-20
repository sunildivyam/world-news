export interface ArticleSource {
  id: string;
  name: string;
  description?: string;
  url?: string;
  iconUrl?: string;
  imageUrl?: string;
  category?: string[];
  language?: string[];
  country?: string[];
  priority?: number;
}
