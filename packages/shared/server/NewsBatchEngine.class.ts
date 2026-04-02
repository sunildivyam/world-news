import { articleProviders } from "../news-providers";
import {
  createHeadlines,
  fetchActiveNewsBatches,
  updateNewsBatch,
} from "../news-engine-apis";
import { executeWithFailover } from "../news-providers/provider-manager";
import { AppError, Article, ArticleCollection, NewsBatch } from "../types";

export class NewsBatchEngine {
  newsBatch: NewsBatch[] = [];

  private static instance: NewsBatchEngine;

  constructor() {}

  static getInstance(): NewsBatchEngine {
    if (!NewsBatchEngine.instance) {
      NewsBatchEngine.instance = new NewsBatchEngine();
    }
    return NewsBatchEngine.instance;
  }

  async loadBatches() {
    this.newsBatch = await fetchActiveNewsBatches();
  }

  async getArticles(
    country: string,
    category: string,
  ): Promise<ArticleCollection | AppError> {
    let providerName = "";
    const articleCollection = await executeWithFailover<
      ArticleCollection | AppError
    >(async (provider) => {
      providerName = provider.name;
      return await provider.fetchArticles(
        { geo: { country: country } },
        { category: [category] },
      );
    }, articleProviders);

    if (AppError.isError(articleCollection)) {
      console.log(`Error fetching: ${country} and ${category}`);
      return articleCollection;
    } else {
      const articles = (articleCollection as ArticleCollection).articles;
      // send them to deduplication service
      const uniqueArticles = await this.deDuplicate(articles);
      // Save them to headlines DB collection
      await this.sendToHeadlines(uniqueArticles, providerName);
      console.log(`Finished for:${country} | ${category}`);

      return articleCollection;
    }
  }

  async sendToHeadlines(
    articles: Article[],
    providerName: string,
  ): Promise<void> {
    const headlines = articles.map((a) => ({
      ...a,
      providerName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await createHeadlines(headlines);
  }

  async deDuplicate(articles: Article[]): Promise<Article[]> {
    return articles;
  }

  async markNewsBatchFinished(id: string) {
    await updateNewsBatch(id, { finishedAt: new Date() });
  }

  async markNewsBatchStarted(id: string) {
    await updateNewsBatch(id, { startedAt: new Date() });
  }

  async start() {
    await this.loadBatches();
    let currentIndex = 0;
    while (this.newsBatch?.length && currentIndex < this.newsBatch?.length) {
      const batch = this.newsBatch[currentIndex];
      await this.markNewsBatchStarted(batch.id || "");
      console.log(`Batch started: ${batch.id}`);

      const { country } = batch;
      await Promise.all(
        country.map(async (c: string) => {
          const { category } = batch;
          const catPromisesRes = await Promise.all(
            category.map(async (cat: string) => {
              // call news api with for each country and category
              return this.getArticles(c, cat);
            }),
          );
          console.log(`Finished for: ${country}`);
          return catPromisesRes;
        }),
      );
      currentIndex++;
      console.log(`Finished for: ${batch.id}`);
      // Mark News Batch as finished
      await this.markNewsBatchFinished(batch.id || "");
    }
    console.log(`Finished All BATCHES`);
  }
}

export const newsBatchEngine = NewsBatchEngine.getInstance();
