const Order = require("../models/order.model");
const {
  isRequired, isString, minLength, maxLength, isEmail,
  isStrongPassword, isNumericString, isPositiveNumericString,
  isNonNegativeNumericString, isDateFormat, isFutureDate,
  isOneOf, isPhone, isPincode, isURL, isNonEmptyArray,
  isObject, collectErrors, fieldError
} = require("../utils/validators");

const VALID_PAYMENT_METHODS = ["UPI", "Debit Card", "Credit Card", "Net Banking", "COD", "Wallet"];
const VALID_ORDER_STATUSES = ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Refunded", "Returned"];
const VALID_CURRENCIES = ["INR", "USD", "EUR", "GBP"];

const VALID_COUPONS = {
  "SAVE10": {
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 200,
    expiresAt: "2025-12-31",
    usageLimit: 100,
    description: "10% off on orders above ₹500"
  },
  "FLAT200": {
    discountType: "flat",
    discountValue: 200,
    minOrderAmount: 1000,
    maxDiscountAmount: 200,
    expiresAt: "2025-06-30",
    usageLimit: 50,
    description: "₹200 flat discount on orders above ₹1000"
  },
  "FREESHIP": {
    discountType: "shipping",
    discountValue: 100,
    minOrderAmount: 300,
    maxDiscountAmount: 100,
    expiresAt: "2025-12-31",
    usageLimit: 200,
    description: "Free shipping on orders above ₹300"
  },
  "NEWUSER50": {
    discountType: "percentage",
    discountValue: 50,
    minOrderAmount: 200,
    maxDiscountAmount: 150,
    expiresAt: "2025-12-31",
    usageLimit: 1,
    description: "50% off for new users (max ₹150)"
  }
};

const check = (errors, body, field, validations) => {
  const errs = collectErrors(validations);
  if (errs.length > 0) {
    errors.push(fieldError(field, errs[0], body[field]));
  }
};

