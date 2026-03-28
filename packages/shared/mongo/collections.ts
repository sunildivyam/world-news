import {
  ApiKey,
  Article,
  ArticleSource,
  Category,
  Country,
  Language,
  NewsEvent,
  Tag,
  Tenant,
} from "../types";
import { getDB } from "./db";

export async function getCollections() {
  const db = await getDB();

  return {
    tenants: db.collection<Tenant>("tenants"),
    languages: db.collection<Language>("languages"),
    countries: db.collection<Country>("countries"),
    categories: db.collection<Category>("categories"),
    newsEvents: db.collection<NewsEvent>("newsEvents"),
    tags: db.collection<Tag>("tags"),
    articleSources: db.collection<ArticleSource>("articleSources"),
    headlines: db.collection("headlines"),
    articles: db.collection<Article>("articles"),
    subscriptions: db.collection("subscriptions"),
    apiKeys: db.collection<ApiKey>("apikeys"),
  };
}
