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
  firstListId = createdListResult.data.id; 
  console.log(firstListId);
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("get single shopping list", async () => {
  
  await TestHelper.login("ExecutivesUser");

  try {
    // command to list all shopping lists
    const listResponse = await TestHelper.executeGetCommand("shoppingLists/list", {});

    
    console.log("List of Shopping Lists:", listResponse.data.list);

    //  ID of the first shopping list from the response
    const firstListId = listResponse.data.list[0]?.id;
    console.log("First List ID:", firstListId);

    
    if (firstListId) {
      // DtoIn for fetching a single shopping list
      const dtoIn = { id: firstListId };
      console.log("DtoIn:", dtoIn);

      // command to get the single shopping list
      const result = await TestHelper.executeGetCommand("shoppingLists/shoppingList/get", dtoIn);
      console.log("Result:", result);
      console.log("Single Shopping List:", result.data);

      const expectedShoppingList = {
        uuObject: {
          list: {
            name: 'Test List',
            ownerId: expect.any(String),
            awid: expect.any(String),
            archived: false,
            sys: expect.any(Object),
            items: expect.any(Array),
            authorizedUsers: expect.any(Array),
            visibility: true,
            uuIdentity: expect.any(String),
            uuIdentityName: expect.any(String),
            id: expect.any(String)
          },
          awid: expect.any(String),
          visibility: true,
          uuIdentity: expect.any(String),
          uuIdentityName: expect.any(String)
        },
        uuAppErrorMap: {}
      };

      
       expect(result.data).toEqual(expect.objectContaining(expectedShoppingList));
    } else {
      console.error("No valid shopping list ID available.");
    }
  } catch (error) {
    console.error("Error fetching the single shopping list:", error);
  }
});





  test("get shopping list with non-existent ID", async () => {
    
    await TestHelper.login("ExecutivesUser");
  
    // ID that does not exist
    const dtoIn = { id: 1234 };
  
    try {
      // Execute the command to get a shopping list by a non-existent ID
      await TestHelper.executeGetCommand("shoppingLists/shoppingList/get", dtoIn);
    } catch (error) {
      
      expect(error.status).toEqual(400); // Expected HTTP status code for resource not found
     
    }
  });
  
  
  test("Unauthorized user (Readers) cannot access shopping list", async () => {
    try {
      // logging in as ReadersUser
      await TestHelper.login("ReadersUser");
  
      
      const unauthorizedListId = firstListId;
  
      
      const dtoIn = { id: unauthorizedListId };
  
      
      await TestHelper.executeGetCommand("shoppingLists/shoppingList/get", dtoIn);
  
      
      throw new Error("Unauthorized access should have been denied.");
    } catch (error) {
      
      expect(error.status).toEqual(403); // Expected HTTP status code for access forbidden
      expect(error.code).toEqual("uu-appg01/authorization/accessDenied"); 
      
    }
  });
  
  