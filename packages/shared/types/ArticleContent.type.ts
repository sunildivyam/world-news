export type ArticleSectionType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "ul"
  | "ol"
  | "title"
  | "summary"
  | "keywords"
  | "tags";

export interface ArticleSection {
  type: ArticleSectionType;
  value?: string;
  items?: string[];
}

export type ArticleContent = Array<ArticleSection>;
