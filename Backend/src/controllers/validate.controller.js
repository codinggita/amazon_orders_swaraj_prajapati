const validateService = require("../services/validate.service");
const AppError = require("../utils/AppError");

const formatErrorResponse = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: errors,
    totalErrors: errors.length
  });
};

const formatSuccessResponse = (res, extraData = {}) => {
  return res.status(200).json({
    success: true,
    message: "Validation passed. All fields are valid.",
    data: {
      validated: true,
      timestamp: new Date().toISOString(),
      ...extraData
    }
  });
};

const validateOrder = async (req, res, next) => {
  try {
    const result = validateService.validateOrder(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateOrderUpdate = async (req, res, next) => {
  try {
    const result = validateService.validateOrderUpdate(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validatePayment = async (req, res, next) => {
  try {
    const result = validateService.validatePayment(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateAddress = async (req, res, next) => {
  try {
    const result = validateService.validateAddress(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateRegister = async (req, res, next) => {
  try {
    const result = validateService.validateAuthRegister(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateLogin = async (req, res, next) => {
  try {
    const result = validateService.validateAuthLogin(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateProduct = async (req, res, next) => {
  try {
    const result = await validateService.validateProduct(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    const extraData = { fieldCount: Object.keys(req.body).length };
    if (result.warnings && result.warnings.length > 0) {
      extraData.warnings = result.warnings;
    }
    return formatSuccessResponse(res, extraData);
  } catch (error) {
    next(error);
  }
};

const validateRefund = async (req, res, next) => {
  try {
    const result = validateService.validateRefund(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { fieldCount: Object.keys(req.body).length });
  } catch (error) {
    next(error);
  }
};

const validateCoupon = async (req, res, next) => {
  try {
    const result = validateService.validateCoupon(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { 
      fieldCount: Object.keys(req.body).length,
      coupon: result.coupon
    });
  } catch (error) {
    next(error);
  }
};

const validateUpload = async (req, res, next) => {
  try {
    const result = validateService.validateUpload(req.body);
    if (!result.isValid) {
      return formatErrorResponse(res, result.errors);
    }
    return formatSuccessResponse(res, { 
      fieldCount: Object.keys(req.body).length,
      fileInfo: result.fileInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateOrder,
  validateOrderUpdate,
  validatePayment,
  validateAddress,
  validateRegister,
  validateLogin,
  validateProduct,
  validateRefund,
  validateCoupon,
  validateUpload
};
