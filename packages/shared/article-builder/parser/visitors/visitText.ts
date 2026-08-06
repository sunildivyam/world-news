import { DataNode } from "domhandler";

import { TextNode } from "../../types";
import { cleanText } from "../utils";

export function visitText(node: DataNode): TextNode | null {
  const text = cleanText(node.data);

  if (!text) return null;

  return {
    type: "text",

    text,
  };
}
