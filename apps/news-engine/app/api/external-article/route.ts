/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiSuccess, apiError } from "@/lib/api-response";
import { readExternalUrl } from "@worldnews/shared/article-builder/actions/readExternalUrl";
import { urlHtmlToExternalArticle } from "@worldnews/shared/article-builder/actions/urlHtmlToExternalArticle";
export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const ast = searchParams.get("ast");
    if (!url) return apiError({ message: "Url is required", status: 400 });

    const html = await readExternalUrl(url);

    const externalArticle = await urlHtmlToExternalArticle(html, url, !!ast);

    return apiSuccess(externalArticle);
  } catch (err: any) {
    return apiError(err);
  }
}
