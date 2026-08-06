import { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseSub($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markSubscript);
}

function markSubscript(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        subscript: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markSubscript),
      };

    default:
      return node;
  }
}
