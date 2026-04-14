import { GNewsIOProvider } from "./providers/GNewsIO/GNewsIOProvider.class";
import { NewsApiAOrgProvider } from "./providers/NewsApiAOrg/NewsApiAOrgProvider.class";
import { NewsdataProvider } from "./providers/NewsData/NewsDataProvider.class";
import type { ArticleProvider } from "../types";
import { NewsEngineApiProvider } from "./providers/NewsEngineApi/NewsEngineApiProvider.class";

export const headlineProviders: ArticleProvider[] = [
  new NewsdataProvider(),
  new GNewsIOProvider(),
  new NewsApiAOrgProvider(),
];

export const articleProviders: ArticleProvider[] = [
  new NewsEngineApiProvider(),
];
