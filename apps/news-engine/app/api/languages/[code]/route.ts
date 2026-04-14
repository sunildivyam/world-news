/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Language } from "@worldnews/shared";
import {
  deleteLanguage,
  updateLanguage,
} from "@worldnews/shared/mongo/collections/languages";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const updates: Partial<Language> = await request.json();

    const result = await updateLanguage(code.toLowerCase(), updates);

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
    const result = await deleteLanguage(code.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
