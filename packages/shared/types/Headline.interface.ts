import { Article } from "./Article.interface";

export interface Headline extends Article {
  providerName: string;
}
