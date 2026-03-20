import { GNewsIOProvider } from "@/lib/news/providers/GNewsIO/GNewsIOProvider.class";
import { NewsApiAOrgProvider } from "@/lib/news/providers/NewsApiAOrg/NewsApiAOrgProvider.class";
import { NewsdataProvider } from "@/lib/news/providers/NewsData/NewsDataProvider.class";
import { ArticleProvider } from "@worldnews/shared";

export const articleProviders: ArticleProvider[] = [
  new NewsdataProvider(),
  new GNewsIOProvider(),
  new NewsApiAOrgProvider(),
];
