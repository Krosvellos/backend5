
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

describe("Shopping List uuCMD tests", () => {
  let client;
  let collection;

  beforeAll(async () => {
    // Connect to the MongoDB instance and create a connection
    client = await MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true });
    const db = client.db("TestDatabase"); 
    collection = db.collection("shoppingLists"); 
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests are done
    await client.close();
  });

  test("deleteList", async () => {
    
    const newList = {
      name: "Westfall Stew",
      ownerId: null,
      awid: "22222222222222222222222222222222",
      archived: false,
      sys: { rev: 0 },
      items: [],
      authorizedUsers: [{ userID: null }],
      visibility: false,
      uuIdentity: null,
      uuAppErrorMap: {}
    };

    // Insert the mock shopping list into the collection
    const insertResult = await collection.insertOne(newList);

    // Retrieve the created list's _id from the insert operation
    const createdListId = insertResult.insertedId;

    // Perform the delete operation to delete the created shopping list from the mock collection
    await collection.deleteOne({ _id: createdListId });

    // Retrieve the deleted shopping list to check if it exists after deletion
    const deletedList = await collection.findOne({ _id: createdListId });

    console.log("Deleted List:", deletedList);
    expect(deletedList).toBeNull(); // Ensure the deleted list doesn't exist in the collection

    expect(newList.uuAppErrorMap).toEqual({});
  });
  test("deleteShoppingList with non-existent ID", async () => {
    const nonExistentId = "non-existent-id";

    const deleteResult = await collection.deleteOne({ _id: nonExistentId });

    expect(deleteResult.deletedCount).toBe(0); // Ensure that no documents were deleted
  });
});
