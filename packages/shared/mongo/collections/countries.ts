/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, City, Country } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("Countries Collection", "");

function addLanguage(code: string, languages: string[]) {
  return languages?.includes(code) ? [...languages] : [...languages, code];
}

export async function createCountry(country: Country): Promise<Country> {
  if (!country?.code)
    throw moduleError.set("Can not create an empty country", 400);

  try {
    const { countries } = await getCollections();

    const result: InsertOneResult = await countries.insertOne(
      toDbFormat(country, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create country", 500);
    }

    return toNormalFormat({ ...country, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function getAllCountries(
  codes?: string[],
): Promise<Partial<Country>[]> {
  try {
    const { countries } = await getCollections();
    let filter = {};
    if (codes?.length) {
      filter = { code: { $in: codes } };
    }

    const result = await countries
      .find(filter)
      // .project({ _id: 1, code: 1, name: 1, languages: 1 })
      .toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateCountry(id: string, country: Partial<Country>) {
  try {
    const { countries } = await getCollections();
    // Clean the object
    country = toDbFormat(country, true);
    const result = await countries.updateOne(
      { _id: new ObjectId(id) },
      { $set: country },
    );

    if (result.matchedCount === 0) {
      throw moduleError.set("Country not found", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteCountry(id: string) {
  try {
    const { countries } = await getCollections();
    const result = await countries.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw moduleError.set("Country not found", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateCountryByGeo(
  countryCode: string = "",
  regionCode: string = "",
  cityCode: string = "",
  languageCode: string = "",
) {
  try {
    const { countries } = await getCollections();

    const country = await countries.findOne({ code: countryCode });

    if (!country) {
      const newCountry: Country = {
        code: countryCode,
        name: countryCode,
        regions: regionCode
          ? [
              {
                code: regionCode,
                name: regionCode,
                languages: languageCode ? [languageCode] : [],
                cities: cityCode
                  ? [
                      {
                        code: cityCode,
                        name: cityCode,
                        languages: languageCode ? [languageCode] : [],
                      },
                    ]
                  : [],
              },
            ]
          : [],
        languages: languageCode ? [languageCode] : [],
      };

      return createCountry(newCountry);
    }

    const updateData: any = {};

    if (regionCode) {
      const regionExists = country.regions?.some(
        (r: any) => r.code === regionCode,
      );
      if (!regionExists) {
        updateData.regions = [
          ...(country.regions || []),
          {
            code: regionCode,
            name: regionCode,
            languages: languageCode ? [languageCode] : [],
            cities: cityCode
              ? [
                  {
                    code: cityCode,
                    name: cityCode,
                    languages: languageCode ? [languageCode] : [],
                  },
                ]
              : [],
          },
        ];
      } else if (cityCode) {
        updateData.regions = country.regions.map((r: any) =>
          r.code === regionCode
            ? {
                ...r,
                languages: addLanguage(languageCode, r.languages),
                cities: r.cities?.find((c: City) => c.code === cityCode)
                  ? [
                      ...r.cities.map((c: City) =>
                        c.code === cityCode
                          ? {
                              ...c,
                              languages: addLanguage(languageCode, c.languages),
                            }
                          : c,
                      ),
                    ]
                  : [
                      ...r.cities,
                      {
                        code: cityCode,
                        name: cityCode,
                        languages: languageCode ? [languageCode] : [],
                      },
                    ],
              }
            : r,
        );
      }
    }

    if (languageCode) {
      const langExists = country.languages?.find(
        (l: string) => l === languageCode,
      );
      if (!langExists) {
        updateData.languages = [...(country.languages || []), languageCode];
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.log("Nothing to update in geo.");
      throw moduleError.set("Nothing to update in country.", 500);
    }

    return updateCountry(countryCode, updateData);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCountryById(id: string) {
  try {
    const { countries } = await getCollections();

    const q = { _id: new ObjectId(id) };

    const country = await countries.findOne(q);

    if (!country) {
      throw moduleError.set("Country not found", 404);
    }

    return toNormalFormat(country);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCountry(code: string, name?: string) {
  try {
    const { countries } = await getCollections();

    const q = name
      ? {
          $or: [
            { code: code.toLowerCase() },
            { name: { $regex: `^${name}`, $options: "i" } },
          ],
        }
      : { code: code.toLowerCase() };

    const country = await countries.findOne(q);

    if (!country) {
      throw moduleError.set("Country not found", 404);
    }

    return toNormalFormat(country);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCountryByName(name: string) {
  try {
    const { countries } = await getCollections();
    const country = await countries.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!country) {
      throw moduleError.set("Country not found", 404);
    }

    return toNormalFormat(country);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createCountries(countries: Country[]) {
  if (!countries?.length)
    throw moduleError.set("Empty countries array can not be created.", 400);

  try {
    const { countries: collection } = await getCollections();
    countries = toDbFormat(countries, true);
    const result = await collection.insertMany(countries, { ordered: false }); // ordered: false ignores duplicates

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create countries", 500);
    }

    return toNormalFormat(
      countries.map((country, index) => ({
        ...country,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