const validateOrder = (body) => {
  let errors = [];

  check(errors, body, "OrderID", [
    () => isRequired(body.OrderID, "OrderID"),
    () => body.OrderID ? isString(body.OrderID, "OrderID") : null,
    () => typeof body.OrderID === "string" ? minLength(body.OrderID, "OrderID", 3) : null,
    () => typeof body.OrderID === "string" ? maxLength(body.OrderID, "OrderID", 50) : null
  ]);

  check(errors, body, "OrderDate", [
    () => isRequired(body.OrderDate, "OrderDate"),
    () => body.OrderDate ? isDateFormat(body.OrderDate, "OrderDate") : null
  ]);

  check(errors, body, "CustomerID", [
    () => isRequired(body.CustomerID, "CustomerID"),
    () => body.CustomerID ? isString(body.CustomerID, "CustomerID") : null,
    () => typeof body.CustomerID === "string" ? minLength(body.CustomerID, "CustomerID", 3) : null,
    () => typeof body.CustomerID === "string" ? maxLength(body.CustomerID, "CustomerID", 50) : null
  ]);

  check(errors, body, "CustomerName", [
    () => isRequired(body.CustomerName, "CustomerName"),
    () => body.CustomerName ? isString(body.CustomerName, "CustomerName") : null,
    () => typeof body.CustomerName === "string" ? minLength(body.CustomerName, "CustomerName", 2) : null,
    () => typeof body.CustomerName === "string" ? maxLength(body.CustomerName, "CustomerName", 100) : null
  ]);

  check(errors, body, "ProductID", [
    () => isRequired(body.ProductID, "ProductID"),
    () => body.ProductID ? isString(body.ProductID, "ProductID") : null,
    () => typeof body.ProductID === "string" ? minLength(body.ProductID, "ProductID", 2) : null,
    () => typeof body.ProductID === "string" ? maxLength(body.ProductID, "ProductID", 50) : null
  ]);

  check(errors, body, "ProductName", [
    () => isRequired(body.ProductName, "ProductName"),
    () => body.ProductName ? isString(body.ProductName, "ProductName") : null,
    () => typeof body.ProductName === "string" ? minLength(body.ProductName, "ProductName", 2) : null,
    () => typeof body.ProductName === "string" ? maxLength(body.ProductName, "ProductName", 200) : null
  ]);

  check(errors, body, "Category", [
    () => isRequired(body.Category, "Category"),
    () => body.Category ? isString(body.Category, "Category") : null,
    () => typeof body.Category === "string" ? minLength(body.Category, "Category", 2) : null,
    () => typeof body.Category === "string" ? maxLength(body.Category, "Category", 100) : null
  ]);

  check(errors, body, "Brand", [
    () => isRequired(body.Brand, "Brand"),
    () => body.Brand ? isString(body.Brand, "Brand") : null,
    () => typeof body.Brand === "string" ? minLength(body.Brand, "Brand", 1) : null,
    () => typeof body.Brand === "string" ? maxLength(body.Brand, "Brand", 100) : null
  ]);

  check(errors, body, "Quantity", [
    () => isRequired(body.Quantity, "Quantity"),
    () => body.Quantity !== undefined && body.Quantity !== null && body.Quantity !== "" ? isPositiveNumericString(String(body.Quantity), "Quantity") : null
  ]);

  check(errors, body, "UnitPrice", [
    () => isRequired(body.UnitPrice, "UnitPrice"),
    () => body.UnitPrice !== undefined && body.UnitPrice !== null && body.UnitPrice !== "" ? isPositiveNumericString(String(body.UnitPrice), "UnitPrice") : null
  ]);

  if (body.Discount !== undefined) {
    check(errors, body, "Discount", [
      () => isNonNegativeNumericString(String(body.Discount), "Discount"),
      () => {
         if (!isNonNegativeNumericString(String(body.Discount), "Discount") && body.UnitPrice && !isPositiveNumericString(String(body.UnitPrice), "UnitPrice")) {
             if (parseFloat(body.Discount) > parseFloat(body.UnitPrice)) {
                 return "Discount must be <= UnitPrice value";
             }
         }
         return null;
      }
    ]);
  }

  if (body.Tax !== undefined) {
    check(errors, body, "Tax", [
      () => isNonNegativeNumericString(String(body.Tax), "Tax")
    ]);
  }

  if (body.ShippingCost !== undefined) {
    check(errors, body, "ShippingCost", [
      () => isNonNegativeNumericString(String(body.ShippingCost), "ShippingCost")
    ]);
  }

  check(errors, body, "TotalAmount", [
    () => isRequired(body.TotalAmount, "TotalAmount"),
    () => body.TotalAmount !== undefined && body.TotalAmount !== null && body.TotalAmount !== "" ? isPositiveNumericString(String(body.TotalAmount), "TotalAmount") : null
  ]);

  check(errors, body, "PaymentMethod", [
    () => isRequired(body.PaymentMethod, "PaymentMethod"),
    () => body.PaymentMethod ? isOneOf(body.PaymentMethod, "PaymentMethod", VALID_PAYMENT_METHODS) : null
  ]);

  check(errors, body, "OrderStatus", [
    () => isRequired(body.OrderStatus, "OrderStatus"),
    () => body.OrderStatus ? isOneOf(body.OrderStatus, "OrderStatus", VALID_ORDER_STATUSES) : null
  ]);

  check(errors, body, "City", [
    () => isRequired(body.City, "City"),
    () => body.City ? isString(body.City, "City") : null,
    () => typeof body.City === "string" ? minLength(body.City, "City", 2) : null,
    () => typeof body.City === "string" ? maxLength(body.City, "City", 100) : null
  ]);

  check(errors, body, "State", [
    () => isRequired(body.State, "State"),
    () => body.State ? isString(body.State, "State") : null,
    () => typeof body.State === "string" ? minLength(body.State, "State", 2) : null,
    () => typeof body.State === "string" ? maxLength(body.State, "State", 100) : null
  ]);

  check(errors, body, "Country", [
    () => isRequired(body.Country, "Country"),
    () => body.Country ? isString(body.Country, "Country") : null,
    () => typeof body.Country === "string" ? minLength(body.Country, "Country", 2) : null,
    () => typeof body.Country === "string" ? maxLength(body.Country, "Country", 100) : null
  ]);

  check(errors, body, "SellerID", [
    () => isRequired(body.SellerID, "SellerID"),
    () => body.SellerID ? isString(body.SellerID, "SellerID") : null,
    () => typeof body.SellerID === "string" ? minLength(body.SellerID, "SellerID", 3) : null,
    () => typeof body.SellerID === "string" ? maxLength(body.SellerID, "SellerID", 50) : null
  ]);

  if (body.Discount !== undefined && parseFloat(body.Discount) > 0) {
    if (!errors.some(e => ["TotalAmount", "UnitPrice", "Quantity", "Discount", "Tax", "ShippingCost"].includes(e.field))) {
      const unitPrice = parseFloat(body.UnitPrice);
      const quantity = parseFloat(body.Quantity);
      const discount = parseFloat(body.Discount);
      const tax = body.Tax ? parseFloat(body.Tax) : 0;
      const shippingCost = body.ShippingCost ? parseFloat(body.ShippingCost) : 0;
      const totalAmount = parseFloat(body.TotalAmount);
      
      const calculated = (unitPrice * quantity) - discount + tax + shippingCost;
      if (Math.abs(calculated - totalAmount) > 1.00) {
        errors.push(fieldError("TotalAmount", "TotalAmount does not match calculated value", body.TotalAmount));
      }
    }
  }

  return { isValid: errors.length === 0, errors };
};

