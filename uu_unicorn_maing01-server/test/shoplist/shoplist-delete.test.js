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

test("delete shopping list - valid ID", async () => {
    // Simulate login as a user who has permission to delete the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Create a shopping list to ensure there's a list to delete
    const dtoInCreateList = {
      listName: "Test List",
      // Other necessary properties according to your schema
    };
    const createListResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);
  
    // Get the ID of the newly created list
    const listIdToDelete = createListResult.data.id;
  
    // Execute the command to delete the shopping list with a valid ID
    const deleteListResult = await TestHelper.executeDeleteCommand(`shoppingLists/shoppingList/deleteList/${listIdToDelete}`, {});
  
    // Check the expected outcomes
    expect(deleteListResult.data).toEqual({}); // Expect an empty response object after successful deletion
    // Add further assertions based on the response content or other expected behavior
  });
  
  test("delete shopping list - invalid ID", async () => {
    // Simulate login as a user who has permission to delete the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Define an invalid ID for deleting the shopping list
    const invalidListId = "invalidId123";
  
    try {
      // Execute the command to delete the shopping list with an invalid ID
      await TestHelper.executeDeleteCommand(`shoppingLists/shoppingList/deleteList/${invalidListId}`, {});
  
      // If the code reaches this point, it means the command executed successfully with an invalid ID
      // Fail the test as it's supposed to throw an error for an invalid ID
      fail("Expected the request to fail with an invalid ID");
    } catch (error) {
      // Check the expected outcomes
      expect(error.status).toEqual(404); // Expect a 'Not Found' status code for an invalid ID
      expect(error.code).toEqual("uu-appg01/shoppingLists/shoppingList/deleteList/listNotFound"); // Adjust the error code based on your application's response
      // Add further assertions based on the expected error response or other behavior
    }
  });
  
  test("delete shopping list - unauthorized user", async () => {
    // Simulate unauthorized user access (e.g., 'Readers' profile)
    await TestHelper.login("ReadersUser");
  
    try {
      // Try to delete a shopping list as an unauthorized user
      await TestHelper.executeDeleteCommand("shoppingLists/shoppingList/deleteList/123456", {});
      
      // If an unauthorized user gets here, the test should fail because they're not supposed to have access
      expect(true).toBe(false); // Fail the test explicitly if delete command succeeds
    } catch (error) {
      // If an error is thrown due to unauthorized access, the test should pass
      if (error.response && error.response.status) {
        expect(error.response.status).toEqual(403); // 403 indicates access forbidden
      } else {
        expect(true).toBe(false); // Fail the test if error status is missing
      }
      expect(error.code).toEqual("uu-appg01/authorization/accessDenied");
      console.log("Error message:", error.message); // Log the error message for reference
    }
  });
  
  
  
  
  
  