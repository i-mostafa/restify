const Joi = require("joi");
const { defaultEndPoints } = require("./constants");

const RouteSchema = Joi.object({
  path: Joi.string().trim().lowercase().required(),
  method: Joi.string()
    .trim()
    .lowercase()
    .valid("post", "put", "patch", "delete", "get", null),
  middleWare: Joi.function(),
  endPoint: Joi.valid(...Object.keys(defaultEndPoints)),
  customEndPoint: Joi.function(),
  targets: Joi.array().items(Joi.link("#router")),
}).id("router");

const RoutesSchema = Joi.array().items(RouteSchema).required();

module.exports = RoutesSchema;
