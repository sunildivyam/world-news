import { ExternalArticle } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchExternalArticle(
  externalUrl: string,
  isAst: boolean,
): Promise<ExternalArticle | null> {
  let query = `url=${externalUrl}`;
  query += isAst ? `&ast=true` : "";

  const url = `${newsEngineBaseApiUrl}/api/external-article?${query}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: ExternalArticle = await response.json();
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err);
  }
}
