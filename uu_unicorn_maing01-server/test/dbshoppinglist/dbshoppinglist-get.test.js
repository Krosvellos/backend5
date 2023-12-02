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

  test("createList", async () => {
    const dtoIn = {
      listName: "Crab Cake",
      // Add other required properties according to your schema
    };

    // Expected values for the created list
    const expectedList = {
      name: 'Crab Cake',
      ownerId: null,
      awid: '22222222222222222222222222222222',
      archived: false,
      sys: {
        rev: 0
      },
      items: [],
      authorizedUsers: [{ userID: null }],
      visibility: false,
      uuIdentity: null,
      uuAppErrorMap: {}
    };

    // Simulate creating a shopping list
    const newList = {
      name: dtoIn.listName,
      ownerId: null,
      awid: '22222222222222222222222222222222',
      archived: false,
      sys: {
        rev: 0
      },
      items: [],
      authorizedUsers: [{ userID: null }],
      visibility: false,
      uuIdentity: null,
      uuAppErrorMap: {}
    };

    // Perform the insert operation to create a new shopping list in the mock collection
    const insertResult = await collection.insertOne(newList);

    // Retrieve the created list from the mock collection
    const createdList = await collection.findOne({ _id: insertResult.insertedId });

    console.log("Result Data:", createdList);
    // Check the expected outcomes
    expect(createdList).toBeDefined();
    expect(createdList).toMatchObject(expectedList);
    expect(createdList.uuAppErrorMap).toEqual({});
    // Add further assertions as needed based on your specific response
  });

  test("getSingleShoppingList with non-existent ID", async () => {
    // Define a non-existent ID for retrieving a shopping list
    const nonExistentId = "1234";

    // Simulate attempting to retrieve a non-existent shopping list
    const nonExistentList = await collection.findOne({ _id: nonExistentId });

    // Check the expected outcomes when attempting to retrieve a non-existent shopping list
    expect(nonExistentList).toBeNull(); // Ensure that the retrieved list is null or undefined
    // Add further assertions based on your specific response handling or error checks
  });
});
