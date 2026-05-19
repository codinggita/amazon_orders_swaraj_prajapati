const AppError = require("../utils/AppError");

const simulateNotFound = (req, res, next) => {
  next(AppError.notFound("The requested order ORD9999999 was not found"));
};

const simulateServerError = (req, res, next) => {
  next(new AppError("Internal server error occurred while processing request", 500, "INTERNAL_ERROR"));
};

const simulateDatabaseError = (req, res, next) => {
  const dbError = new AppError(
    "Database connection timeout. Unable to complete the query.",
    503,
    "DATABASE_ERROR",
    {
      host: "mongodb+srv://cluster.mongodb.net",
      timeout: "30000ms",
      retryAttempts: 3,
    }
  );
  next(dbError);
};

const simulateValidationError = (req, res, next) => {
  const validationError = AppError.badRequest(
    "Validation failed. Please check the provided fields.",
    [
      { field: "OrderID", message: "OrderID is required", value: null },
      { field: "CustomerName", message: "CustomerName must be min 2 chars", value: "A" },
      { field: "TotalAmount", message: "TotalAmount must be a valid number", value: "abc" },
      { field: "OrderDate", message: "OrderDate must be format YYYY-MM-DD", value: "31-01-2024" },
      {
        field: "PaymentMethod",
        message: "PaymentMethod must be one of: UPI, Debit Card, Credit Card, Net Banking, COD, Wallet",
        value: "Bitcoin",
      },
    ]
  );
  next(validationError);
};

const simulateRateLimitError = (req, res, next) => {
  res.set({
    "Retry-After": "900",
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
  next(
    AppError.tooMany(
      "Rate limit exceeded. You have made too many requests. Please wait 15 minutes before trying again."
    )
  );
};

const simulateTokenExpiredError = (req, res, next) => {
  const tokenError = new AppError(
    "Your session has expired. Please login again to continue.",
    401,
    "TOKEN_EXPIRED",
    {
      expiredAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      tokenType: "access_token",
    }
  );
  next(tokenError);
};

const simulatePaymentError = (req, res, next) => {
  const paymentError = new AppError(
    "Payment processing failed. Transaction was declined by the payment gateway.",
    402,
    "PAYMENT_FAILED",
    {
      transactionID: "TXN-" + Date.now(),
      paymentMethod: "Debit Card",
      attemptedAmount: "1299.00",
      currency: "INR",
      declineCode: "insufficient_funds",
      declineMessage: "Your card has insufficient funds.",
      retryAllowed: true,
      supportContact: "support@amazonorders.com",
    }
  );
  next(paymentError);
};

const simulateShippingError = (req, res, next) => {
  const shippingError = new AppError(
    "Shipping label generation failed. Carrier API is currently unavailable.",
    503,
    "SHIPPING_FAILED",
    {
      carrier: "FedEx",
      carrierErrorCode: "CARRIER_503",
      carrierMessage: "FedEx API is currently under maintenance.",
      orderID: "ORD0000001",
      retryAfter: "30 minutes",
      alternativeCarriers: ["BlueDart", "DTDC", "Delhivery"],
    }
  );
  next(shippingError);
};

const simulateUploadError = (req, res, next) => {
  const uploadError = new AppError(
    "File upload failed. The uploaded file exceeds the maximum allowed size or has an invalid format.",
    413,
    "UPLOAD_ERROR",
    {
      maxAllowedSizeMB: 5,
      uploadedSizeMB: 12.4,
      allowedFormats: ["jpg", "jpeg", "png", "pdf", "csv", "xlsx"],
      uploadedFormat: "exe",
      fileName: "malicious_file.exe",
      suggestions: [
        "Ensure file size is under 5MB",
        "Use one of the allowed formats: jpg, jpeg, png, pdf, csv, xlsx",
        "Compress large files before uploading",
      ],
    }
  );
  next(uploadError);
};

const simulateCacheError = (req, res, next) => {
  const cacheError = new AppError(
    "Cache service is temporarily unavailable. Falling back to database.",
    503,
    "CACHE_ERROR",
    {
      cacheHost: "redis://localhost:6379",
      errorType: "ECONNREFUSED",
      errorMessage: "connect ECONNREFUSED 127.0.0.1:6379",
      fallbackEnabled: true,
      fallbackSource: "MongoDB",
      performanceImpact: "Response times may be slower than usual.",
      estimatedRecovery: "5-10 minutes",
    }
  );
  next(cacheError);
};

module.exports = {
  simulateNotFound,
  simulateServerError,
  simulateDatabaseError,
  simulateValidationError,
  simulateRateLimitError,
  simulateTokenExpiredError,
  simulatePaymentError,
  simulateShippingError,
  simulateUploadError,
  simulateCacheError,
};
