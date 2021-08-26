const PgFactory = require("./pg.factory");

const RestifyDb = class {
  static availableDatabases = { pg: "pg" };

  static availableDbFactories = { pg: PgFactory };
  static pg = PgFactory;
};

module.exports = RestifyDb;
