import { dbDocClient, tableName } from "../Config/DB.js";

async function storeInDataBase(items) {
  try {
    const batchWriteParams = {
      RequestItems: {
        [tableName]: items.map((item) => ({
          PutRequest: {
            Item: {
              trackId: item.trackId.toString(),
              data: item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        })),
      },
    };

    const result = await dbDocClient.batchWrite(batchWriteParams);

    console.log("Items stored successfully");
    return result;
  } catch (error) {
    console.error("Database storage error:", error);
    throw error;
  }
}
export { storeInDataBase };
