import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";
import { QuoteNode, BlockNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseBlockquote($: CheerioAPI, node: Element): QuoteNode {
  return {
    type: "quote",
    children: visitChildren($, node) as BlockNode[],
  };
}
