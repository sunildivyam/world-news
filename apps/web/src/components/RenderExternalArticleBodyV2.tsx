import { RenderArticleBody } from "@worldnews/shared/article-builder";
import RenderRawHtml from "./RenderRawHtml";
import { fetchExternalArticle } from "@worldnews/shared/news-engine-apis";

interface RenderExternalArticleBodyV2Props {
  url: string;
  toComponents?: boolean;
}

export default async function RenderExternalArticleBodyV2({
  url,
  toComponents = false,
}: RenderExternalArticleBodyV2Props) {
  if (!url) return null;
  let error: any;
  let htmlContent: string | null = null;
  let textContent: string = "";
  try {
    const externalArticle = await fetchExternalArticle(url);
    htmlContent = externalArticle?.content || "";
    textContent = externalArticle?.textContent || "";
  } catch (err) {
    error = err;
  }
  // Read article from external source

  if (!htmlContent) return null;

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error Loading Article</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!toComponents) {
    return <RenderRawHtml html={htmlContent} />;
  }

  return <RenderArticleBody html={htmlContent} />;
}
