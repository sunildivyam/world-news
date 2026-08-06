import { parseHtml } from "../parser/parseHtml";
import { ArticleRenderer } from "./ArticleRenderer";

interface RenderArticleBodyProps {
  html: string;
}

export function RenderArticleBody({ html }: RenderArticleBodyProps) {
  const document = parseHtml(html);

  return <ArticleRenderer document={document} />;
}
