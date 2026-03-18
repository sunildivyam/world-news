import { fetchArticle, fetchRelatedArticles } from "@/lib/news-service";
import Header from "@/components/Header";
import RelatedArticles from "@/components/RelatedArticles";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@/types/AppError.class";
import { Article } from "@/types/Article.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import ClientDate from "@/components/ClientDate";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import ArticleSourceLink from "@/components/ArticleSourceLink";

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
          <>
            <h1 className="max-w-4xl mx-auto text-4xl md:text-5xl font-extrabold leading-tight">
              {article.title}
            </h1>

            <p className="max-w-4xl mx-auto mt-4 text-gray-500 flex gap-4">
              <ClientDate dateString={article.publishDate.toString()} /> •{" "}
              <ArticleSourceLink source={article.source} />
            </p>

            <div className="max-w-full mt-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full rounded-xl"
              />
            </div>

            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert mt-10">
              <p>{article.description}</p>
            </div>
          </>
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

// export async function generateMetadata({ params }: Props) {
//   const { language, slug } = await params;

//   const data = await fetchNews({
//     slug,
//     language,
//     country: "US",
//     region: "",
//     city: "",
//     ip: "",
//   });

//   const article = data.articles[0];

//   if (!article) {
//     return {};
//   }

//   return {
//     title: article.seo.title || article.title,
//     description: article.seo.description || article.description,
//     alternates: {
//       canonical: `/article/${language}/${slug}`,
//     },
//   };
// }
