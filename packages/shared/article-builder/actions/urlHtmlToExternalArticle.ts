"use server";

import { ExternalArticle } from "../../types";
import { parseHtml as parseHtmlAct } from "../parser";
import { DocumentNode } from "../types";

export async function urlHtmlToExternalArticle(
  html: string,
  url: string,
  isAst: boolean = false,
): Promise<ExternalArticle> {
  // 1. Parameter Validation
  if (!html) {
    throw new Error("Html content is empty.");
  }

  if (!url) {
    throw new Error("Url to external article is required");
  }

  try {
    // Dynamic Import
    const { parseHTML } = await import("linkedom");
    // 3. Load HTML into Virtual DOM and parse with Readability
    const { document } = parseHTML(html);
    // Note: Linkedom does not fetch subresources or execute scripts by default.
    // To handle relative image/hyperlink paths correctly like JSDOM's `url:` option,
    // we manually assign the baseURI to the document.
    Object.defineProperty(document, "baseURI", { value: url });

    // Dynamic Import
    const { Readability } = await import("@mozilla/readability");
    const reader = new Readability(document);
    const article = reader.parse();

    if (!article) {
      throw new Error(
        "Unable to extract main article content from the specified URL's html.",
      );
    }

    const sanitizeHtml = await import("sanitize-html");

    const cleanContent = sanitizeHtml.default(article.content || "", {
      // allowedTags: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br"],
      // allowedAttributes: {
      //   a: ["href", "target"],
      // },
    });

    let contentAst: DocumentNode | undefined = undefined;
    if (isAst) {
      contentAst = parseHtmlAct(cleanContent);
    }

    // 5. Return Structured Plain JS Object
    const externalArticle: ExternalArticle = {
      title: article.title || "",
      byline: article.byline || null,
      dir: article.dir || null,
      lang: article.lang || null,
      excerpt: article.excerpt || null,
      siteName: article.siteName || null,
      content: !isAst ? cleanContent : "",
      textContent: !isAst ? (article.textContent || "").trim() : "",
      contentAst: isAst ? contentAst : undefined,
      length: article.length || 0,
      sourceUrl: url,
      publishedAt: article.publishedTime,
    };
    return externalArticle;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
}
