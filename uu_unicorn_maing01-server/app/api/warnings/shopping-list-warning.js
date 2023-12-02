const Errors = require("../errors/shopping-list-error.js");

const Warnings = {
  CreateList: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
