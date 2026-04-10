import { fetchArticle, fetchRelatedArticles } from "@/lib/news-service";
import RelatedArticles from "@/components/RelatedArticles";
import { SectionError } from "@/components/SectionError";
import { AppError, ArticleContent } from "@worldnews/shared/types";
import { Article } from "@worldnews/shared/types";
import { ArticleCollection } from "@worldnews/shared/types";
import ClientDate from "@/components/ClientDate";
import { UserContext } from "@worldnews/shared/types";
import ArticleSourceLink from "@/components/ArticleSourceLink";
import ArticleBody from "@/components/ArticleBody";

export default async function ArticlePage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  // 1. Resolve params (Next.js 15+ requires awaiting params)

  // 2. Fetch primary article data
  const articleRes = await fetchArticle(userContext, slug);

  // Handle Article Errors
  const isArticleError = AppError.isError(articleRes);
  const article = isArticleError ? null : (articleRes as Article);
  const articleError = isArticleError ? (articleRes as AppError) : null;

  // 3. Conditional Fetch for Related Articles
  let relatedArticles = null;
  let relatedArticleError = null;

  const relatedArticleRes = await fetchRelatedArticles(userContext, article);

  if (AppError.isError(relatedArticleRes)) {
    relatedArticleError = relatedArticleRes as AppError;
  } else {
    relatedArticles = relatedArticleRes as ArticleCollection;
  }

  return (
    <>
      <main className="max-w-full mx-auto px-0 py-10">
        {/* Error Handling for Article */}
        {isArticleError && <SectionError error={articleError || undefined} />}

        {article && !isArticleError && (
          <article className="relative max-w-full mx-auto">
            <h1 className="max-w-4xl mx-auto text-4xl md:text-5xl font-extrabold leading-tight px-2">
              {article.title}
            </h1>

            <p className="max-w-4xl mx-auto mt-4 text-gray-500 flex gap-4 px-2">
              {article.publishedAt && (
                <ClientDate dateString={article.publishedAt.toString()} />
              )}{" "}
              • <ArticleSourceLink source={article.source} />
            </p>

            <div className="max-w-full mt-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full"
              />
            </div>

            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert mt-10 text-gray-800 leading-relaxed px-2">
              <ArticleBody
                content={[
                  { type: "p", value: article.description },
                  ...(article.content || []),
                ]}
              />
            </div>
          </article>
        )}

        {/* Error Handling for Related Articles */}
        {relatedArticleError && <SectionError error={relatedArticleError} />}

        {relatedArticles && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <RelatedArticles
              initialCursor={relatedArticles.nextPage as string}
              articles={relatedArticles.articles}
            />
          </div>
        )}
      </main>
    </>
  );
}
