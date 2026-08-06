import { parseHtml } from "../parser/parseHtml";
import { DocumentNode } from "../types";
import { ArticleRenderer } from "./ArticleRenderer";

interface RenderArticleBodyProps {
  html: string | DocumentNode;
  isAst: boolean;
}

export function RenderArticleBody({
  html,
  isAst = false,
}: RenderArticleBodyProps) {
  const document = isAst ? (html as DocumentNode) : parseHtml(html as string);

  return <ArticleRenderer document={document} />;
}
