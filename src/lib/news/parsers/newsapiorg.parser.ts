import { Article, ArticleResponse } from "@/types/article";
// import { randomUUID } from "crypto";

export interface ApiArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface ApiArticlesResponse {
  status: string;
  totalResults: number;
  articles: Array<ApiArticle>;
}

export const parseArticle = (raw: ApiArticle): Article => {
  if (!raw) throw new Error("Parsing Error: Empty Article");
  const id = globalThis.crypto.randomUUID();

  return {
    id,
    slug: id, // for now use id as slug
    title: raw.title,
    description: raw.description,
    content: undefined,
    imageUrl: raw.urlToImage,
    source: raw.source?.name || "",
    publishedAt: raw.publishedAt,
    category: "",
    tags: [],
    language: "en",
  } as Article;
};

export const parseArticlesResponse = (
  raw: ApiArticlesResponse,
): ArticleResponse => {
  const articleRes: ArticleResponse = {
    totalCount: raw.totalResults || 0,
    nextPage: null,
    articles: raw.articles.map((item: ApiArticle) => parseArticle(item)) || [],
  };

  return articleRes;
};
