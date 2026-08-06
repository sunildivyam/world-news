import { DocumentNode, ArticleNode, ParagraphNode } from "../types";

export function normalizeDocument(document: DocumentNode): DocumentNode {
  return {
    ...document,
    children: normalizeNodes(document.children),
  };
}

function normalizeNodes<T>(nodes: T[]): T[] {
  const result: ArticleNode[] = [];

  for (const node of nodes) {
    const normalized = normalizeNode(node as ArticleNode);

    if (!normalized) continue;

    if (Array.isArray(normalized)) {
      result.push(...normalized);
    } else {
      result.push(normalized);
    }
  }

  return result as T[];
}

function normalizeNode(node: ArticleNode): ArticleNode | ArticleNode[] | null {
  switch (node.type) {
    case "paragraph":
      return normalizeParagraph(node);

    case "heading":
      node.children = node.children.filter(isNotEmptyText);
      return node;

    case "quote":
      node.children = normalizeNodes(node.children);
      return node;

    case "list":
      node.children = node.children.map((item) => ({
        ...item,
        children: normalizeNodes(item.children),
      }));
      return node;

    case "table":
      node.children = node.children.map((row) => ({
        ...row,
        children: row.children.map((cell) => ({
          ...cell,
          children: normalizeNodes(cell.children),
        })),
      }));
      return node;

    default:
      return node;
  }
}

function normalizeParagraph(node: ParagraphNode): ParagraphNode | null {
  node.children = mergeAdjacentTextNodes(node.children.filter(isNotEmptyText));

  if (node.children.length === 0) {
    return null;
  }

  return node;
}

function mergeAdjacentTextNodes(
  nodes: ParagraphNode["children"],
): ParagraphNode["children"] {
  const result: ParagraphNode["children"] = [];

  for (const node of nodes) {
    const previous = result[result.length - 1];

    if (
      previous?.type === "text" &&
      node.type === "text" &&
      previous.bold === node.bold &&
      previous.italic === node.italic &&
      previous.underline === node.underline &&
      previous.strike === node.strike &&
      previous.code === node.code &&
      previous.subscript === node.subscript &&
      previous.superscript === node.superscript
    ) {
      previous.text += node.text;
      continue;
    }

    result.push(node);
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNotEmptyText(node: any): boolean {
  if (node.type !== "text") {
    return true;
  }

  return node.text.trim().length > 0;
}