const validateOrderUpdate = (body) => {
  let errors = [];

  if (!body || Object.keys(body).length === 0) {
    errors.push(fieldError("body", "Request body cannot be empty"));
    return { isValid: false, errors };
  }

  const notAllowed = ["OrderID", "_id", "statusHistory"];
  notAllowed.forEach(field => {
    if (body[field] !== undefined) {
      errors.push(fieldError(field, `${field} is not allowed to be updated`, body[field]));
    }
  });

  if (body.OrderDate !== undefined) check(errors, body, "OrderDate", [() => isDateFormat(body.OrderDate, "OrderDate")]);
  if (body.Quantity !== undefined) check(errors, body, "Quantity", [() => isPositiveNumericString(String(body.Quantity), "Quantity")]);
  if (body.UnitPrice !== undefined) check(errors, body, "UnitPrice", [() => isPositiveNumericString(String(body.UnitPrice), "UnitPrice")]);
  if (body.Discount !== undefined) check(errors, body, "Discount", [() => isNonNegativeNumericString(String(body.Discount), "Discount")]);
  if (body.Tax !== undefined) check(errors, body, "Tax", [() => isNonNegativeNumericString(String(body.Tax), "Tax")]);
  if (body.ShippingCost !== undefined) check(errors, body, "ShippingCost", [() => isNonNegativeNumericString(String(body.ShippingCost), "ShippingCost")]);
  if (body.TotalAmount !== undefined) check(errors, body, "TotalAmount", [() => isPositiveNumericString(String(body.TotalAmount), "TotalAmount")]);
  if (body.PaymentMethod !== undefined) check(errors, body, "PaymentMethod", [() => isOneOf(body.PaymentMethod, "PaymentMethod", VALID_PAYMENT_METHODS)]);
  if (body.OrderStatus !== undefined) check(errors, body, "OrderStatus", [() => isOneOf(body.OrderStatus, "OrderStatus", VALID_ORDER_STATUSES)]);
  if (body.CustomerName !== undefined) check(errors, body, "CustomerName", [() => isString(body.CustomerName, "CustomerName"), () => minLength(body.CustomerName, "CustomerName", 2), () => maxLength(body.CustomerName, "CustomerName", 100)]);
  if (body.ProductName !== undefined) check(errors, body, "ProductName", [() => isString(body.ProductName, "ProductName"), () => minLength(body.ProductName, "ProductName", 2), () => maxLength(body.ProductName, "ProductName", 200)]);
  if (body.City !== undefined) check(errors, body, "City", [() => isString(body.City, "City"), () => minLength(body.City, "City", 2), () => maxLength(body.City, "City", 100)]);
  if (body.State !== undefined) check(errors, body, "State", [() => isString(body.State, "State"), () => minLength(body.State, "State", 2), () => maxLength(body.State, "State", 100)]);
  if (body.Country !== undefined) check(errors, body, "Country", [() => isString(body.Country, "Country"), () => minLength(body.Country, "Country", 2), () => maxLength(body.Country, "Country", 100)]);

  return { isValid: errors.length === 0, errors };
};

