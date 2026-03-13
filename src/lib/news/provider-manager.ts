// lib/news/provider-manager.ts
import { articleProviders } from "@/app-constants/ArticleProviders.constants";
import { AppError } from "@/types/AppError.class";
import { ArticleProvider } from "@/types/ArticleProvider.interface";

function hasRateLimitReached(res: any): boolean {
  if (AppError.isError(res) && res.status === 429) {
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
      console.log(`Provider ${provider.name} succeeded`);
      if (!hasRateLimitReached(result)) {
        return result;
      } else {
        lastError = { ...(result as AppError) };
        console.error(
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
