const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  // fire up application and database
  await TestHelper.setup();
  // call sys/uuSubAppInstance/init endpoint
  await TestHelper.initUuSubAppInstance();
  // call sys/uuAppWorkspace/create endpoint
  await TestHelper.createUuAppWorkspace();
  // call sys/uuAppWorkspace/init endpoint, dtoIn of the cmd can be passed in the first parameter
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
});

afterEach(async () => {
  await TestHelper.teardown();
});

test("createList with authorization", async () => {
  // Simulate authorization by setting the logged-in user's profile
  await TestHelper.login("ExecutivesUser");

  // Prepare the input data for creating a new shopping list
  const dtoIn = {
    listName: "new list", // Adjust with the desired list name
    
    // Add other required properties according to your schema
  };

  // Execute the createList command using TestHelper with authorization
  const result = await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
  console.log(result)
  // Check the expected outcomes
  expect(result.data).toBeDefined();
  // Add further assertions based on your specific response or authorization behavior
});


test("createList with authorization - Readers (Expect Error)", async () => {
  await TestHelper.login("ReadersUser");

  const dtoIn = {
    listName: "new list for readers", // Adjust with the desired list name
    // Add other required properties according to your schema
  };

  try {
    await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
    // If the command does not throw an error, fail the test
    fail("Expected an error but command succeeded.");
  } catch (error) {
    // Check the expected error properties
    expect(error.code).toEqual("uu-appg01/authorization/accessDenied");
    expect(error.status).toEqual(403); // Forbidden status code for unauthorized access
    // Add further assertions based on your specific error handling logic
  }
});
test("createList with invalid dtoIn", async () => {
  // Simulate authorization by setting the logged-in user's profile
  await TestHelper.login("ExecutivesUser");

  // Prepare the input data for creating a new shopping list with invalid dtoIn
  const dtoIn = {
    listName: ""
  };

  // Execute the createList command using TestHelper with authorization and invalid dtoIn
  try {
    await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoIn);
    // If the command does not throw an error, fail the test
    fail("The command did not throw an error for invalid dtoIn.");
  } catch (error) {
    // Check the expected error code and status
    expect(error.code).toEqual("uu-unicorn-main/shoppingList/shoppingList/create/invalidDtoIn");
    expect(error.status).toEqual(400);
    // Add further assertions based on your specific error handling behavior
  }
});

