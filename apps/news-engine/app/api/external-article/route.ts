/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiSuccess, apiError } from "@/lib/api-response";
import { readExternalUrl } from "@worldnews/shared/article-builder/actions/readExternalUrl";
import { urlHtmlToExternalArticle } from "@worldnews/shared/article-builder/actions/urlHtmlToExternalArticle";
export const revalidate = 120;
export async function GET(request: Request) {
  const errorStage: string[] = [];
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) return apiError({ message: "Url is required", status: 400 });
    errorStage.push("readExternalUrl");
    const html = await readExternalUrl(url);
    errorStage.push("urlHtmlToExternalArticle");
    const externalArticle = await urlHtmlToExternalArticle(html, url);

    return apiSuccess(externalArticle);
  } catch (err: any) {
    const str = errorStage.join("=>");
    console.log(str + err.message);
    err.message = "My Error: " + str + err.message;
    return apiError(err);
  }
}
