/* eslint-disable @typescript-eslint/no-explicit-any */
import { listIndexes, createIndexes } from "@worldnews/shared/mongo/indexes";
import { apiError, apiSuccess } from "@/lib/api-response";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const result = await listIndexes();
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const result = await createIndexes();

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
