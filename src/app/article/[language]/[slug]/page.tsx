import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { fetchNews } from "@/lib/news-service";
import { supportedLanguages } from "@/lib/languages";
import Header from "@/components/Header";
import RelatedArticles from "@/components/RelatedArticles";

export const runtime = "edge";

interface Props {
  params: {
    language: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: Props) {
  const { language, slug } = await params;

  if (!supportedLanguages.includes(language)) {
    notFound();
  }

  const headerList = await headers();
  const country = headerList.get("x-user-country") || "US";
  const region = headerList.get("x-user-region") || "";
  const city = headerList.get("x-user-city") || "";
  const ip = headerList.get("x-user-ip") || "";

  const data = await fetchNews({
    slug,
    language,
    country,
    region,
    city,
    ip,
  });

  const article = data.articles[0];

  if (!article) {
    notFound();
  }

  const dataRelatedArticles = await fetchNews({
    language,
    country,
    region,
    city,
    ip,
  });

  const relatedArticles = dataRelatedArticles.articles;

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-10">
        <h1 className="max-w-4xl mx-auto text-4xl md:text-5xl font-extrabold leading-tight">
          {article.title}
        </h1>

        <p className="max-w-4xl mx-auto mt-4 text-gray-500">
          {new Date(article.publishedAt).toLocaleDateString()} •{" "}
          {article.publishedBy}
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
        <div className="max-w-4xl mx-auto">
          <RelatedArticles
            initialCursor={dataRelatedArticles.nextCursor}
            articles={relatedArticles}
          />
        </div>
      </main>
    </>
  );
}

// export async function generateMetadata({ params }: Props) {
//   const { language, slug } = await params;

//   console.log("META: ");
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
