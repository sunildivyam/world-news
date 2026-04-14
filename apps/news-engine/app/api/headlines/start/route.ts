/* eslint-disable @typescript-eslint/no-explicit-any */

import { newsBatchEngine } from "@worldnews/shared/server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    newsBatchEngine.start();
    return apiSuccess({ success: true });
  } catch (err: any) {
    return apiError(err);
  }
}
