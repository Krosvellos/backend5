const { TestHelper } = require("uu_appg01_server-test");

let firstListId;

beforeAll(async () => {
  // fire up application and database
  await TestHelper.setup();
  // call sys/uuSubAppInstance/init endpoint
  await TestHelper.initUuSubAppInstance();
  // call sys/uuAppWorkspace/create endpoint
  await TestHelper.createUuAppWorkspace();
  // call sys/uuAppWorkspace/init endpoint, dtoIn of the cmd can be passed in the first parameter
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });

  await TestHelper.login("ExecutivesUser");
  const dtoInCreateList = {
    listName: "Test List",
    // Other necessary properties according to your schema
  };
  const createdListResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);
  firstListId = createdListResult.data.id; // Extract ID of the first list
  
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("get single shopping list", async () => {
    // Simulate authorization by setting the logged-in user's profile
    await TestHelper.login("ExecutivesUser");
  
    // Execute the command to get all shopping lists
    const allLists = await TestHelper.executeGetCommand("shoppingLists/list", {});
    console.log(allLists.data.list[0]?.id);
  
    // Access the ID of the first list in the response data
    const firstListId = allLists.data.list[0]?.id; // Accessing the ID of the first list (if it exists)
  
    // If the first list ID exists, proceed with fetching the single shopping list
    if (firstListId) {
      const result = await TestHelper.executeGetCommand(`shoppingLists/shoppingList/get/${firstListId}`, {});
  
      // Check the expected outcomes
      expect(result.data.list).toBeDefined();
      // Add further assertions based on the response content or other expected behavior
    } else {
      // Handle the case where there are no lists available or the ID cannot be extracted
      console.error("No shopping list available or unable to extract ID.");
    }
  });
  test("get shopping list with non-existent ID", async () => {
    // Simulate authorization by setting the logged-in user's profile
    await TestHelper.login("ExecutivesUser");
  
    // Assuming an ID that does not exist
    const nonExistentId = "invalidListId";
  
    try {
      // Execute the command to get a shopping list by a non-existent ID
      await TestHelper.executeGetCommand(`shoppingLists/shoppingList/getList/${nonExistentId}`, {});
    } catch (error) {
      // Check if the error indicates that the resource was not found
      expect(error.status).toEqual(404); // Expected HTTP status code for resource not found
      // Add further assertions based on the error response content or other expected behavior
    }
  });
  test("Unauthorized user (Readers) cannot access shopping list", async () => {
    // Simulate unauthorized user access (e.g., 'Readers' profile)
    await TestHelper.login("ReadersUser");
  
    // Assuming an existing list ID that 'Readers' user is not authorized to access
    const unauthorizedListId = firstListId; // Replace with an actual unauthorized list ID
  
    try {
      // Execute the command to get a shopping list that the user is not authorized to access
      await TestHelper.executeGetCommand(`shoppingLists/shoppingList/getList/${unauthorizedListId}`, {});
    } catch (error) {
      // Check if the error indicates that access is denied
      expect(error.status).toEqual(403); // Expected HTTP status code for access forbidden
      expect(error.code).toEqual("uu-appg01/authorization/accessDenied"); // Custom error code indicating access denied
      // Add further assertions based on the error response content or other expected behavior
    }
  });
  