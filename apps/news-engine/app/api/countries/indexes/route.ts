/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  listCountriesIndices,
  createCountriesIndices,
} from "@worldnews/shared/mongo/collections/countries";
import { apiError, apiSuccess } from "@/lib/api-response";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const result = await listCountriesIndices();
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const result = await createCountriesIndices();

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
