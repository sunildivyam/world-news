/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateSubscription } from "@worldnews/shared/mongo/subscription";
import { checkRateLimit } from "@worldnews/shared/mongo/rate-limit";
import { success, error } from "@worldnews/shared/mongo/response";
import { getHeadlines } from "@worldnews/shared/mongo/collections/headline";
import { validateApiKey } from "@worldnews/shared/mongo/collections/apiKeys";
import { ApiKey, SuccessResponse } from "@worldnews/shared";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const apiKey =
      url.searchParams.get("apiKey") || req.headers.get("x-api-key");
    const category = url.searchParams.get("category") || undefined;
    const region = url.searchParams.get("region") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");

    if (!apiKey) {
      return error("API_KEY_REQUIRED", 401);
    }

    const keyRes: any = await validateApiKey(apiKey);

    const sub = await validateSubscription(keyRes.data.tenantId);

    const rateLimit = sub?.features?.rateLimitPerMinute || 60;

    const allowed = checkRateLimit(apiKey, rateLimit);

    if (!allowed) {
      return error("RATE_LIMIT_EXCEEDED", 429);
    }

    const skip = (page - 1) * limit;

    const data = await getHeadlines({
      category,
      region,
      limit,
      skip,
    });

    return success(data, {
      page,
      limit,
      count: data.length,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.message === "INVALID_API_KEY") {
      return error("Invalid API key", 401);
    }

    if (err.message === "NO_ACTIVE_SUBSCRIPTION") {
      return error("Subscription required", 403);
    }

    return error("Internal Server Error", 500);
  }
}
