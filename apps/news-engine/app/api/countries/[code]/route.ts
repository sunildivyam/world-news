/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiError, apiSuccess } from "@/lib/api-response";
import { Country } from "@worldnews/shared";
import {
  deleteCountry,
  updateCountry,
} from "@worldnews/shared/mongo/collections/countries";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const updates: Partial<Country> = await request.json();

    const result = await updateCountry(code.toLowerCase(), updates);

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const result = await deleteCountry(code.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
