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

test("list all shopping lists", async () => {
  await TestHelper.login("ExecutivesUser");

  const dtoInCreateList = {
    listName: "Test List",
  };

  await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);

  // Command to list all shopping lists
  const result = await TestHelper.executeGetCommand("shoppingLists/list", {});

  expect(result.data).toBeDefined();
});

test("Unauthorized user cannot access shopping lists", async () => {
  await TestHelper.login("ExecutivesUser");

  const dtoInCreateList = {
    listName: "Test List",
  };

  await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);

  // Unauthorized user access 
  await TestHelper.login("ReadersUser");

  try {
    const result = await TestHelper.executeGetCommand("shoppingLists/list", {});
    expect(result.data).toEqual([]);
  } catch (error) {
    expect(error.status).toEqual(403);
    expect(error.code).toEqual("uu-appg01/authorization/accessDenied");
  }
});

test("No lists available to list", async () => {
  
  await TestHelper.login("ExecutivesUser");

  try {
    // Command to list all shopping lists
    const result = await TestHelper.executeGetCommand("shoppingLists/list", {});

    
    fail("Expected UserNotAuthorized error but received lists instead.");
  } catch (error) {
    
    expect(error.code).toEqual("uu-unicorn-main/shoppingList/list/userNotAuthorized");

    
    expect(error.message).toEqual("User is not authorized.");
    expect(error.status).toEqual(400); 
   
  }
});
