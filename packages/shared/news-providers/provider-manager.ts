// lib/news/provider-manager.ts
import { AppError, ArticleProvider } from "../types";

function hasRateLimitReached(res: any): boolean {
  if (
    AppError.isError(res) &&
    (res.status === 429 ||
      res.status === 403 ||
      res.status === "ApiLimitExceeded")
  ) {
    return true;
  }

  return false;
}

export async function executeWithFailover<T>(
  operation: (provider: ArticleProvider) => Promise<T>,
  articleProviders: ArticleProvider[],
): Promise<T> {
  let lastError: AppError = new AppError("", "");

  for (const provider of articleProviders) {
    try {
      console.log(`Trying provider: ${provider.name}`);
      const result = await operation(provider);
      if (!hasRateLimitReached(result)) {
        console.log(`Provider ${provider.name} succeeded`);
        return result;
      } else {
        lastError = { ...(result as AppError) };
        console.log(
          `Provider ${provider.name} failed. Moving to next.`,
          (result as AppError).message,
        );
      }
    } catch (error: any) {
      console.log(`Provider ${provider.name} failed. Moving to next.`, error);
      lastError = {
        source: "Provider Manager",
        message: error.message,
        status: error.status,
      };
    }
  }

  return lastError as T;
}
