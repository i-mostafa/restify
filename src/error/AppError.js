module.exports = class AppError extends Error {
  constructor(err) {
    if (typeof err !== "object")
      throw new Error(
        "your error must be an object with (message & status & statusCode) fields  "
      );
    console.log("err", err);
    super(err.message);
    this.message = err.message;
    this.status = err.status;
    this.statusCode = err.statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};
