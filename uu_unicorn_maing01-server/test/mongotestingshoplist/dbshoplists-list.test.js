// MongoDB related imports
const { MongoClient } = require("mongodb");

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

  test("listAllShoppingLists", async () => {
    const allLists = await collection.find({}).toArray();

    console.log("All Shopping Lists:", allLists);
    expect(allLists).toBeDefined();
    expect(Array.isArray(allLists)).toBeTruthy(); // Check if it's an array
  });
  test("listAllShoppingLists with no lists available", async () => {
    await collection.deleteMany({});

    const allLists = await collection.find({}).toArray();

    expect(allLists).toBeDefined();
    expect(allLists.length).toBe(0); // Ensure that the result is an empty array
  });
});
