const { TestHelper } = require("uu_appg01_server-test");

let firstListId;

beforeAll(async () => {
  // fire up application and database
  await TestHelper.setup();
  // call sys/uuSubAppInstance/init endpoint
  await TestHelper.initUuSubAppInstance();
  // call sys/uuAppWorkspace/create endpoint
  await TestHelper.createUuAppWorkspace();
  // call sys/uuAppWorkspace/init endpoint
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });

  await TestHelper.login("ExecutivesUser");
  const dtoInCreateList = {
    listName: "Test List",
    
  };
  const createdListResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);
  firstListId = createdListResult.data.id; // Extract ID of the first list

  console.log("Created List ID:", firstListId); 
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("delete shopping list", async () => {
  // Simulate login as a user who has permission to delete the list 
  await TestHelper.login("ExecutivesUser");

  try {
    // Execute the command to delete the shopping list
    const dtoIn = {
      listId: firstListId
    };
    console.log("Delete List ID:", firstListId); // Log the ID of the list to be deleted
    const deleteResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/delete", dtoIn);

    
    expect(deleteResult.data.uuAppErrorMap).toEqual({}); // No errors occurred
    
  } catch (error) {
    console.error("Error deleting the shopping list:", error);
    
  }
});


test("delete shopping list with non-existent ID", async () => {
  
  await TestHelper.login("ExecutivesUser");

  
  const nonExistentListId = '123456789';

  try {
    // Execute the command to delete the shopping list with a non-existent ID
    const dtoIn = {
      listId: nonExistentListId
    };
    console.log("Delete List ID (Non-Existent):", nonExistentListId); 
    const deleteResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/delete", dtoIn);

    // Fail the test if no error occurs (as an error is expected for a non-existent ID)
    throw new Error("Expected an error for a non-existent ID.");
  } catch (error) {
    
    expect(error.status).toEqual(400); // Expected HTTP status code for invalid request
   
  }
});

test("Unauthorized user cannot delete shopping list", async () => {
  // Simulate login as an unauthorized user 
  await TestHelper.login("ReadersUser");

  // ID of the list that the user is not authorized to delete
  const unauthorizedListId = firstListId; 

  try {
    
    const dtoIn = {
      listId: unauthorizedListId
    };
    console.log("Unauthorized Delete List ID:", unauthorizedListId); 
    const deleteResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/delete", dtoIn);

    // Fail the test if no error occurs (as an error is expected for unauthorized access)
    throw new Error("Expected an error for unauthorized access.");
  } catch (error) {
    
    expect(error.status).toEqual(403); // Expected HTTP status code for access forbidden
    expect(error.code).toEqual("uu-appg01/authorization/accessDenied"); 
    
  }
});