import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseEm($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markItalic);
}

function markItalic(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        italic: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markItalic),
      };

    default:
      return node;
  }
}
