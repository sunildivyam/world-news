/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsBatch,
  createNewsBatches,
  findNewsBatch,
  getActiveNewsBatches,
  getAllNewsBatches,
} from "@worldnews/shared/mongo/collections/newsBatches";
import { apiSuccess, apiError } from "@/lib/api-response";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const active = searchParams.get("active");

    let result;
    if (id) {
      result = await findNewsBatch(id);
    } else if (active === "true") {
      result = await getActiveNewsBatches();
    } else {
      result = await getAllNewsBatches();
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createNewsBatches(body);
      return apiSuccess(result);
    } else {
      // Single news batch insert
      const result = await createNewsBatch(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
