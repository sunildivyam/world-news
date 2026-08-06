import { readNbuildExternalArticle } from "@worldnews/shared/server/external-article-reader/readNbuildExternalArticle";
import RenderHtmlToReactDom from "./RenderHtmlToReactDom";
import RenderRawHtml from "./RenderRawHtml";

interface RenderExternalArticleBodyV1Props {
  url: string;
  toComponents?: boolean;
}

export default async function RenderExternalArticleBodyV1({
  url,
  toComponents = false,
}: RenderExternalArticleBodyV1Props) {
  if (!url) return null;
  let error: any;
  let htmlContent: string | null = null;
  let textContent: string = "";
  try {
    const externalArticleRes = await readNbuildExternalArticle(url);
    htmlContent = externalArticleRes?.data?.content || "";
    textContent = externalArticleRes?.data?.textContent || "";
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

  return <RenderHtmlToReactDom html={htmlContent} />;
}
