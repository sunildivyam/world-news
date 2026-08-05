/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createArticle,
  createArticleSource,
  fetchArticleSource,
  fetchLanguage,
  fetchTenant,
} from "../../news-engine-apis";
import {
  fetchHeadlinesByContentGenerated,
  updateHeadline,
} from "../../news-engine-apis/headlines";
import {
  Article,
  ArticleGeo,
  Headline,
  Tenant,
  PageTypeEnum,
  ArticleContent,
  ArticleSource,
} from "../../types";
import { generateAIContent } from "./ai-apis";
import { getPrompt } from "./ai-prompts";
import { randomAuthor } from "./authors";
import { convertToSlug } from "../../utils/slugs";
import { ContentEngineProgress } from "./ContentEngineProgress.interface";
import { Logger } from "../../logging";

export class ContentEngine {
  private headline: Headline | null = null;
  private _logger: Logger;
  private _progress: ContentEngineProgress = {
    isRunning: false,
    logs: [],
    headlines: [],
    articles: [],
  };

  onProgress?: (data: ContentEngineProgress) => void;

  private static instance: ContentEngine;

  constructor() {
    this._logger = new Logger({}, (logs: string[]) => {
      this._progress.logs = logs;
      this.onProgress?.(this._progress);
    });
  }

  static getInstance(): ContentEngine {
    if (!ContentEngine.instance) {
      ContentEngine.instance = new ContentEngine();
    }
    return ContentEngine.instance;
  }

  public get isRunning(): boolean {
    return this._progress.isRunning;
  }

  public get progress(): ContentEngineProgress {
    return this._progress;
  }

  private async readHeadline(): Promise<Headline | null> {
    const headlines = await fetchHeadlinesByContentGenerated(null, 1);
    if (headlines?.length) {
      return headlines[0];
    }

    return null;
  }

  private isTenantElligible(
    tenant: Tenant | null,
    headline: Headline | null,
  ): boolean {
    if (!tenant || !headline || !headline.geo?.country || !headline.category)
      return false;
    const { country, category } = tenant;

    if (
      category?.includes(headline?.category) &&
      country?.includes(headline.geo.country)
    )
      return true;

    return false;
  }

  private buildCanonical(nArticle: Article, tenantDomain: string): string {
    let canonical = `https://`;
    if (tenantDomain) {
      canonical += `${tenantDomain}/${nArticle.geo.country}/${nArticle.language}/${PageTypeEnum.article}/${nArticle.slug}`;
    } else {
      canonical = `${nArticle.geo.country}/${nArticle.language}/${PageTypeEnum.article}/${nArticle.slug}`;
    }

    return canonical;
  }

