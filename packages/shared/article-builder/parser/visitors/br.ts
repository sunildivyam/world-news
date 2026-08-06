import { TextNode } from "../../types";

export function parseBr(): TextNode {
  return {
    type: "text",
    text: "\n",
  };
}
