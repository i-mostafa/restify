const Router = require("./Router");
const RoutesSchema = require("./routes.schema");

const Restify = class {
  constructor({ routes = [], RestifyError = Error } = {}) {
    const err = this.validateRoutes(routes);
    if (err) throw new RestifyError(err);
    return new Router({ routes, RestifyError });
  }

  validateRoutes(routes) {
    const result = RoutesSchema.validate(routes);
    if (result.error) return result.error.details[0].message;
    return null;
  }
};

module.exports = Restify;
