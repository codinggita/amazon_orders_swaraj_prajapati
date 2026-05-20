// String validators
const isRequired = (value, fieldName) =>
  value === undefined || value === null || value === ""
    ? `${fieldName} is required`
    : null;

const isString = (value, fieldName) =>
  typeof value !== "string" ? `${fieldName} must be a string` : null;

const minLength = (value, fieldName, min) =>
  typeof value === "string" && value.trim().length < min
    ? `${fieldName} must be at least ${min} characters`
    : null;

const maxLength = (value, fieldName, max) =>
  typeof value === "string" && value.trim().length > max
    ? `${fieldName} must not exceed ${max} characters`
    : null;

// Email validator
const isEmail = (value, fieldName) => {
  const regex = /^\S+@\S+\.\S+$/;
  return !regex.test(value) ? `${fieldName} must be a valid email address` : null;
};

// Password strength validator
const isStrongPassword = (value, fieldName) => {
  if (typeof value !== "string") return `${fieldName} must be a string`;
  if (value.length < 8) return `${fieldName} must be at least 8 characters`;
  if (!/[A-Z]/.test(value)) return `${fieldName} must contain at least one uppercase letter`;
  if (!/[0-9]/.test(value)) return `${fieldName} must contain at least one number`;
  if (!/[@$!%*?&]/.test(value)) return `${fieldName} must contain at least one special character (@$!%*?&)`;
  return null;
};

// Numeric string validator (for fields stored as String but must be numeric)
const isNumericString = (value, fieldName) => {
  if (typeof value !== "string") return `${fieldName} must be a string`;
  if (isNaN(parseFloat(value)) || !isFinite(value))
    return `${fieldName} must be a valid numeric value`;
  return null;
};

// Positive numeric string validator
const isPositiveNumericString = (value, fieldName) => {
  const err = isNumericString(value, fieldName);
  if (err) return err;
  if (parseFloat(value) <= 0) return `${fieldName} must be greater than 0`;
  return null;
};

// Non-negative numeric string (0 is allowed)
const isNonNegativeNumericString = (value, fieldName) => {
  const err = isNumericString(value, fieldName);
  if (err) return err;
  if (parseFloat(value) < 0) return `${fieldName} must be 0 or greater`;
  return null;
};

// Date format validator (YYYY-MM-DD)
const isDateFormat = (value, fieldName) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return `${fieldName} must be in YYYY-MM-DD format`;
  const date = new Date(value);
  if (isNaN(date.getTime())) return `${fieldName} must be a valid date`;
  return null;
};

// Future date validator
const isFutureDate = (value, fieldName) => {
  const err = isDateFormat(value, fieldName);
  if (err) return err;
  if (new Date(value) <= new Date()) return `${fieldName} must be a future date`;
  return null;
};

// Enum validator
const isOneOf = (value, fieldName, allowedValues) => {
  if (!allowedValues.includes(value))
    return `${fieldName} must be one of: ${allowedValues.join(", ")}`;
  return null;
};

// Phone number validator (10 digit Indian format or international)
const isPhone = (value, fieldName) => {
  const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return !regex.test(value.replace(/\s/g, ""))
    ? `${fieldName} must be a valid phone number (10 digits)`
    : null;
};

// Pincode validator (6 digit Indian pincode)
const isPincode = (value, fieldName) => {
  const regex = /^\d{6}$/;
  return !regex.test(value) ? `${fieldName} must be a valid 6-digit pincode` : null;
};

// URL validator
const isURL = (value, fieldName) => {
  try {
    new URL(value);
    return null;
  } catch {
    return `${fieldName} must be a valid URL`;
  }
};

// Array validator
const isNonEmptyArray = (value, fieldName) => {
  if (!Array.isArray(value) || value.length === 0)
    return `${fieldName} must be a non-empty array`;
  return null;
};

// Object validator
const isObject = (value, fieldName) => {
  if (typeof value !== "object" || Array.isArray(value) || value === null)
    return `${fieldName} must be a valid object`;
  return null;
};

// Collect errors helper - runs multiple validators and collects ALL errors
const collectErrors = (validations) => {
  return validations
    .map(fn => fn())
    .filter(err => err !== null);
};

// Build standardized field error object
const fieldError = (field, message, value = undefined) => ({ field, message, value });

module.exports = {
  isRequired, isString, minLength, maxLength, isEmail,
  isStrongPassword, isNumericString, isPositiveNumericString,
  isNonNegativeNumericString, isDateFormat, isFutureDate,
  isOneOf, isPhone, isPincode, isURL, isNonEmptyArray,
  isObject, collectErrors, fieldError
};
