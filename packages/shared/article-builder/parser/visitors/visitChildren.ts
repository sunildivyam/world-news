/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheerioAPI } from "cheerio";
import { Element, AnyNode } from "domhandler";

import { visitElement } from "./visitElement";
import { visitText } from "./visitText";

export function visitChildren($: CheerioAPI, node: Element): any[] {
  const children: any[] = [];

  $(node)
    .contents()
    .each((_, child: AnyNode) => {
      let result: any = null;

      switch (child.type) {
        case "text":
          result = visitText(child);
          break;

        case "tag":
          result = visitElement($, child as Element);
          break;

        default:
          return;
      }

      if (!result) return;

      if (Array.isArray(result)) {
        children.push(...result);
      } else {
        children.push(result);
      }
    });

  return children;
}
