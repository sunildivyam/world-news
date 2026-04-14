/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArticleContent } from "../../types";
import { AI_MODELS } from "./ai-models.constants";
import { contentEngineBaseApiUrl } from "./apiUrls";
import { articleContentJsonSchema } from "./content-json-schema";

export async function generateAIContent(
  prompt: string,
): Promise<ArticleContent | null> {
  let retry = 0;

  const url = `${contentEngineBaseApiUrl}/api/generate`;
  console.log(url);
  const body = {
    model: AI_MODELS.GEMMA3,
    prompt,
    format: articleContentJsonSchema,
    stream: false,
  };

  try {
    const content: ArticleContent = await fetchAiContent(url, body);
    const normalizedContent = normalizeAIResponse(content);
    if (normalizedContent) {
      return normalizedContent;
    } else if (retry < 1) {
      // Retry
      retry++;
      console.log("INVALID AI Response, Trying one more time.");
      const content: ArticleContent = await fetchAiContent(url, body);
      const normalizedContent = normalizeAIResponse(content);
      return normalizedContent;
    }

    return null;
  } catch (err: any) {
    console.log(`Failed all retries: ${retry}`);
    retry = 0;
    throw new Error(err);
  }
}

async function fetchAiContent(url: string, body: any) {
  console.log("Generating content - ", url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log(`content fetch failed: ${response.statusText}`);
    console.log(JSON.stringify(body));
    throw new Error(response.statusText);
  }

  const res = await response.json();
  const content: ArticleContent = JSON.parse(res.response);
  console.log(`Content generated- ${url}`);
  return content;
}

function normalizeAIResponse(arr: ArticleContent): ArticleContent | null {
  console.log("Normalizing content");
  if (!Array.isArray(arr)) {
    console.log(`Content not an array`, arr);
    return null;
  }

  const seen: any = {
    title: false,
    summary: false,
    keywords: false,
    tags: false,
  };

  const nArr = arr.filter((item) => {
    if (seen[item.type]) {
      return false;
    }
    if (["title", "summary", "keywords", "tags"].includes(item.type)) {
      seen[item.type] = true;
    }

    return true;
  });

  if (
    nArr.length >= 6 &&
    seen.keywords &&
    seen.summary &&
    seen.tags &&
    seen.title
  ) {
    return nArr;
  }

  return null;
}
