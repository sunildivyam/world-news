import { ObjectId } from "mongodb";
import {
  ApiKey,
  Article,
  ArticleSource,
  Category,
  Country,
  Headline,
  Language,
  NewsBatch,
  NewsEvent,
  Tag,
  Tenant,
} from "../types";
import { getDB } from "./db";

interface ApiKeyEx extends Omit<ApiKey, "_id"> {
  _id?: ObjectId | string;
}

interface ArticleEx extends Omit<Article, "_id"> {
  _id?: ObjectId | string;
}

interface ArticleSourceEx extends Omit<ArticleSource, "_id"> {
  _id?: ObjectId | string;
}

interface CategoryEx extends Omit<Category, "_id"> {
  _id?: ObjectId | string;
}

interface CountryEx extends Omit<Country, "_id"> {
  _id?: ObjectId | string;
}

interface HeadlineEx extends Omit<Headline, "_id"> {
  _id?: ObjectId | string;
}

interface LanguageEx extends Omit<Language, "_id"> {
  _id?: ObjectId | string;
}

interface NewsBatchEx extends Omit<NewsBatch, "_id"> {
  _id?: ObjectId | string;
}

interface NewsEventEx extends Omit<NewsEvent, "_id"> {
  _id?: ObjectId | string;
}

interface TagEx extends Omit<Tag, "_id"> {
  _id?: ObjectId | string;
}

interface TenantEx extends Omit<Tenant, "_id"> {
  _id?: ObjectId | string;
}

export async function getCollections() {
  const db = await getDB();

  return {
    tenants: db.collection<TenantEx>("tenants"),
    languages: db.collection<LanguageEx>("languages"),
    countries: db.collection<CountryEx>("countries"),
    categories: db.collection<CategoryEx>("categories"),
    newsEvents: db.collection<NewsEventEx>("newsEvents"),
    newsBatches: db.collection<NewsBatchEx>("newsBatches"),
    tags: db.collection<TagEx>("tags"),
    articleSources: db.collection<ArticleSourceEx>("articleSources"),
    headlines: db.collection<HeadlineEx>("headlines"),
    articles: db.collection<ArticleEx>("articles"),
    subscriptions: db.collection("subscriptions"),
    apiKeys: db.collection<ApiKeyEx>("apikeys"),
  };
}