const validatePayment = (body) => {
  let errors = [];

  check(errors, body, "orderID", [
    () => isRequired(body.orderID, "orderID"),
    () => body.orderID ? isString(body.orderID, "orderID") : null,
    () => typeof body.orderID === "string" ? minLength(body.orderID, "orderID", 3) : null
  ]);

  check(errors, body, "amount", [
    () => isRequired(body.amount, "amount"),
    () => body.amount !== undefined ? isPositiveNumericString(String(body.amount), "amount") : null
  ]);

  check(errors, body, "currency", [
    () => isRequired(body.currency, "currency"),
    () => body.currency ? isOneOf(body.currency, "currency", VALID_CURRENCIES) : null
  ]);

  check(errors, body, "paymentMethod", [
    () => isRequired(body.paymentMethod, "paymentMethod"),
    () => body.paymentMethod ? isOneOf(body.paymentMethod, "paymentMethod", VALID_PAYMENT_METHODS) : null
  ]);

  check(errors, body, "customerName", [
    () => isRequired(body.customerName, "customerName"),
    () => body.customerName ? isString(body.customerName, "customerName") : null,
    () => typeof body.customerName === "string" ? minLength(body.customerName, "customerName", 2) : null,
    () => typeof body.customerName === "string" ? maxLength(body.customerName, "customerName", 100) : null
  ]);

  check(errors, body, "customerEmail", [
    () => isRequired(body.customerEmail, "customerEmail"),
    () => body.customerEmail ? isEmail(body.customerEmail, "customerEmail") : null
  ]);

  if (body.paymentMethod === "Debit Card" || body.paymentMethod === "Credit Card") {
    check(errors, body, "cardNumber", [
      () => isRequired(body.cardNumber, "cardNumber"),
      () => body.cardNumber ? isString(body.cardNumber, "cardNumber") : null,
      () => typeof body.cardNumber === "string" && !/^\d{16}$/.test(body.cardNumber) ? "cardNumber must be 16-digit numeric string (no spaces)" : null
    ]);

    check(errors, body, "cardExpiry", [
      () => isRequired(body.cardExpiry, "cardExpiry"),
      () => body.cardExpiry ? isString(body.cardExpiry, "cardExpiry") : null,
      () => {
        if (typeof body.cardExpiry !== "string" || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(body.cardExpiry)) {
          return "cardExpiry must be in MM/YY format";
        }
        const [month, year] = body.cardExpiry.split("/");
        const expiryDate = new Date(`20${year}`, parseInt(month));
        const now = new Date();
        if (expiryDate <= now) {
          return "cardExpiry must be a future date";
        }
        return null;
      }
    ]);

    check(errors, body, "cardCVV", [
      () => isRequired(body.cardCVV, "cardCVV"),
      () => body.cardCVV ? isString(body.cardCVV, "cardCVV") : null,
      () => typeof body.cardCVV === "string" && !/^\d{3,4}$/.test(body.cardCVV) ? "cardCVV must be 3 or 4 digits" : null
    ]);

    check(errors, body, "cardHolderName", [
      () => isRequired(body.cardHolderName, "cardHolderName"),
      () => body.cardHolderName ? isString(body.cardHolderName, "cardHolderName") : null,
      () => typeof body.cardHolderName === "string" ? minLength(body.cardHolderName, "cardHolderName", 2) : null,
      () => typeof body.cardHolderName === "string" ? maxLength(body.cardHolderName, "cardHolderName", 100) : null
    ]);
  } else if (body.paymentMethod === "UPI") {
    check(errors, body, "upiID", [
      () => isRequired(body.upiID, "upiID"),
      () => body.upiID ? isString(body.upiID, "upiID") : null,
      () => typeof body.upiID === "string" && !/^[\w.-]+@[\w.-]+$/.test(body.upiID) ? "upiID must match UPI format" : null
    ]);
  } else if (body.paymentMethod === "Net Banking") {
    check(errors, body, "bankName", [
      () => isRequired(body.bankName, "bankName"),
      () => body.bankName ? isString(body.bankName, "bankName") : null,
      () => typeof body.bankName === "string" ? minLength(body.bankName, "bankName", 2) : null,
      () => typeof body.bankName === "string" ? maxLength(body.bankName, "bankName", 100) : null
    ]);
    check(errors, body, "accountNumber", [
      () => isRequired(body.accountNumber, "accountNumber"),
      () => body.accountNumber ? isString(body.accountNumber, "accountNumber") : null,
      () => typeof body.accountNumber === "string" && !/^\d{9,18}$/.test(body.accountNumber) ? "accountNumber must be a 9-18 digit numeric string" : null
    ]);
  }

  return { isValid: errors.length === 0, errors };
};

