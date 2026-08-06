import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";
import { TableNode, TableRowNode, TableCellNode, BlockNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseTable($: CheerioAPI, node: Element): TableNode {
  const rows: TableRowNode[] = [];

  $(node)
    .find("tr")
    .each((_, tr) => {
      const cells: TableCellNode[] = [];

      $(tr)
        .children("th, td")
        .each((_, cell) => {
          const tag = cell.tagName.toLowerCase();

          cells.push({
            type: "table-cell",
            header: tag === "th",
            children: visitChildren($, cell) as BlockNode[],
          });
        });

      rows.push({
        type: "table-row",
        children: cells,
      });
    });

  return {
    type: "table",
    children: rows,
  };
}
