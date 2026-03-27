// lib/news/provider-manager.ts
import { articleProviders } from "@/app-constants/ArticleProviders.constants";
import { AppError } from "@worldnews/shared";
import { ArticleProvider } from "@worldnews/shared";

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
