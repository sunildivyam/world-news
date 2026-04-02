/* eslint-disable @typescript-eslint/no-explicit-any */

import { newsBatchEngine } from "@worldnews/shared/server";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const result = await newsBatchEngine.start();
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
