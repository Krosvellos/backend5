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
  const createdListResult = await TestHelper.executePutCommand("shoppingLists/shoppingList/createList", dtoInCreateList);
  firstListId = createdListResult.data.id; // Extract ID of the first list
  
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("change shopping list name", async () => {
    // Simulate login as a user who has permission to change the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Create a new shopping list to change its name later
    const createListDto = {
      listName: "Original List Name",
      // Other necessary properties according to your schema
    };
    const createListResult = await TestHelper.executePutCommand("shoppingLists/shoppingList/createList", createListDto);
  
    // Get the ID of the newly created list
    const newListId = createListResult.data.id;
  
    // Execute the command to change the shopping list name
    const newName = "Updated List Name";
    const changeNameDto = {
      id: newListId,
      newName: newName,
      // Other necessary properties according to your schema
    };
    const changeNameResult = await TestHelper.executePutCommand("shoppingLists/shoppingList/name/update", changeNameDto);
  
    // Check the expected outcomes after changing the name
    expect(changeNameResult.data.uuAppErrorMap).toBeUndefined(); // No errors occurred
    expect(changeNameResult.data.name).toEqual(newName); // Check if the name has been updated successfully
    // Add further assertions based on the response content or other expected behavior
  });
  
  test("change shopping list name - ID does not exist", async () => {
    // Simulate login as a user who has permission to change the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Attempt to change the name of a shopping list with a non-existent ID
    const nonExistentId = "non-existent-id"; // Replace this with a non-existent ID
    const newName = "Updated List Name";
    const changeNameDto = {
      id: nonExistentId,
      newName: newName,
      // Other necessary properties according to your schema
    };
  
    try {
      // Execute the command to change the shopping list name with a non-existent ID
      await TestHelper.executePutCommand("shoppingLists/shoppingList/name/update", changeNameDto);
  
      // If the code reaches this point, it means the command executed successfully with a non-existent ID
      // Fail the test as it's supposed to throw an error for a non-existent ID
      fail("Expected the request to fail with a non-existent ID");
    } catch (error) {
      // Check the expected outcomes
      expect(error.status).toEqual(404); // Expect a 'Not Found' status code for non-existent ID
      expect(error.code).toEqual("uu-appg01/shoppingLists/shoppingList/name/update/failed"); // Adjust the error code based on your application's response
      // Add further assertions based on the expected error response or other behavior
    }
  });

  test("change shopping list name - invalid DTO", async () => {
    // Simulate login as a user who has permission to change the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Define an invalid DTO for changing the shopping list name
    const invalidDto = {
      // Missing or invalid properties according to your schema
    };
  
    try {
      // Execute the command to change the shopping list name with an invalid DTO
      await TestHelper.executePutCommand("shoppingLists/shoppingList/name/update", invalidDto);
  
      // If the code reaches this point, it means the command executed successfully with an invalid DTO
      // Fail the test as it's supposed to throw an error for an invalid DTO
      fail("Expected the request to fail with an invalid DTO");
    } catch (error) {
      // Check the expected outcomes
      expect(error.status).toEqual(400); // Expect a 'Bad Request' status code for an invalid DTO
      expect(error.code).toEqual("uu-appg01/shoppingLists/shoppingList/name/update/invalidDto"); // Adjust the error code based on your application's response
      // Add further assertions based on the expected error response or other behavior
    }
  });
  