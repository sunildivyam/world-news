/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import { ListNode, ListItemNode, BlockNode, ParagraphNode } from "../../types";

import { visitChildren } from "./visitChildren";

export function parseList($: CheerioAPI, node: Element): ListNode {
  const ordered = node.tagName === "ol";

  const items: ListItemNode[] = [];

  $(node)
    .children("li")
    .each((_, li) => {
      const children = visitChildren($, li);

      items.push({
        type: "list-item",

        children: normalizeListItem(children),
      });
    });

  return {
    type: "list",

    ordered,

    children: items,
  };
}

function normalizeListItem(children: any[]): BlockNode[] {
  const result: BlockNode[] = [];

  let paragraphChildren: any[] = [];

  for (const child of children) {
    switch (child.type) {
      case "text":
        paragraphChildren.push(child);
        break;

      case "link":

      case "image":
        paragraphChildren.push(child);
        break;

      default:
        if (paragraphChildren.length) {
          result.push({
            type: "paragraph",

            children: paragraphChildren,
          } as ParagraphNode);

          paragraphChildren = [];
        }

        result.push(child);
    }
  }

  if (paragraphChildren.length) {
    result.push({
      type: "paragraph",

      children: paragraphChildren,
    } as ParagraphNode);
  }

  return result;
}
