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
  firstListId = createdListResult.data.id; // ID of the first list
  
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("change shopping list name", async () => {
    // A user who has permission to change the list 
    await TestHelper.login("ExecutivesUser");
  
    // Creating a new shopping list to change its name later
    const createListDto = {
      listName: "Original List Name",
      
    };
    const createListResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", createListDto);
    console.log("The list before change:", createListResult);
    
    const newListId = createListResult.data.id;
    console.log("New list ID:", newListId);
    // Execute the command to change the shopping list name
    const newName = "Updated List Name";
    const dtoIn = {
      listId: newListId,
      newName: newName,
     
    };
    console.log("dtoIn:", dtoIn);
    const changeNameResult = await TestHelper.executePostCommand("shoppingLists/shoppingList/name/update", dtoIn);
    console.log("result of changed list:", changeNameResult);
    
    expect(changeNameResult.data.uuAppErrorMap).toEqual({}); // No errors occurred
    expect(changeNameResult.data.list.name).toEqual(newName); // Name has been updated successfully
    
  });
  
  test("change shopping list name with non-existent ID", async () => {
    
    await TestHelper.login("ExecutivesUser");
  
    // invalid/non-existent ID 
    const invalidListId = '123456789';
  
    // Command to change the shopping list name with an invalid ID
    const newName = "Updated List Name";
    const dtoIn = {
      listId: invalidListId,
      newName: newName,
      
    };
    console.log("dtoIn:", dtoIn);
  
    try {
     
      await TestHelper.executePostCommand("shoppingLists/shoppingList/name/update", dtoIn);
  
      
      throw new Error("Expected an error for non-existent ID.");
    } catch (error) {
      
      expect(error.status).toEqual(400); // Expected HTTP status code for invalid request
      
    }
  });
  

  test("change shopping list name with invalid DTOin", async () => {
    // Simulate login as a user who has permission to change the list (e.g., 'ExecutivesUser')
    await TestHelper.login("ExecutivesUser");
  
    // Define an invalid DTOin (e.g., missing required properties)
    const invalidDtoIn = {
      // Missing or invalid properties according to your schema
    };
  
    try {
      // Attempt to change the name of the shopping list with an invalid DTOin
      await TestHelper.executePostCommand("shoppingLists/shoppingList/name/update", invalidDtoIn);
  
      // If no error occurred, fail the test
      throw new Error("Expected an error for invalid DTOin.");
    } catch (error) {
      // Check if the error indicates that the DTOin is invalid
      expect(error.status).toEqual(400); // Expected HTTP status code for invalid request
      // Add further assertions based on the error response content or other expected behavior
    }
  });
  