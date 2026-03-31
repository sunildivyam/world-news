/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsBatch,
  createNewsBatches,
  findNewsBatch,
  getAllNewsBatches,
} from "@worldnews/shared/mongo/collections/newsBatches";
import { error } from "@worldnews/shared/mongo/response";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      return await findNewsBatch(id);
    } else {
      return await getAllNewsBatches();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createNewsBatches(body);
      return result;
    } else {
      // Single news batch insert
      const result = await createNewsBatch(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
