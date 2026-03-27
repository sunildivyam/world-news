# News Engine

Nextjs App that exposes endpoints to serve news articles.

## Steps:

- Database design
- News Engine App
  - Home Page
  - Pricing Page
  - Dashboard
  - Register/Subscribe Page - Allows user to register (Tenant) and subscribe to one of the plan, and perform payment (we will use razorpay as payment gateway).
  - Login Page - Google Sign In / email password (Same while registering user). Tenant or superadmin
  - Forgot password - Reset via email verification
  - /api route
  - API playground page
- API Endpoints


## Database Design

This is the central database for all of the engines ie. News Headline Engine, News Content Engine, News Engine, and Multitenant Web App.

Tables:

- users
- roles
- tenants
- sources
- categories
- articles - articles without content
- article-contents - articles content in multiple languages
- subscription-plans - Each plan will have a set of subscription-items
- subscription-items - Each subscription-item is subscribed feature, its limits, price, (means item definition), all these items would add up to a plan. Items can be like subscribed countries/region/city, language, web app, daily/monthly api limits, daily/monthly webapp limits, etc.
- countries - nested structure to list of countries-> regions -> cities and languages at each nested level. cities may or may not have languages, but regions and countries should have.

## API Endpoints

1. /api/v1/latest

- Query Params:
  - apiKey: identifies the tenantId associated with articles
  - id: if article id is given - only found article in the ArticleCollection (response) will be returned, rest params are ignored.
  - category: list
  - language
  - country
  - region
  - city
  - keywords: list
  - tags: list
  - exclude: list of fields to exclude fro results

- Response: ArticleCollection

```
  interface ArticleCollection {
    articles: Article[];
    totalResults: number;
    nextPage: string | number | null;
  }

  interface Article {
    // metadata fields
    id: string;
    slug: string;
    title: string;
    description: string;
    author: string;
    category: string;
    geo: ArticleGeo;
    language: string;
    keywords: string[];
    tags: string[];
    publishTZ: string;
    publishDate: Date | string;
    updateDate: Date | string;
    // optional fields
    tenant?: Tenant; // Reference to Tenant document
    imageUrl?: string;
    videoUrl?: string;
    content?: ArticleContent; // Reference to ArticleContent document
    source?: ArticleSource;
    orginal?: OriginalArticle;
    // Analytical fields
    analytics?: ArticleAnalytics;
  }

  interface ArticleAnalytics {
    popularity?: number; // 0–100 normalized score
    priority?: number; // editorial / algorithmic priority
    sentiment?: SentimentMetrics;
    engagement?: EngagementMetrics;
    trend?: TrendMetrics;
  }

  interface OriginalArticle {
    id: string;
    title: string;
    description?: string;
    url: string;
    imageUrl?: string;
    videoUrl?: string;
    publishTZ: string;
    publishDate: Date | string;
    author?: string;
    source?: ArticleSource;
    articeProviderName?: string;
  }

  interface ArticleSource {
    id: string;
    name: string;
    description?: string;
    url?: string;
    iconUrl?: string;
    imageUrl?: string;
    category?: string[];
    language?: string[];
    country?: string[];
    priority?: number;
  }

  interface ArticleGeo {
    country?: string;
    region?: string;
    city?: string;
  }
```

## Search Service

- Rules for search:
  - prioriy should be like:
    - language AND country -> region -> city -> category -> tags -> keywords
    - What this means is- language is mandatory, and rest are optional, means
      - if no articles with keywords, look for country -> region -> city -> category -> tags
      - if even no articles with tags, look for country -> region -> city -> category
      - if no articles with category, look for country -> region -> city
      - if no articles with city, look for country -> region
