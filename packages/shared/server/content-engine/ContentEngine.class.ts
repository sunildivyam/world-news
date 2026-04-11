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

export class ContentEngine {
  headline: Headline | null = null;
  cancel: boolean = false;
  private progress: ContentEngineProgress = {
    logs: [],
    headlines: [],
    articles: [],
  };

  onProgress?: (data: ContentEngineProgress) => void;

  private static instance: ContentEngine;

  constructor() {}

  static getInstance(): ContentEngine {
    if (!ContentEngine.instance) {
      ContentEngine.instance = new ContentEngine();
    }
    return ContentEngine.instance;
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
    const source = await fetchArticleSource(articleSource.slug);
    if (source) {
      return source._id!;
    }

    const result = await createArticleSource(articleSource);
    return result._id!;
  }

  private async generateArticle(
    headline: Headline,
    tenantId: string,
    language: string,
    tenantDomain: string,
  ): Promise<Article | null> {
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
    if (article.source) article.sourceId = await this.getOrAddSource(article.source);

    // Get Language Name
    const lang = await fetchLanguage(language);
    // call AI endpoint
    const prompt = getPrompt(headline, lang?.name || language);
    this.log(JSON.stringify(prompt, null, "\t"));
    const aiContent: ArticleContent | null = await generateAIContent(prompt);

    // populate article from aiContent

    article = this.populateArticleWithAiContent(
      article,
      aiContent,
      tenantDomain,
    );

    return article;
  }

  private async generateContents(
    headline: Headline,
    tenantId: string,
    language: string[],
    tenantDomain: string,
  ) {
    for (const l of language) {
      const generatedArticle = await this.generateArticle(
        headline,
        tenantId,
        l,
        tenantDomain,
      );
      if (!generatedArticle) {
        this.log(
          `FAILED: Article Generation in language: ${l} and for headline: ${headline?.title}`,
        );
        continue;
      }

      this.log(
        `Article Generated in language: ${l} and for headline: ${headline?.title}`,
      );
      // Save it to DB (Publish)
      const result = await createArticle({
        ...generatedArticle,
        tenant: undefined,
        source: undefined,
      });

      this.log(`Created and saved to DB, Article with id: ${result._id}`);
      // Update progress
      this.progress.articles.push({
        id: result._id || "",
        title: result.title,
        tenantId: result.tenantId,
        language: result.language,
      });
      this.onProgress?.(this.progress);

      // Mark Content generated for current tenant
      await this.updateHeadlineProgress(headline!, undefined, l);
    }
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

  private log(str: string) {
    this.progress.logs.push(str);
    this.onProgress?.(this.progress);
  }

  public async start() {
    this.cancel = false;
    this.progress = {
      logs: [],
      headlines: [],
      articles: [],
    };
    this.log("Started");
    let headline: Headline | null = await this.readHeadline();
    this.log(`Headline fetched: ${headline?.title}`);
    while (!this.cancel && headline) {
      // Update progress
      this.progress.headlines.push({
        id: headline._id || "",
        title: headline?.title,
      });
      this.onProgress?.(this.progress);

      // Get tenants eligible for this headline
      const { tenantIds } = headline;
      if (!tenantIds?.length) {
        this.log(`No tenantIds exist for headline`);
      }

      for (const tId of tenantIds || []) {
        const tenant = await fetchTenant(tId);
        if (!this.isTenantElligible(tenant, headline)) {
          this.log(`Tenant ${tId} not elligible`);
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
      }

      // Once all articles for all tenants and languages are generated for a headline,
      // Mark it contentGenerated and read next headline
      console.log(headline._id!);
      const uResult = await updateHeadline(headline._id!, {
        contentGeneratedAt: new Date(),
      });
      console.log(uResult);
      // Read next headline
      headline = await this.readHeadline();
      this.log(`Finished`);
    }
  }

  public stop() {
    this.cancel = true;
    this.onProgress?.(this.progress);
  }
}

export const contentEngine = ContentEngine.getInstance();
