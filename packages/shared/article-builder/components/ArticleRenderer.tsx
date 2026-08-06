import { DocumentNode } from "../types";
import { RenderNode } from "./RenderNode";

interface ArticleRendererProps {
  document: DocumentNode;
}

export function ArticleRenderer({ document }: ArticleRendererProps) {
  return (
    <article className="mx-auto max-w-4xl">
      {document.children.map((node, index) => (
        <RenderNode key={node.id ?? index} node={node} />
      ))}
    </article>
  );
}
