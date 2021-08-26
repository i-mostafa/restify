const { PrismaClient } = require("@prisma/client");
const _ = require("lodash");

const AppError = require("../error/AppError");
const errorList = require("../error/error.list");
const PgFilter = require("./pg.filter");

const prisma = new PrismaClient();

module.exports = class {
  constructor(model) {
    this.model = model;
    this.prismaModel = prisma[model];
  }

  /**
   * get one depend on filter query
   */
  async getOne(where) {
    return await this.prismaModel.findUnique({ where });
  }
  /**
   * get all records depend on filter query
   */
  async getAll(query) {
    const filter = new PgFilter(query).exec();
    console.log(filter);
    return await this.prismaModel.findMany(filter);
  }

  /**create a record
   */
  async createOne(data, next) {
    //check for  body
    if (_.isEmpty(data))
      return next(
        new AppError(errorList({ msg: "no body to create" }).serverError)
      );
    return await this.prismaModel.create({ data });
  }

  /**
   * create many records
   */
  async createMany(data, next) {
    //check for  body
    if (_.isEmpty(data) || !Array.isArray(data))
      return next(
        new AppError(errorList({ msg: "no body to create" }).serverError)
      );
    return await this.prismaModel.createMany({ data });
  }

  /**
   * update  one record
   */
  async updateOne(where, data, next) {
    //check for query obj & body
    if (_.isEmpty(where) || _.isEmpty(data))
      return next(
        new AppError(errorList({ msg: "no body to update" }).serverError)
      );

    return await this.prismaModel.update({ where, data });
  }

  /**
   * update many records
   */
  async updateMany(where, data, next) {
    //check for query obj & body
    if (_.isEmpty(where) || _.isEmpty(data) || !Array.isArray(data))
      return next(
        new AppError(errorList({ msg: "no body to update" }).serverError)
      );

    return await this.prismaModel.updateMany({ where, data });
  }

  /**
   * delete one record
   */
  async deleteOne(where) {
    //check for params
    if (_.isEmpty(where))
      return next(
        new AppError(errorList({ msg: "no body to deleted" }).serverError)
      );

    return await this.prismaModel.delete({ where });
  }

  /**
   * delete many records
   */
  async deleteMany() {
    //check for params
    if (_.isEmpty(where))
      return next(
        new AppError(errorList({ msg: "no body to deleted" }).serverError)
      );

    return await this.prismaModel.deleteMany({ where });
  }

  /**
   * count records
   */
  async count(where) {
    return await this.prismaModel.count({ where });
  }
};