const validateAddress = (body) => {
  let errors = [];

  check(errors, body, "fullName", [
    () => isRequired(body.fullName, "fullName"),
    () => body.fullName ? isString(body.fullName, "fullName") : null,
    () => typeof body.fullName === "string" ? minLength(body.fullName, "fullName", 2) : null,
    () => typeof body.fullName === "string" ? maxLength(body.fullName, "fullName", 100) : null,
    () => typeof body.fullName === "string" && !/^[a-zA-Z\s]+$/.test(body.fullName) ? "fullName must contain only letters and spaces" : null
  ]);

  check(errors, body, "phone", [
    () => isRequired(body.phone, "phone"),
    () => body.phone ? isPhone(body.phone, "phone") : null,
    () => typeof body.phone === "string" && /^(\d)\1+$/.test(body.phone.replace(/\D/g, "")) ? "phone cannot be all same digits" : null
  ]);

  check(errors, body, "addressLine1", [
    () => isRequired(body.addressLine1, "addressLine1"),
    () => body.addressLine1 ? isString(body.addressLine1, "addressLine1") : null,
    () => typeof body.addressLine1 === "string" ? minLength(body.addressLine1, "addressLine1", 5) : null,
    () => typeof body.addressLine1 === "string" ? maxLength(body.addressLine1, "addressLine1", 200) : null
  ]);

  if (body.addressLine2 !== undefined) {
    check(errors, body, "addressLine2", [
      () => isString(body.addressLine2, "addressLine2"),
      () => typeof body.addressLine2 === "string" ? maxLength(body.addressLine2, "addressLine2", 200) : null
    ]);
  }

  check(errors, body, "city", [
    () => isRequired(body.city, "city"),
    () => body.city ? isString(body.city, "city") : null,
    () => typeof body.city === "string" ? minLength(body.city, "city", 2) : null,
    () => typeof body.city === "string" ? maxLength(body.city, "city", 100) : null
  ]);

  check(errors, body, "state", [
    () => isRequired(body.state, "state"),
    () => body.state ? isString(body.state, "state") : null,
    () => typeof body.state === "string" ? minLength(body.state, "state", 2) : null,
    () => typeof body.state === "string" ? maxLength(body.state, "state", 100) : null
  ]);

  check(errors, body, "country", [
    () => isRequired(body.country, "country"),
    () => body.country ? isString(body.country, "country") : null,
    () => typeof body.country === "string" ? minLength(body.country, "country", 2) : null,
    () => typeof body.country === "string" ? maxLength(body.country, "country", 100) : null
  ]);

  check(errors, body, "pincode", [
    () => isRequired(body.pincode, "pincode"),
    () => body.pincode ? isPincode(String(body.pincode), "pincode") : null
  ]);

  check(errors, body, "addressType", [
    () => isRequired(body.addressType, "addressType"),
    () => body.addressType ? isOneOf(body.addressType, "addressType", ["home", "work", "other"]) : null
  ]);

  return { isValid: errors.length === 0, errors };
};

const validateAuthRegister = (body) => {
  let errors = [];

  check(errors, body, "name", [
    () => isRequired(body.name, "name"),
    () => body.name ? isString(body.name, "name") : null,
    () => typeof body.name === "string" ? minLength(body.name, "name", 2) : null,
    () => typeof body.name === "string" ? maxLength(body.name, "name", 50) : null,
    () => typeof body.name === "string" && !/^[a-zA-Z\s]+$/.test(body.name) ? "name must contain only letters and spaces" : null
  ]);

  const disposableDomains = ["mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com","throwaway.email"];
  
  check(errors, body, "email", [
    () => isRequired(body.email, "email"),
    () => body.email ? isEmail(body.email, "email") : null,
    () => typeof body.email === "string" && body.email !== body.email.toLowerCase() ? "email must be lowercase" : null,
    () => {
      if (typeof body.email === "string" && body.email.includes("@")) {
        const domain = body.email.split("@")[1];
        if (disposableDomains.includes(domain)) {
          return "Disposable email addresses are not allowed";
        }
      }
      return null;
    }
  ]);

  const commonPasswords = ["password123","Password1!","Admin@123","Welcome1!","Test@1234","India@123"];

  check(errors, body, "password", [
    () => isRequired(body.password, "password"),
    () => body.password ? isStrongPassword(body.password, "password") : null,
    () => {
      if (typeof body.password === "string" && typeof body.name === "string" && body.name) {
        if (body.password.toLowerCase().includes(body.name.toLowerCase())) {
          return "Password must not contain your name";
        }
      }
      return null;
    },
    () => {
      if (typeof body.password === "string" && commonPasswords.includes(body.password)) {
        return "Password is too common. Choose a stronger password.";
      }
      return null;
    }
  ]);

  check(errors, body, "confirmPassword", [
    () => isRequired(body.confirmPassword, "confirmPassword"),
    () => typeof body.confirmPassword === "string" && typeof body.password === "string" && body.confirmPassword !== body.password ? "confirmPassword must match password exactly" : null
  ]);

  return { isValid: errors.length === 0, errors };
};

