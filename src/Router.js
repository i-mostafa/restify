const express = require("express");
const router = express.Router();

const Router = class {
  static avaialableDatabases = { mongodb: "mongodb", postgresql: "postgresql" };

  constructor({ routes, RestifyError } = {}) {
    this.RestifyError = RestifyError;
    this.router = {};
    this.resolveRoutes(routes);
  }
  resolveRoutes(routes, parent = "") {
    routes.forEach((route) => {
      const key = parent + route.path;
      if (route.targets?.length) this.resolveRoutes(route.targets, key);
      if (route.method) this.router[key] = route;
    });
  }
};

module.exports = Router;
