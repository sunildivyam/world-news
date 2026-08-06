"use server";

import { ExternalArticle } from "../../types";
// import { parseHtml as parseHtmlAct } from "../parser";

export async function urlHtmlToExternalArticle(
  html: string,
  url: string,
): Promise<ExternalArticle> {
  const errorStage: string[] = [];

  // 1. Parameter Validation
  if (!html) {
    throw new Error("Html content is empty.");
  }

  if (!url) {
    throw new Error("Url to external article is required");
  }

  try {
    // Dynamic Import
    errorStage.push("linkedom");
    const { parseHTML } = await import("linkedom");
    errorStage.push("linkedom imported");
    // 3. Load HTML into Virtual DOM and parse with Readability
    const { document } = parseHTML(html);
    errorStage.push("parsed with linkedom");
    // Note: Linkedom does not fetch subresources or execute scripts by default.
    // To handle relative image/hyperlink paths correctly like JSDOM's `url:` option,
    // we manually assign the baseURI to the document.
    Object.defineProperty(document, "baseURI", { value: url });

    // Dynamic Import
    errorStage.push("Readability");
    const { Readability } = await import("@mozilla/readability");
    errorStage.push("Readability imported");
    const reader = new Readability(document);
    errorStage.push("Readability instance created");
    const article = reader.parse();
    errorStage.push("Readability parsed");

    if (!article) {
      throw new Error(
        "Unable to extract main article content from the specified URL's html.",
      );
    }

    // Dynamic Import
    errorStage.push("isomorphic-dompurify");
    const DOMPurify = await import("isomorphic-dompurify");
    errorStage.push("isomorphic-dompurify imported");

    // 4. Sanitize HTML output to remove scripts, iframes, and dangerous attributes
    const cleanContent = DOMPurify.sanitize(article.content || "", {
      USE_PROFILES: { html: true },
    });
    errorStage.push("isomorphic-dompurify sanitized");
    // const contentAst = parseHtmlAct(cleanContent);

    // 5. Return Structured Plain JS Object
    const externalArticle: ExternalArticle = {
      title: article.title || "",
      byline: article.byline || null,
      dir: article.dir || null,
      lang: article.lang || null,
      excerpt: article.excerpt || null,
      siteName: article.siteName || null,
      content: cleanContent,
      textContent: (article.textContent || "").trim(),
      // contentAst,
      length: article.length || 0,
      sourceUrl: url,
      publishedAt: article.publishedTime,
    };
    errorStage.push("Final Done");
    return externalArticle;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(errorStage.join("=>") + error.message);
  }
}
