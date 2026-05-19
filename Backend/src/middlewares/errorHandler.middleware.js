const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) console.error("[ERROR]", err);

  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || "INTERNAL_ERROR";
  let message = err.message || "Something went wrong. Please try again.";
  let details = err.details || null;

  // 2. Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 3. Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    errorCode = "CAST_ERROR";
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 4. MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_KEY";
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // 5. JWT JsonWebTokenError
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
    message = "Invalid token";
  }

  // 6. JWT TokenExpiredError
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
    message = "Token has expired";
  }

  // 7. SyntaxError (malformed JSON body)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    errorCode = "INVALID_JSON";
    message = "Invalid JSON in request body";
  }

  // 8. Unknown non-operational errors
  if (!err.isOperational && !isDev) {
    message = "Something went wrong. Please try again.";
  }

  const errorResponse = {
    success: false,
    statusCode,
    errorCode,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  if (isDev) {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
