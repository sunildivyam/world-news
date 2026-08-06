import { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseCode($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markCode);
}

function markCode(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        code: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markCode),
      };

    default:
      return node;
  }
}
