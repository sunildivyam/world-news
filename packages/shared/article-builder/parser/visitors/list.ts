import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { ListNode, ListItemNode, BlockNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseList($: CheerioAPI, node: Element): ListNode {
  const ordered = node.tagName.toLowerCase() === "ol";

  const children: ListItemNode[] = [];

  $(node)
    .children("li")
    .each((_, li) => {
      children.push({
        type: "list-item",
        children: visitChildren($, li) as BlockNode[],
      });
    });

  return {
    type: "list",
    ordered,
    children,
  };
}
