// MongoDB related imports
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

  test("updateListName", async () => {
    const initialList = {
      name: "Crab Cake",
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
    const insertResult = await collection.insertOne(initialList);

    const createdListId = insertResult.insertedId;

    // Simulate updating the list name
    const updatedName = "Gingerbread Cookies";
    await collection.updateOne(
      { _id: createdListId },
      { $set: { name: updatedName } }
    );

    // Retrieve the updated shopping list from the mock collection
    const updatedList = await collection.findOne({ _id: createdListId });

    console.log("Updated List:", updatedList);
    expect(updatedList).toBeDefined();
    expect(updatedList.name).toBe(updatedName); // Ensure the name is updated
  });

  test("updateListName with empty dtoIn", async () => {
    const initialList = {
      name: "Initial Name",
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

    const insertResult = await collection.insertOne(initialList);

    const createdListId = insertResult.insertedId;

    // Simulate updating the list name with an empty dtoIn
    const emptyDtoIn = {};
    try {
      await collection.updateOne(
        { _id: createdListId },
        { $set: { name: emptyDtoIn.listName } }
      );
    } catch (error) {
      expect(error).toBeDefined(); // Ensure an error was caught
    }
  });
});
