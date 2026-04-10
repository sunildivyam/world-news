import { headlineProviders } from "../news-providers";
import {
  createHeadlines,
  fetchActiveNewsBatches,
  updateNewsBatch,
} from "../news-engine-apis";
import { executeWithFailover } from "../news-providers/provider-manager";
import {
  AppError,
  Article,
  ArticleCollection,
  Headline,
  NewsBatch,
} from "../types";

export class NewsBatchEngine {
  newsBatches: NewsBatch[] = [];

  private static instance: NewsBatchEngine;

  constructor() {}

  static getInstance(): NewsBatchEngine {
    if (!NewsBatchEngine.instance) {
      NewsBatchEngine.instance = new NewsBatchEngine();
    }
    return NewsBatchEngine.instance;
  }

  async loadBatches() {
    this.newsBatches = await fetchActiveNewsBatches();
  }

  async getArticles(
    country: string,
    category: string,
    tenants: string[],
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
    }, headlineProviders);

    if (AppError.isError(articleCollection)) {
      console.log(`Error fetching: ${country} and ${category}`);
      return articleCollection;
    } else {
      const articles = (articleCollection as ArticleCollection).articles;
      // send them to deduplication service
      const uniqueArticles = await this.deDuplicate(articles);
      // Save them to headlines DB collection
      await this.sendToHeadlines(uniqueArticles, providerName, tenants);
      console.log(`Finished for:${country} | ${category}`);

      return articleCollection;
    }
  }

  async sendToHeadlines(
    articles: Article[],
    providerName: string,
    tenants: string[],
  ): Promise<void> {
    const headlines = articles.map(
      (a) =>
        ({
          ...a,
          tenantIds: [...tenants],
          providerName,
          contentGenerated: {
            language: [],
            tenantId: [],
          },
          contentGeneratedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as Headline,
    );
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
    if (this.newsBatches?.length) {
      console.log("Batch is already started.");
      return null;
    }

    await this.loadBatches();

    let currentIndex = 0;

    while (
      this.newsBatches?.length &&
      currentIndex < this.newsBatches?.length
    ) {
      const batch = this.newsBatches[currentIndex];
      await this.markNewsBatchStarted(batch.id || "");
      console.log(`Batch started: ${batch.id}`);

      const { country, tenants } = batch;

      for (const c of country) {
        const { category } = batch;
        for (const cat of category) {
          // call news api with for each country and category
          await this.getArticles(c, cat, tenants);
        }

        console.log(`Finished for: ${country}`);
      }

      currentIndex++;
      console.log(`Finished for: ${batch.id}`);
      // Mark News Batch as finished
      await this.markNewsBatchFinished(batch.id || "");
    }

    console.log(`Finished All BATCHES`);
    this.newsBatches = []; // resets the batches
    return true;
  }
}

export const newsBatchEngine = NewsBatchEngine.getInstance();
