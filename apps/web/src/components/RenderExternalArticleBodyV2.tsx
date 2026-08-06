import { RenderArticleBody } from "@worldnews/shared/article-builder";
import RenderRawHtml from "./RenderRawHtml";
import { fetchExternalArticle } from "@worldnews/shared/news-engine-apis";
import { DocumentNode } from "@worldnews/shared/article-builder/types";

interface RenderExternalArticleBodyV2Props {
  url: string;
  toComponents?: boolean;
  isAst: boolean;
}

export default async function RenderExternalArticleBodyV2({
  url,
  toComponents = false,
  isAst = false,
}: RenderExternalArticleBodyV2Props) {
  if (!url) return null;
  let error: any;
  let content: string | DocumentNode | null = null;
  try {
    const externalArticle = await fetchExternalArticle(url, isAst);
    content = isAst
      ? externalArticle?.contentAst || ""
      : externalArticle?.content || "";
  } catch (err) {
    error = err;
  }
  // Read article from external source

  if (!content) return null;

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error Loading Article</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!toComponents && !isAst) {
    return <RenderRawHtml html={content as string} />;
  }

  return <RenderArticleBody html={content} isAst={isAst} />;
}
