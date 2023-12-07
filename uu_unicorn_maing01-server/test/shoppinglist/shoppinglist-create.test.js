const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  // fire up application and database
  await TestHelper.setup();
  // call sys/uuSubAppInstance/init endpoint
  await TestHelper.initUuSubAppInstance();
  // call sys/uuAppWorkspace/create endpoint
  await TestHelper.createUuAppWorkspace();
  // call sys/uuAppWorkspace/init endpoint
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
});

afterEach(async () => {
  await TestHelper.teardown();
});

test("createList with authorization", async () => {
  
  await TestHelper.login("ExecutivesUser");

  
  const dtoIn = {
    listName: "new list", 
    
  };

  // Execute the createList command using TestHelper with authorization
  const result = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
  console.log(result)
  
  expect(result.data).toBeDefined();
 
});


test("createList with authorization - Readers (Expect Error)", async () => {
  await TestHelper.login("ReadersUser");

  const dtoIn = {
    listName: "new list for readers", 
  };

  try {
    await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
    
    fail("Expected an error but command succeeded.");
  } catch (error) {
    
    expect(error.code).toEqual("uu-appg01/authorization/accessDenied");
    expect(error.status).toEqual(403); // Forbidden status code for unauthorized access
  }
});
test("createList with invalid dtoIn", async () => {
  
  await TestHelper.login("ExecutivesUser");

 
  const dtoIn = {
    listName: ""
  };

  // Execute the createList command using TestHelper with authorization and invalid dtoIn
  try {
    await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
    
    fail("The command did not throw an error for invalid dtoIn.");
  } catch (error) {
    
    expect(error.code).toEqual("uu-unicorn-main/shoppingList/shoppingList/create/invalidDtoIn");
    expect(error.status).toEqual(400);
   
  }
});

