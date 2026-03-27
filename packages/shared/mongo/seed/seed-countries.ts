import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { MongoClient, Db } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const uri = "mongodb://127.0.0.1/worldnews";
const uri = "";
const dbName = "worldnews";
const client = new MongoClient(uri);

let db: Db;

export async function getDB(): Promise<Db> {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      console.log(`${dbName} DB connected`);
    } catch (error) {
      console.log(error);
    }
  }

  return db;
}

export async function seedCountries(): Promise<void> {
  const db = await getDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countries = db.collection<any>("countries");

  const seedDataPath = path.join(
    __dirname,
    "../../seed-data/seed_countries.json",
  );
  const data = fs.readFileSync(seedDataPath, "utf-8");
  const countriesP = JSON.parse(data);

  // Add your database insertion logic here
  console.log(`Seeding ${countriesP.length} countriesP...`);
  const seedResult = await countries.insertMany(countriesP);
  console.log("Seed Final: ", seedResult);
}

const result = await seedCountries().catch((err) => {
  console.log("ERRR: ", err);
});

console.log("Final", result);