  private populateArticleWithAiContent(
    article: Article,
    aiContent: ArticleContent | null,
    tenantDomain: string,
  ): Article | null {
    console.log(`populating Ai content `);
    if (!aiContent) return null;

    let nArticle = {
      ...article,
      content: [] as any,
    };

    aiContent.forEach((el: any) => {
      switch (el.type) {
        case "title":
          nArticle.title = el.value;
          break;
        case "summary":
          nArticle.description = el.value;
          break;
        case "keywords":
          nArticle.keywords = [...el.items];
          break;
        case "tags":
          nArticle.tags = [...el.items];
          break;
        default:
          nArticle.content.push(el);
          break;
      }
    });

    // populate calculated fields
    nArticle.slug = convertToSlug(nArticle.title);

    nArticle = {
      ...nArticle,
      author: randomAuthor,
      url: this.buildCanonical(nArticle, tenantDomain), // generate article's canonical url
      publishedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    return nArticle;
  }

  private async getOrAddSource(articleSource: ArticleSource): Promise<string> {
    try {
      const source = await fetchArticleSource(articleSource.slug).catch(
        (err: any) => {
          this._logger.log(
            `${articleSource.slug} does not exist, so creating it`,
          );
          return null;
        },
      );

      if (source) {
        return source._id!;
      }

      const result = await createArticleSource(articleSource);
      return result._id!;
    } catch (error: any) {
      this._logger.log("Error Adding Source" + error?.message);
      return "";
    }
  }

  private async generateArticle(
    headline: Headline,
    tenantId: string,
    language: string,
    tenantDomain: string,
  ): Promise<Article | null> {
    try {
      let article: Article | null = {
        headlineId: headline._id,
        slug: "",
        title: "",
        description: "",
        author: "",
        category: headline.category,
        geo: { ...headline.geo } as ArticleGeo,
        language,
        keywords: [...(headline.keywords || [])],
        tags: [...(headline.tags || [])],
        tenantId,
        sourceId: headline.source?._id || "", // if source exists else add it to sources
        url: "", // generate article's canonical url
        imageUrl: headline.imageUrl,
        videoUrl: headline.videoUrl,
        content: [],
        analytics: headline.analytics ? { ...headline.analytics } : undefined, // {} as ArticleAnalytics, // Generate Article's analytics
        publishedAt: undefined,
        updatedAt: undefined,
        createdAt: undefined,
        // non db properties. These can be populated on demand
        tenant: undefined,
        source: headline.source ? { ...headline.source } : undefined,
      };

      // Assign Source
      if (article.source)
        article.sourceId = await this.getOrAddSource(article.source);

      // Get Language Name
      const lang = await fetchLanguage(language).catch((err) => {
        this._logger.log(`${language} not found in DB`);
        return null;
      });
      // call AI endpoint
      const prompt = getPrompt(headline, lang?.name || language);
      // this._logger.log(JSON.stringify(prompt, null, "\t"));
      this._logger.log(
        `Getting started Generating content for Prompt for :${language} | ${headline.title}`,
      );
      const aiContent: ArticleContent | null = await generateAIContent(prompt);

      // populate article from aiContent
      article = this.populateArticleWithAiContent(
        article,
        aiContent,
        tenantDomain,
      );
      console.log("AI content populated");
      return article;
    } catch (error: any) {
      this._logger.log("generateArticle() | " + error?.message);
      return null;
    }
  }

  private async generateContents(
    headline: Headline,
    tenantId: string,
    language: string[],
    tenantDomain: string,
  ) {
    for (const l of language) {
      if (!this._progress.isRunning) {
        break;
      }
      const generatedArticle = await this.generateArticle(
        headline,
        tenantId,
        l,
        tenantDomain,
      );

      if (!generatedArticle) {
        this._logger.log(
          `FAILED: Article Generation in language: ${l} and for headline: ${headline?.title}`,
        );
        continue;
      }

      this._logger.log(
        `Article Generated in language: ${l} and for headline: ${headline?.title}`,
      );
      // Save it to DB (Publish)
      const result = await createArticle({
        ...generatedArticle,
        tenant: undefined,
      }).catch((err) => {
        this._logger.log(
          `Saving to DB failed, Article with id: ${generatedArticle.title}, ${err.message}`,
        );
        return null;
      });
      if (result) {
        this._logger.log(
          `Created and saved to DB, Article with id: ${result._id}`,
        );
        // Update progress
        this._progress.articles.push({
          id: result._id || "",
          title: result.title,
          tenantId: result.tenantId,
          language: result.language,
        });
        this.onProgress?.(this._progress);

        // Mark Content generated for current tenant
        await this.updateHeadlineProgress(headline!, undefined, l);
      }
    }

    return;
  }

  private async updateHeadlineProgress(
    headline: Headline,
    tenantId?: string,
    language?: string,
  ) {
    headline.contentGenerated = headline.contentGenerated || {
      tenantId: [],
      language: [],
    };

    if (tenantId) headline.contentGenerated.tenantId.push(tenantId);
    if (language) headline.contentGenerated.language.push(language);

    if (headline._id) {
      await updateHeadline(headline._id, {
        contentGenerated: { ...headline.contentGenerated },
      });
    }
  }

  public async start() {
    this._progress = {
      isRunning: true,
      logs: [],
      headlines: [],
      articles: [],
    };
    this._logger.log("Started");
    let headline: Headline | null = await this.readHeadline();
    this._logger.log(`Headline fetched: ${headline?.title}`);

    while (this._progress.isRunning && headline) {
      // Update progress
      this._progress.headlines.push({
        id: headline._id || "",
        title: headline?.title,
      });
      this.onProgress?.(this._progress);

      // Get tenants eligible for this headline
      const { tenantIds } = headline;
      if (!tenantIds?.length) {
        this._logger.log(`No tenantIds exist for headline`);
      }

      for (const tId of tenantIds || []) {
        const tenant = await fetchTenant(tId);
        if (!this.isTenantElligible(tenant, headline)) {
          this._logger.log(`Tenant ${tId} not elligible`);
          continue;
        }

        const { language } = tenant!;
        await this.generateContents(
          headline!,
          tId,
          language!,
          tenant?.domain || "",
        );
        // Mark Content generated for current tenant
        await this.updateHeadlineProgress(headline!, tId);
        if (!this._progress.isRunning) {
          break;
        }
      }

      // Once all articles for all tenants and languages are generated for a headline,
      // Mark it contentGenerated and read next headline

      await updateHeadline(headline._id!, {
        contentGeneratedAt: new Date(),
      });

      this._logger.log(`Finished - ${headline?.title}`);
      // Read next headline
      this._logger.log(`Reading next headline`);
      headline = await this.readHeadline();
    }

    this.stop();
    this._logger.log(`Finished all headlines`);
  }

  public stop() {
    this._progress.isRunning = false;
    this.onProgress?.(this._progress);
    console.log("Stopped");
  }
}

export const contentEngine = ContentEngine.getInstance();
