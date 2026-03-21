export type ArticleSectionType =
  | "heading"
  | "paragraph"
  | "unorderedList"
  | "OrderedList";

export type ArticleContent = Record<ArticleSectionType, string>;
