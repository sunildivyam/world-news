// lib/news/provider-manager.ts

import { NewsProvider } from "./provider.interface";
import { NewsdataProvider } from "./providers/newsdata.provider";
import { NewsapiorgProvider } from "./providers/newsapiorg.provider";
import { AppError } from "@/types/AppError";

const providers: NewsProvider[] = [
  new NewsdataProvider(),
  new NewsapiorgProvider(),
];

function hasRateLimitReached(res: any): boolean {
  if (AppError.isError(res) && res.status === 429) {
    return true;
  }
  return false;
}

export async function executeWithFailover<T>(
  operation: (provider: NewsProvider) => Promise<T>,
): Promise<T> {
  let lastError: AppError = new AppError("", "", "");

  for (const provider of providers) {
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
        code: error.code,
        message: error.message,
        status: error.status,
      };
    }
  }

  return lastError as T;
}
