/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const lastError: AppError = new AppError("Provider Manager", "");

  for (const provider of articleProviders) {
    try {
      console.log(`Trying provider: ${provider.name}`);

      const result = await operation(provider);

      return result;
    } catch (error: any) {
      lastError.set(error.message, error.status);
      if (hasRateLimitReached(error)) {
        console.log(
          `Provider ${provider.name} failed. Moving to next.`,
          error.message,
        );
      } else {
        console.log(
          `Provider ${provider.name} failed. Rate limit not hit, but soemthing went wrong. So Exiting`,
          error,
        );
        throw lastError;
      }
    }
  }

  throw lastError;
}
