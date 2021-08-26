module.exports = (errOptions = {}) => ({
  notFound: returnErrorBody(
    "error",
    `This target '${errOptions?.url}' not found`,
    404
  ),
  signInFaild: returnErrorBody("failed", `Incorrect email or password `, 400),
  validationError: returnErrorBody(
    "error",
    `Validation Error: '${errOptions?.msg}'`,
    400
  ),
  noQery: returnErrorBody(
    "error",
    `No data found on: '${errOptions?.msg}'`,
    500
  ),
  remoteServerError: returnErrorBody("error", `error on remote server'`, 500),
  noDocumentMatched: returnErrorBody(
    "faild",
    `No document found to be '${errOptions?.msg}'`,
    404
  ),
  emailNotFound: returnErrorBody(
    "faild",
    `No user found matches this email '${errOptions?.email}'`,
    404
  ),
  emailAlreadyExists: returnErrorBody(
    "faild",
    `This Email is Already Exists '${errOptions?.email}'`,
    409
  ),
  tokenAlreadySent: returnErrorBody(
    "faild",
    `Active link already sent to this email:  '${errOptions?.email}'`,
    409
  ),
  tokenExpired: returnErrorBody(
    "faild",
    `this link is expired. please request another one'`,
    409
  ),
  incorrectPassword: returnErrorBody(
    "faild",
    `the password entered is incorrect'`,
    403
  ),
  tokenNotFound: returnErrorBody(
    "faild",
    `this link is not found. please sign up to get a valid one'`,
    404
  ),
  serverError: returnErrorBody(
    "error",
    `internal server error : ${errOptions.msg}'`,
    500
  ),
  notAuth: returnErrorBody("error", `Not Authorized to go here'`, 401),
  authFaild: returnErrorBody("failed", `Authorization Faild'`, 403),
});

const returnErrorBody = (status, message, statusCode) => ({
  status,
  message,
  statusCode,
});
