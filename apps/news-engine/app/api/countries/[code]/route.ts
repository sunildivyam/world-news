/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country } from "@worldnews/shared";
import {
  deleteCountry,
  updateCountry,
} from "@worldnews/shared/mongo/collections/countries";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const updates: Partial<Country> = await request.json();

    const result = await updateCountry(code.toLowerCase(), updates);

    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const result = await deleteCountry(code.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
