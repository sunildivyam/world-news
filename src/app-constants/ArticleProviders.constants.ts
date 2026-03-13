import { NewsApiAOrgProvider } from "@/lib/news/providers/NewsApiAOrg/NewsApiAOrgProvider.class";
import { NewsdataProvider } from "@/lib/news/providers/NewsData/NewsDataProvider.class";
import { ArticleProvider } from "@/types/ArticleProvider.interface";

export const articleProviders: ArticleProvider[] = [
  new NewsdataProvider(),
  new NewsApiAOrgProvider(),
];
