import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

dotenv.config();
const { Access_key, Secret_access_key, Region, table_name } = process.env;
if (!Access_key || !Secret_access_key || !Region || !table_name) {
  throw new Error(
    "Missing required AWS configuration. Please check your .env file"
  );
}
const dbClient = new DynamoDBClient({
  region: Region,
  credentials: {
    accessKeyId: Access_key,
    secretAccessKey: Secret_access_key,
  },
});

const dbDocClient = DynamoDBDocument.from(dbClient);

export { dbDocClient, table_name as tableName };
