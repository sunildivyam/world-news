import { Article, Country, Language, Tenant } from "../types";
import { getDB } from "./db";

export async function getCollections() {
  const db = await getDB();

  return {
    tenants: db.collection<Tenant>("tenants"),
    languages: db.collection<Language>("languages"),
    countries: db.collection<Country>("countries"),
    headlines: db.collection("headlines"),
    articles: db.collection<Article>("articles"),
    subscriptions: db.collection("subscriptions"),
    apiKeys: db.collection("apikeys"),
  };
}
