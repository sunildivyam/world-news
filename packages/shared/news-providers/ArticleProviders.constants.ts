import { GNewsIOProvider } from "./providers/GNewsIO/GNewsIOProvider.class";
import { NewsApiAOrgProvider } from "./providers/NewsApiAOrg/NewsApiAOrgProvider.class";
import { NewsdataProvider } from "./providers/NewsData/NewsDataProvider.class";
import type { ArticleProvider } from "../types";

export const articleProviders: ArticleProvider[] = [
  new NewsdataProvider(),
  new GNewsIOProvider(),
  new NewsApiAOrgProvider(),
];
