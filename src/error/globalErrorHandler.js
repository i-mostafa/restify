module.exports = (err, req, res, next) => {
  if (typeof err !== "object")
    throw new Error(
      "your error must be an object with (message & status & statusCode) fields  "
    );
  let stack = err.stack.split(" at ")[1];
  console.error("🎃🎃 Error: " + err.message + " at " + stack, err);
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
