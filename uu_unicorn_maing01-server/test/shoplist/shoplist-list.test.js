const { TestHelper } = require("uu_appg01_server-test");

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
  await TestHelper.executePostCommand("shoppingLists/shoppingList/createList", dtoInCreateList);
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("list all shopping lists", async () => {
    // Simulate authorization by setting the logged-in user's profile
    await TestHelper.login("ExecutivesUser");
  
    // Execute the command to list all shopping lists
    const result = await TestHelper.executeGetCommand("shoppingLists/list", {});
  console.log(result)
    // Check the expected outcomes
    expect(result.data).toBeDefined();
    // Add further assertions based on the response content or other expected behavior
  });

  test("Unauthorized user cannot access shopping lists", async () => {
    // Simulate unauthorized user access (e.g., 'Readers' profile)
    await TestHelper.login("ReadersUser");
  
    try {
        const result = await TestHelper.executeGetCommand("shoppingLists/list", {});
        // If an unauthorized user gets here, the test should fail because they're not supposed to have access
        expect(result.data).toEqual([]); // Expect an empty array or null, indicating no access
      } catch (error) {
        // If an error is thrown due to unauthorized access, the test should pass
        expect(error.status).toEqual(403); // 403 indicates access forbidden
        expect(error.code).toEqual("uu-appg01/authorization/accessDenied");
      }
    });
    test("No lists available to list", async () => {
        // Simulate authorization by setting the logged-in user's profile
        await TestHelper.login("ExecutivesUser");
      
        // Execute the command to delete all lists (if your application supports this functionality in a controlled manner)
        // ... Your code to delete all lists goes here
      
        // Execute the command to list all shopping lists
        const result = await TestHelper.executeGetCommand("shoppingLists/list", {});
      
        // Check the expected outcome when there are no lists available
        expect(result.data).toEqual([]); // Expect an empty array or null, indicating no lists available
      });

      
  