const validateAuthLogin = (body) => {
  let errors = [];

  check(errors, body, "email", [
    () => isRequired(body.email, "email"),
    () => body.email ? isEmail(body.email, "email") : null
  ]);

  check(errors, body, "password", [
    () => isRequired(body.password, "password"),
    () => body.password ? isString(body.password, "password") : null,
    () => typeof body.password === "string" ? minLength(body.password, "password", 1) : null
  ]);

  if (body.rememberMe !== undefined) {
    check(errors, body, "rememberMe", [
      () => typeof body.rememberMe !== "boolean" ? "rememberMe must be a boolean" : null
    ]);
  }

  return { isValid: errors.length === 0, errors };
};

const validateProduct = async (body) => {
  let errors = [];
  let warnings = [];

  check(errors, body, "productID", [
    () => isRequired(body.productID, "productID"),
    () => body.productID ? isString(body.productID, "productID") : null,
    () => typeof body.productID === "string" ? minLength(body.productID, "productID", 2) : null,
    () => typeof body.productID === "string" ? maxLength(body.productID, "productID", 50) : null
  ]);

  check(errors, body, "productName", [
    () => isRequired(body.productName, "productName"),
    () => body.productName ? isString(body.productName, "productName") : null,
    () => typeof body.productName === "string" ? minLength(body.productName, "productName", 2) : null,
    () => typeof body.productName === "string" ? maxLength(body.productName, "productName", 200) : null
  ]);

  check(errors, body, "category", [
    () => isRequired(body.category, "category"),
    () => body.category ? isString(body.category, "category") : null,
    () => typeof body.category === "string" ? minLength(body.category, "category", 2) : null,
    () => typeof body.category === "string" ? maxLength(body.category, "category", 100) : null
  ]);

  check(errors, body, "brand", [
    () => isRequired(body.brand, "brand"),
    () => body.brand ? isString(body.brand, "brand") : null,
    () => typeof body.brand === "string" ? minLength(body.brand, "brand", 1) : null,
    () => typeof body.brand === "string" ? maxLength(body.brand, "brand", 100) : null
  ]);

  check(errors, body, "unitPrice", [
    () => isRequired(body.unitPrice, "unitPrice"),
    () => body.unitPrice !== undefined ? isPositiveNumericString(String(body.unitPrice), "unitPrice") : null,
    () => {
      if (body.unitPrice !== undefined && isPositiveNumericString(String(body.unitPrice), "unitPrice") === null) {
        if (parseFloat(body.unitPrice) > 999999.99) {
          return "unitPrice cannot exceed 999999.99";
        }
      }
      return null;
    }
  ]);

  check(errors, body, "quantity", [
    () => isRequired(body.quantity, "quantity"),
    () => body.quantity !== undefined ? isPositiveNumericString(String(body.quantity), "quantity") : null,
    () => {
      if (body.quantity !== undefined && isPositiveNumericString(String(body.quantity), "quantity") === null) {
        if (parseInt(body.quantity) != parseFloat(body.quantity)) {
          return "quantity must be a whole number";
        }
      }
      return null;
    }
  ]);

  if (body.description !== undefined) {
    check(errors, body, "description", [
      () => isString(body.description, "description"),
      () => typeof body.description === "string" ? maxLength(body.description, "description", 1000) : null
    ]);
  }

  if (errors.length === 0 && body.productName) {
    try {
      const existing = await Order.findOne({ ProductName: new RegExp(`^${body.productName}$`, "i") });
      if (existing) {
        warnings.push(fieldError("productName", "A product with similar name already exists in orders", body.productName));
      }
    } catch (e) {
      // Ignore db errors for validation
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
};

const validateRefund = (body) => {
  let errors = [];

  check(errors, body, "orderID", [
    () => isRequired(body.orderID, "orderID"),
    () => body.orderID ? isString(body.orderID, "orderID") : null,
    () => typeof body.orderID === "string" ? minLength(body.orderID, "orderID", 3) : null
  ]);

  const genericReasons = ["bad", "no", "don't want", "wrong", "bad product"];

  check(errors, body, "reason", [
    () => isRequired(body.reason, "reason"),
    () => body.reason ? isString(body.reason, "reason") : null,
    () => typeof body.reason === "string" ? minLength(body.reason, "reason", 10) : null,
    () => typeof body.reason === "string" ? maxLength(body.reason, "reason", 500) : null,
    () => {
      if (typeof body.reason === "string") {
        if (genericReasons.includes(body.reason.toLowerCase().trim()) || body.reason.length < 10) {
          return "Please provide a detailed reason (minimum 10 characters)";
        }
      }
      return null;
    }
  ]);

  check(errors, body, "refundAmount", [
    () => isRequired(body.refundAmount, "refundAmount"),
    () => body.refundAmount !== undefined ? isPositiveNumericString(String(body.refundAmount), "refundAmount") : null,
    () => {
       if (body.refundAmount !== undefined && isPositiveNumericString(String(body.refundAmount), "refundAmount") === null) {
          if (parseFloat(body.refundAmount) > 100000) {
            return "refundAmount exceeds maximum refund limit of 100000";
          }
       }
       return null;
    }
  ]);

  check(errors, body, "refundMethod", [
    () => isRequired(body.refundMethod, "refundMethod"),
    () => body.refundMethod ? isOneOf(body.refundMethod, "refundMethod", ["Original Payment Method", "Wallet", "Bank Transfer"]) : null
  ]);

  check(errors, body, "customerEmail", [
    () => isRequired(body.customerEmail, "customerEmail"),
    () => body.customerEmail ? isEmail(body.customerEmail, "customerEmail") : null
  ]);

  if (body.refundMethod === "Bank Transfer") {
    check(errors, body, "accountNumber", [
      () => isRequired(body.accountNumber, "accountNumber"),
      () => body.accountNumber ? isString(body.accountNumber, "accountNumber") : null,
      () => typeof body.accountNumber === "string" && !/^\d{9,18}$/.test(body.accountNumber) ? "accountNumber must be a 9-18 digit numeric string" : null
    ]);
    check(errors, body, "ifscCode", [
      () => isRequired(body.ifscCode, "ifscCode"),
      () => body.ifscCode ? isString(body.ifscCode, "ifscCode") : null,
      () => typeof body.ifscCode === "string" && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(body.ifscCode) ? "ifscCode must match IFSC format" : null
    ]);
    check(errors, body, "bankName", [
      () => isRequired(body.bankName, "bankName"),
      () => body.bankName ? isString(body.bankName, "bankName") : null,
      () => typeof body.bankName === "string" ? minLength(body.bankName, "bankName", 2) : null,
      () => typeof body.bankName === "string" ? maxLength(body.bankName, "bankName", 100) : null
    ]);
    check(errors, body, "accountHolder", [
      () => isRequired(body.accountHolder, "accountHolder"),
      () => body.accountHolder ? isString(body.accountHolder, "accountHolder") : null,
      () => typeof body.accountHolder === "string" ? minLength(body.accountHolder, "accountHolder", 2) : null,
      () => typeof body.accountHolder === "string" ? maxLength(body.accountHolder, "accountHolder", 100) : null
    ]);
  }

  return { isValid: errors.length === 0, errors };
};

const validateCoupon = (body) => {
  let errors = [];

  check(errors, body, "couponCode", [
    () => isRequired(body.couponCode, "couponCode"),
    () => body.couponCode ? isString(body.couponCode, "couponCode") : null
  ]);

  check(errors, body, "orderAmount", [
    () => isRequired(body.orderAmount, "orderAmount"),
    () => body.orderAmount !== undefined ? isPositiveNumericString(String(body.orderAmount), "orderAmount") : null
  ]);

  check(errors, body, "customerEmail", [
    () => isRequired(body.customerEmail, "customerEmail"),
    () => body.customerEmail ? isEmail(body.customerEmail, "customerEmail") : null
  ]);

  if (errors.length > 0) return { isValid: false, errors };

  const code = body.couponCode.toUpperCase();
  const coupon = VALID_COUPONS[code];

  if (!coupon) {
    errors.push(fieldError("couponCode", "Invalid coupon code", body.couponCode));
    return { isValid: false, errors };
  }

  const today = new Date().toISOString().split("T")[0];
  if (coupon.expiresAt < today) {
    errors.push(fieldError("couponCode", "This coupon has expired", body.couponCode));
    return { isValid: false, errors };
  }

  const orderAmount = parseFloat(body.orderAmount);
  if (orderAmount < coupon.minOrderAmount) {
    errors.push(fieldError("orderAmount", `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`, body.orderAmount));
    return { isValid: false, errors };
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.min((coupon.discountValue / 100) * orderAmount, coupon.maxDiscountAmount);
  } else if (coupon.discountType === "flat") {
    discount = Math.min(coupon.discountValue, coupon.maxDiscountAmount);
  } else if (coupon.discountType === "shipping") {
    discount = Math.min(coupon.discountValue, coupon.maxDiscountAmount);
  }
  discount = parseFloat(discount.toFixed(2));

  return {
    isValid: true,
    errors: [],
    coupon: {
      code: code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description,
      calculatedDiscount: discount,
      finalAmount: parseFloat((orderAmount - discount).toFixed(2)),
      expiresAt: coupon.expiresAt
    }
  };
};

const validateUpload = (body) => {
  let errors = [];

  check(errors, body, "fileName", [
    () => isRequired(body.fileName, "fileName"),
    () => body.fileName ? isString(body.fileName, "fileName") : null,
    () => typeof body.fileName === "string" ? minLength(body.fileName, "fileName", 1) : null,
    () => typeof body.fileName === "string" ? maxLength(body.fileName, "fileName", 255) : null,
    () => typeof body.fileName === "string" && /[<>:"/\\|?*\x00-\x1f]/.test(body.fileName) ? "fileName contains invalid characters" : null
  ]);

  check(errors, body, "fileSize", [
    () => isRequired(body.fileSize, "fileSize"),
    () => body.fileSize !== undefined && typeof body.fileSize !== "number" ? "fileSize must be a positive number (not string)" : null,
    () => typeof body.fileSize === "number" && body.fileSize <= 0 ? "fileSize must be > 0" : null
  ]);

  check(errors, body, "mimeType", [
    () => isRequired(body.mimeType, "mimeType"),
    () => body.mimeType ? isString(body.mimeType, "mimeType") : null
  ]);

  const validUploadTypes = ["invoice", "profile", "product", "report", "bulk-import"];
  check(errors, body, "uploadType", [
    () => isRequired(body.uploadType, "uploadType"),
    () => body.uploadType ? isOneOf(body.uploadType, "uploadType", validUploadTypes) : null
  ]);

  if (errors.length > 0) return { isValid: false, errors };

  const { fileName, fileSize, mimeType, uploadType } = body;
  
  let allowedMimeTypes = [];
  let maxSizeBytes = 0;
  let allowedExtensions = [];

  if (uploadType === "invoice" || uploadType === "report") {
    allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    maxSizeBytes = 5 * 1024 * 1024;
    allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
  } else if (uploadType === "profile") {
    allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    maxSizeBytes = 2 * 1024 * 1024;
    allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  } else if (uploadType === "product") {
    allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    maxSizeBytes = 10 * 1024 * 1024;
    allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  } else if (uploadType === "bulk-import") {
    allowedMimeTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    maxSizeBytes = 50 * 1024 * 1024;
    allowedExtensions = [".csv", ".xlsx"];
  }

  if (!allowedMimeTypes.includes(mimeType)) {
    errors.push(fieldError("mimeType", `${mimeType} not allowed for ${uploadType}. Allowed: ${allowedMimeTypes.join(", ")}`, mimeType));
  }

  if (fileSize > maxSizeBytes) {
    errors.push(fieldError("fileSize", `File size ${(fileSize/1024/1024).toFixed(2)}MB exceeds maximum ${maxSizeBytes/1024/1024}MB`, fileSize));
  }

  const ext = "." + fileName.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    errors.push(fieldError("fileName", `File extension ${ext} not allowed for ${uploadType}`, fileName));
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    errors: [],
    fileInfo: {
      fileName,
      fileSizeMB: (fileSize/1024/1024).toFixed(2),
      mimeType,
      uploadType,
      extension: ext,
      maxAllowedMB: maxSizeBytes / 1024 / 1024,
      withinLimit: true
    }
  };
};

module.exports = {
  validateOrder,
  validateOrderUpdate,
  validatePayment,
  validateAddress,
  validateAuthRegister,
  validateAuthLogin,
  validateProduct,
  validateRefund,
  validateCoupon,
  validateUpload
};
