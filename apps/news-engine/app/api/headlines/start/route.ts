/* eslint-disable @typescript-eslint/no-explicit-any */

import { newsBatchEngine } from "@worldnews/shared/server";
import { error, success } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    newsBatchEngine.start();
    return success({ success: true });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
