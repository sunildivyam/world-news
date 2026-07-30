import { fetchArticle, fetchRelatedArticles } from "@/lib/news-service";
import RelatedArticles from "@/components/RelatedArticles";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import { Article } from "@worldnews/shared/types";
import { ArticleCollection } from "@worldnews/shared/types";
import ClientDate from "@/components/ClientDate";
import { UserContext } from "@worldnews/shared/types";
import ArticleSourceLink from "@/components/ArticleSourceLink";
import ArticleBody from "@/components/ArticleBody";
import { decodeIdToObject } from "@worldnews/shared/utils";
import ArticleBodyRaw from "@/components/ArticleBodyRaw";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ArticlePage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  // Deocde the Article's meta from the slug
  let orginalArticle: Article | null = null;
  let isArticleError: boolean = false;
  let article: Article | null = null;
  let articleError: AppError | null = null;

  try {
    orginalArticle = decodeIdToObject(slug);
  } catch (error) {
    orginalArticle = null;
  }

  if (orginalArticle) {
    article = { ...orginalArticle };
  } else {
    // 1. Resolve params (Next.js 15+ requires awaiting params)

    // 2. Fetch primary article data
    const articleRes = await fetchArticle(userContext, slug).catch(
      (err: AppError) => err,
    );
    // Handle Article Errors
    isArticleError = AppError.isError(articleRes);
    article = isArticleError ? null : (articleRes as Article);
    articleError = isArticleError ? (articleRes as AppError) : null;
  }

  // 3. Conditional Fetch for Related Articles
  let relatedArticles = null;
  let relatedArticleError = null;

  const relatedArticleRes = await fetchRelatedArticles(
    userContext,
    article,
  ).catch((err: AppError) => err);

  if (AppError.isError(relatedArticleRes)) {
    relatedArticleError = relatedArticleRes as AppError;
  } else {
    relatedArticles = relatedArticleRes as ArticleCollection;
  }

  return (
    <>
      <main className="max-w-full mx-auto px-0 py-10">
        {/* Error Handling for Article */}
        {isArticleError && (
          <SectionError error={articleError || undefined} isSilent={true} />
        )}

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
              {orginalArticle && (
                <Suspense key={article.url} fallback={<ReaderSkeleton />}>
                  <ArticleBodyRaw url={article.url || ""} toComponents={true} />
                </Suspense>
              )}

              {!orginalArticle && (
                <ArticleBody
                  content={[
                    { type: "p", value: article.description },
                    ...(article.content || []),
                  ]}
                />
              )}
            </div>
          </article>
        )}

        {/* Error Handling for Related Articles */}
        {relatedArticleError && (
          <SectionError error={relatedArticleError} isSilent={true} />
        )}

        {relatedArticles && (
          <div className="max-w-full mx-auto px-1 md:px-4 py-8">
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

// Loading Skeleton UI for smooth UX
function ReaderSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-background rounded-lg border space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
