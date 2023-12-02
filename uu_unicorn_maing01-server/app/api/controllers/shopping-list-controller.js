"use strict";

const ShoppingListAbl = require("../../abl/shopping-list-abl.js");

class ShoppingListController {
  list(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let awid = ucEnv.getUri().getAwid();
    let session = ucEnv.getSession();
    return ShoppingListAbl.list(awid, dtoIn, session);
  }

  getList(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let awid = ucEnv.getUri().getAwid();
    let session = ucEnv.getSession();
    let authorizationResult = ucEnv.getAuthorizationResult();
    return ShoppingListAbl.getList(awid, dtoIn, session, authorizationResult);
  }

  createList(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let awid = ucEnv.getUri().getAwid();
    let session = ucEnv.getSession();
    let authorizationResult = ucEnv.getAuthorizationResult();
    return ShoppingListAbl.createList(awid, dtoIn, session, authorizationResult);
  }

  deleteList(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.deleteList(dtoIn, session);
  }

  updateListName(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.updateListName(dtoIn, session);
  }

  archiveList(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.archiveList(dtoIn, session);
  }

  createItem(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.createItem(dtoIn, session);
  }

  deleteItem(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.deleteItem(dtoIn, session);
  }

  resolveItem(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.resolveItem(dtoIn, session);
  }

  
  createAuthorizedUser(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.createAuthorizedUser(dtoIn, session);
  }
  
  deleteAuthorizedUser(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let session = ucEnv.getSession();
    return ShoppingListAbl.deleteAuthorizedUser(dtoIn, session);
  }
}

module.exports = new ShoppingListController();
