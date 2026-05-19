class AppError extends Error {
  constructor(message, statusCode, errorCode = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode; // machine-readable code e.g. "VALIDATION_ERROR"
    this.details = details; // extra info e.g. validation error array
    this.isOperational = true; // marks known/expected errors
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static badRequest(message, details = null) {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static internal(message = "Internal server error") {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }

  static conflict(message = "Conflict") {
    return new AppError(message, 409, "CONFLICT");
  }

  static tooMany(message = "Too many requests") {
    return new AppError(message, 429, "RATE_LIMIT_EXCEEDED");
  }

  static serviceUnavailable(message = "Service unavailable") {
    return new AppError(message, 503, "SERVICE_UNAVAILABLE");
  }
}

module.exports = AppError;
