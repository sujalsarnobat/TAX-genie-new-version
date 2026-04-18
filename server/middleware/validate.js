const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Signup validation rules
const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
  handleValidationErrors,
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Personal info validation rules
const personalInfoValidation = [
  body('FirstName').trim().notEmpty().withMessage('First name is required').escape(),
  body('LastName').trim().notEmpty().withMessage('Last name is required').escape(),
  body('Email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('AadharNo').isNumeric().withMessage('Aadhaar must be numeric')
    .isLength({ min: 12, max: 12 }).withMessage('Aadhaar must be 12 digits'),
  body('PanCard').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN format (e.g., ABCDE1234F)'),
  body('MobileNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid mobile number (10 digits, starts with 6-9)'),
  body('PinCode').matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('DateOfBirth').trim().notEmpty().withMessage('Date of birth is required'),
  body('FatherName').trim().notEmpty().withMessage("Father's name is required").escape(),
  body('Gender').trim().notEmpty().withMessage('Gender is required'),
  body('MaritalStatus').trim().notEmpty().withMessage('Marital status is required'),
  body('Address').trim().notEmpty().withMessage('Address is required').escape(),
  body('City').trim().notEmpty().withMessage('City is required').escape(),
  body('selectedState').trim().notEmpty().withMessage('State is required'),
  handleValidationErrors,
];

// Tax calculation validation (basic checks)
const taxCalculationValidation = [
  body('Token').trim().notEmpty().withMessage('Token is required'),
  body('Email').optional().isEmail().withMessage('Valid email required'),
  body('AadharNo').optional().isNumeric().withMessage('Aadhaar must be numeric'),
  body('PanCard').optional().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN format'),
  handleValidationErrors,
];

// Token lookup validation
const tokenLookupValidation = [
  body('Token').trim().notEmpty().withMessage('Token is required'),
  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  personalInfoValidation,
  taxCalculationValidation,
  tokenLookupValidation,
  handleValidationErrors,
};
