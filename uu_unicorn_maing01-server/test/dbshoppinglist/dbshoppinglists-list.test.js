// MongoDB related imports
const { MongoClient } = require("mongodb");

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

  test("listAllShoppingLists", async () => {
    // Perform the find operation to list all shopping lists in the mock collection
    const allLists = await collection.find({}).toArray();

    console.log("All Shopping Lists:", allLists);
    // Check the expected outcomes
    expect(allLists).toBeDefined();
    // Perform your assertions based on the retrieved shopping lists
    // For instance:
    expect(Array.isArray(allLists)).toBeTruthy(); // Check if it's an array
    // Add further assertions as needed based on your specific response
  });
  test("listAllShoppingLists with no lists available", async () => {
    // Clear the collection to simulate an empty list scenario
    await collection.deleteMany({});

    // Simulate attempting to list all shopping lists
    const allLists = await collection.find({}).toArray();

    // Check the expected outcomes when there are no lists available
    expect(allLists).toBeDefined();
    expect(allLists.length).toBe(0); // Ensure that the result is an empty array
    // Add further assertions based on your specific response handling
  });
});
