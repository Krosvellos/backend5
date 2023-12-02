/* eslint-disable */
// Zobrazí všechny nákupní seznamy (GET)
const shoppingListsListDtoInType = shape({});

// Zobrazí položky nákupního seznamu (GET)
const shoppingListGetDtoInType = shape({
  id: id().isRequired(),
});

// Create a New Shopping List (POST)
const shoppingListCreateDtoInType = shape({
  listName: string(1, 255).isRequired(),
});

// Delete a Shopping List (DELETE)
const shoppingListDeleteDtoInType = shape({
  listId: id().isRequired(),
});

// Modify the Name of a Shopping List (PUT)
const shoppingListUpdateNameDtoInType = shape({
  listId: id().isRequired(),
  newName: string(1, 255).isRequired(),
});

// Archive a Shopping List (PUT)
const shoppingListArchiveDtoInType = shape({
  listId: id().isRequired(),
});

// Add an Item to the Shopping List (POST)
const shoppingListItemCreateDtoInType = shape({
  listId: id().isRequired(),
  itemName: string(1, 255).isRequired(),
});

// Remove an Item from the Shopping List (DELETE)
const shoppingListItemDeleteDtoInType = shape({
  listId: id().isRequired(),
  itemId: string(1, 255).isRequired(),
});

// Update the Status of an Item to "Resolved" (PUT)
const shoppingListItemResolveDtoInType = shape({
  listId: id().isRequired(),
  itemId: string(1, 255).isRequired(),
});


// Create an Authorized User (POST)
const authorizedUserCreateDtoInType = shape({
  listId: id().isRequired(),
  userId: string(1, 255).isRequired(),
});

// Delete an Authorized User (DELETE)
const authorizedUserDeleteDtoInType = shape({
  listId: id().isRequired(),
  userId: string(1, 255).isRequired(),
});

