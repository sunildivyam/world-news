/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from "../../types/Language.interface";
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";
import { AppError } from "../../types";

const moduleError = new AppError("Languages Collection", "");

export function generateLanguage(): string {
  return randomBytes(32).toString("hex");
}

export async function createLanguage(language: Language) {
  if (!language?.code)
    throw moduleError.set("Empty Language can not be created.", 400);

  try {
    const { languages } = await getCollections();

    const result: InsertOneResult = await languages.insertOne(
      toDbFormat(language, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Language", 500);
    }

    return toNormalFormat({ ...language, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateLanguage(code: string, updates: Partial<Language>) {
  if (!code) throw moduleError.set("Empty Language, can not be updated.", 400);
  try {
    const { languages } = await getCollections();
    const result: UpdateResult = await languages.updateOne(
      { code },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update Language", 500);
    }

    return toNormalFormat({ code });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteLanguage(code: string) {
  if (!code) throw moduleError.set("Empty Language, can not be deleted.", 400);
  try {
    const { languages } = await getCollections();
    const result = await languages.deleteOne({ code });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Language", 404);
    }

    return toNormalFormat({ code });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findLanguage(code: string, name?: string) {
  if (!code) throw moduleError.set("Empty Language code", 400);

  try {
    const { languages } = await getCollections();
    const q = name
      ? {
          $or: [
            { code: code.toLowerCase() },
            { name: { $regex: `^${name}`, $options: "i" } },
          ],
        }
      : { code };

    const language = await languages.findOne(q);

    if (!language) {
      throw moduleError.set("Language not found", 404);
    }

    return toNormalFormat(language);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findLanguageByName(name: string) {
  if (!name) throw moduleError.set("Empty Language name", 400);

  try {
    const { languages } = await getCollections();
    const language = await languages.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!language) {
      throw moduleError.set("Language not found", 404);
    }

    return toNormalFormat(language);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findLanguageByCode2(code2: string) {
  if (!code2) throw moduleError.set("Empty Language code2", 400);

  try {
    const { languages } = await getCollections();

    const language = await languages.findOne({
      code2: { $regex: code2, $options: "i" },
    });

    if (!language) {
      throw moduleError.set("Language not found", 404);
    }

    return toNormalFormat(language);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findLanguages() {
  try {
    const { languages } = await getCollections();
    const result = await languages.find<Language>({}).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createLanguages(languages: Language[]) {
  if (!languages?.length)
    throw moduleError.set("Empty languages array can not be created.", 400);

  try {
    const { languages: collection } = await getCollections();

    const result = await collection.insertMany(languages);

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create languages", 500);
    }

    return toNormalFormat(
      languages.map((language, index) => ({
        ...language,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
