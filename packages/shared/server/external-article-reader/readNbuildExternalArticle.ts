"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";
import DOMPurify from "isomorphic-dompurify";
import { ApiResponse, ExternalArticle } from "@/types";

export async function readNbuildExternalArticle(
  targetUrl?: string | null,
): Promise<ApiResponse<ExternalArticle>> {
  // 1. Parameter Validation
  if (!targetUrl || typeof targetUrl !== "string") {
    return {
      success: false,
      error: "Missing or invalid URL argument.",
    };
  }

  // Basic URL structure check
  try {
    new URL(targetUrl);
  } catch {
    return {
      success: false,
      error: "Invalid URL provided.",
    };
  }

  try {
    // 2. Fetch raw HTML with standard browser headers
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Cache fetch in Next.js Data Cache for 1 hour
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch target URL. HTTP Status: ${response.status}`,
      };
    }

    const html = await response.text();

    // Suppress JSDOM CSS/CSSOM parsing errors in Node console logs
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", (error) => {
      if (error.message.includes("Could not parse CSS stylesheet")) {
        return; // Ignore CSS parsing errors silently
      }
      console.error(error);
    });

    // 3. Load HTML into Virtual DOM and parse with Readability
    const dom = new JSDOM(html, {
      url: targetUrl,
      virtualConsole,
      // Ensure JSDOM doesn't try to fetch or execute external subresources
      resources: undefined,
      runScripts: "outside-only",
    });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return {
        success: false,
        error: "Unable to extract main article content from the specified URL.",
      };
    }

    // 4. Sanitize HTML output to remove scripts, iframes, and dangerous attributes
    const cleanContent = DOMPurify.sanitize(article.content || "", {
      USE_PROFILES: { html: true },
    });

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
      length: article.length || 0,
      sourceUrl: targetUrl,
      publishedAt: article.publishedTime,
    };

    return {
      success: true,
      data: { ...externalArticle },
    };
  } catch (error) {
    console.error("Server Action Article Fetch Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while parsing the article.",
    };
  }
}
