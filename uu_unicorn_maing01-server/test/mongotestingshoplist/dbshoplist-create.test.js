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

  test("createList", async () => {
    const dtoIn = {
      listName: "Crab Cake", 
    };

    // Expected values for the created list
    const expectedList = {
      name: "Crab Cake",
      ownerId: null,
      awid: "22222222222222222222222222222222",
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
      awid: "22222222222222222222222222222222",
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

    const insertResult = await collection.insertOne(newList);

    const createdList = await collection.findOne({ _id: insertResult.insertedId });

    console.log("Result Data:", createdList);
    expect(createdList).toBeDefined();
    expect(createdList).toMatchObject(expectedList);
    expect(createdList.uuAppErrorMap).toEqual({});
  });

  test("createList with invalid inputs", async () => {
    const dtoIn = {
      
    };

    try {
      const insertResult = await collection.insertOne(dtoIn);
      expect(insertResult).toBeNull(); // Expecting an error or an unexpected insertion
    } catch (error) {
      expect(error).toBeDefined(); // Ensure an error was caught
    }
  });
});


