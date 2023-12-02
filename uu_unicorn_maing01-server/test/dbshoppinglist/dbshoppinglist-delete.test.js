// MongoDB related imports
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

describe("Shopping List uuCMD tests", () => {
  let client;
  let collection;

  beforeAll(async () => {
    // Connect to the MongoDB instance and create a connection
    client = await MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true });
    const db = client.db("TestDatabase"); // Replace 'yourDatabaseName' with your actual database name
    collection = db.collection("shoppingLists"); // Replace 'shoppingLists' with your collection name
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests are done
    await client.close();
  });

  test("deleteList", async () => {
    // Create a mock shopping list
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
    // Check the expected outcomes
    expect(deletedList).toBeNull(); // Ensure the deleted list doesn't exist in the collection
    // Add further assertions as needed based on your specific response

    // Check if the uuAppErrorMap is empty after deletion
    expect(newList.uuAppErrorMap).toEqual({});
  });
  test("deleteShoppingList with non-existent ID", async () => {
    // Define a non-existent ID for deletion
    const nonExistentId = "non-existent-id";

    // Simulate attempting to delete a shopping list with a non-existent ID
    const deleteResult = await collection.deleteOne({ _id: nonExistentId });

    // Check the expected outcomes when attempting to delete with non-existent ID
    expect(deleteResult.deletedCount).toBe(0); // Ensure that no documents were deleted
    // Add further assertions based on your specific response handling or error checks
  });
});
