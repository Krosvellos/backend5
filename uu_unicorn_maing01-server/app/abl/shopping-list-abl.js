"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { v4: uuidv4 } = require("uuid");
const Errors = require("../api/errors/shopping-list-error.js");
const Warnings = require("../api/warnings/shopping-list-warning.js");

class ShoppingListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("shopping-list");
  }

  async list(awid, dtoIn, session) {
    let uuAppErrorMap = {};

    // validace dtoIn
    const validationResult = this.validator.validate("shoppingListsListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // získání informací o uuIdentity
    const uuIdentity = session.getIdentity().getUuIdentity();
    const uuIdentityName = session.getIdentity().getName();

    // Načtení všech seznamů
    const allLists = await this.dao.list(awid);

    // Filtrování seznamů, na které má uživatel oprávnění
    const authorizedLists = allLists.itemList.filter((list) =>
      list.authorizedUsers.some((user) => user.userID === uuIdentity)
    );

    // Kontrola, zda nejsou nalezeny žádné seznamy, na které má uživatel oprávnění
    if (authorizedLists.length === 0) {
      // Zpracování případu, kdy nebyly nalezeny žádné autorizované seznamy
      throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
    }

    const dtoOut = { list: authorizedLists, awid, uuIdentity, uuIdentityName, uuAppErrorMap };
    return dtoOut;
  }

  async getList(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // set visibility
    const visibility = authorizationResult.getAuthorizedProfiles().includes("Executives");
    const uuIdentity = session.getIdentity().getUuIdentity();
    const uuIdentityName = session.getIdentity().getName();

    let list = await this.dao.get(dtoIn.id);

    // Check if the user is authorized to view the list
    let isAuthorized = list.authorizedUsers.some((user) => user.userID === uuIdentity);
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
    }

    const uuObject = {
      list,
      awid,
      visibility,
      uuIdentity,
      uuIdentityName,
    };
    return { uuObject, uuAppErrorMap };
  }

  async createList(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.CreateList.InvalidDtoIn
    );

    // set visibility
    const visibility = authorizationResult.getAuthorizedProfiles().includes("Executives");

    // get uuIdentity information
    const uuIdentity = session.getIdentity().getUuIdentity();
    const uuIdentityName = session.getIdentity().getName();
    const now = new Date();
    // save joke to uuObjectStore
    const uuObject = {
      name: dtoIn.listName, // name of list set at creation
      ownerId: uuIdentity, // id of the owner
      awid: awid, //appWorkspaceId - unique code specified externally
      archived: false, // use for sorting, in order to sort whitch lists are archived and whitch not
      sys: {
        cts: now, //create timestamp
        mts: now, //modification timestamp
        rev: 0, //revision number
      },
      items: [
        //...
      ],
      authorizedUsers: [{ userID: uuIdentity }],
      awid,
      visibility,
      uuIdentity,
      uuIdentityName,
    };
    const list = await this.dao.create(uuObject);

    // prepare and return dtoOut
    const dtoOut = { ...list, uuAppErrorMap };
    return dtoOut;
  }

  async deleteList(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.DeleteList.InvalidDtoIn
    );

    const uuIdentity = session.getIdentity().getUuIdentity();

    let listCopy = await this.dao.get(dtoIn.listId);
    console.log(listCopy);
    if (!listCopy) {
      throw new Errors.DeleteList.ListDoesNotExist({ uuAppErrorMap });
    }

    // Check if the user is authorized to view the list
    let isAuthorized = listCopy.ownerId === uuIdentity;
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.DeleteList.UserNotAuthorized({ uuAppErrorMap });
    }

    const list = await this.dao.delete(dtoIn.listId);

    // prepare and return dtoOut
    const dtoOut = { list, uuAppErrorMap };
    return dtoOut;
  }

  async updateListName(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListUpdateNameDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.CreateList.InvalidDtoIn
    );

    // set visibility
    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to view the list
    let isAuthorized = list.ownerId === uuIdentity;
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.UpdateListName.UserNotAuthorized({ uuAppErrorMap });
    }
    // Updating the list name
    list.name = dtoIn.newName;
    const now = new Date();
    list.sys.mts = now; // Update the modification timestamp

    // Save the updated list back to the database
    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async archiveList(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListArchiveDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.ArchiveList.InvalidDtoIn
    );

    // set visibility
    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to view the list
    let isAuthorized = list.ownerId === uuIdentity;
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.ArchiveList.UserNotAuthorized({ uuAppErrorMap });
    }
    // Updating the list name
    list.archived = true;
    const now = new Date();
    list.sys.mts = now; // Update the modification timestamp

    // Save the updated list back to the database
    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async createItem(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListItemCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.CreateItem.InvalidDtoIn
    );

    // set visibility
    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to view the list
    let isAuthorized = list.authorizedUsers.some((user) => user.userID === uuIdentity);
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.CreateItem.UserNotAuthorized({ uuAppErrorMap });
    }
    list.items.push({
      id: uuidv4(),
      itemName: dtoIn.itemName,
      resolved: false,
    });

    // Save the updated list back to the database
    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async deleteItem(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListItemDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.DeleteItem.InvalidDtoIn
    );

    // set visibility
    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to view the list
    let isAuthorized = list.authorizedUsers.some((user) => user.userID === uuIdentity);
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.DeleteItem.UserNotAuthorized({ uuAppErrorMap });
    }

    list.items = list.items.filter((item) => item.id !== dtoIn.itemId);
    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async resolveItem(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListItemResolveDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.ResolveItem.InvalidDtoIn
    );

    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to view the list
    let isAuthorized = list.authorizedUsers.some((user) => user.userID === uuIdentity);
    if (!isAuthorized) {
      // Add authorization error to uuAppErrorMap
      throw new Errors.ResolveItem.UserNotAuthorized({ uuAppErrorMap });
    }

    // Find the item and mark it as resolved
    let item = list.items.find((item) => item.id === dtoIn.itemId);
    if (item) {
      item.resolved = true;
    } else {
      // Handle the case where the item is not found
      throw new Errors.ResolveItem.ShoppingListDaoResolveItemFailed({ uuAppErrorMap });
    }

    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async createAuthorizedUser(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("authorizedUserCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.CreateAuthorizedUser.InvalidDtoIn
    );

    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is authorized to update the list
    let isOwner = list.ownerId === uuIdentity;
    if (!isOwner) {
      throw new Errors.CreateAuthorizedUser.UserNotAuthorized({ uuAppErrorMap });
    }

    // Add the new authorized user
    list.authorizedUsers.push({ userID: dtoIn.userId });

    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }

  async deleteAuthorizedUser(dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("authorizedUserDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.CreateList.UnsupportedKeys.code,
      Errors.DeleteAuthorizedUser.InvalidDtoIn
    );

    const uuIdentity = session.getIdentity().getUuIdentity();

    let list = await this.dao.get(dtoIn.listId);

    // Check if the user is the owner of the list
    let isOwner = list.ownerId === uuIdentity;
    // Check if the user is in the authorized users list
    let isAuthorizedUser = list.authorizedUsers.some((user) => user.userID === uuIdentity);

    // User is neither owner nor authorized user
    if (!isOwner && !isAuthorizedUser) {
      throw new Errors.DeleteAuthorizedUser.UserNotAuthorized({ uuAppErrorMap });
    }

    // User is an authorized user but not the owner, and tries to delete someone other than themselves
    if (!isOwner && isAuthorizedUser && uuIdentity !== dtoIn.userId) {
      throw new Errors.DeleteAuthorizedUser.UserNotAuthorized({ uuAppErrorMap });
    }

    // Remove the authorized user
    list.authorizedUsers = list.authorizedUsers.filter((user) => user.userID !== dtoIn.userId);

    let updatedList = await this.dao.update(list);

    return { list: updatedList, uuAppErrorMap };
  }
}

module.exports = new ShoppingListAbl();
