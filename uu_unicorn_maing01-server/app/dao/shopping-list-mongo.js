"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ShoppingListMongo extends UuObjectDao {
  async createSchema() {}

  async create(list) {
    return super.insertOne(list);
  }

  async get(id) {
    return await super.findOne({ id });
  }

  async list(awid) {
    const filter = { awid };
    return await super.find(filter);
  }

  async delete(id) {
    await super.deleteOne({ id });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id };
    return await super.findOneAndUpdate(filter, uuObject);
  }

  
}

module.exports = ShoppingListMongo;
