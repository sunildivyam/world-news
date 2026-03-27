import { MongoClient, Db } from "mongodb";

const uri = process.env.WORLDNEWS_MONGODB_URI!;
const dbName = process.env.WORLDNEWS_MONGODB_NAME!;
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
