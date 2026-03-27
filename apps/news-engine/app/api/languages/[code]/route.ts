/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from "@worldnews/shared";
import {
  deleteLanguage,
  updateLanguage,
} from "@worldnews/shared/mongo/collections/languages";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const code = (await params).code;
    const updates: Partial<Language> = await request.json();

    const result = await updateLanguage(code.toLowerCase(), updates);

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
    const result = await deleteLanguage(code.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
