export type ArticleSectionType =
  | "heading"
  | "paragraph"
  | "unorderedList"
  | "orderedList";

export type ArticleContent = Record<ArticleSectionType, string>;
