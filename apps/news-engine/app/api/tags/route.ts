/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTag,
  findTag,
  findTagByLabel,
  findTags,
} from "@worldnews/shared/mongo/collections/tags";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");

    if (name && label) {
      return await findTag(name.toLowerCase(), label);
    } else if (name) {
      return await findTag(name.toLowerCase());
    } else if (label) {
      return await findTagByLabel(label);
    } else {
      return await findTags();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const tag = await request.json();

    const result = await createTag(tag);
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
