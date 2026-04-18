const taxModel = require('../Models/taxModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { generateITR1JSON } = require('../utils/itrGenerator');

// Helper to convert Mongoose field names to SQL field names
const convertRequestToDbFormat = (data) => {
  const fieldMap = {
    FirstName: 'first_name',
    MiddleName: 'middle_name',
    LastName: 'last_name',
    DateOfBirth: 'date_of_birth',
    FatherName: 'father_name',
    Gender: 'gender',
    MaritalStatus: 'marital_status',
    AadharNo: 'aadhaar_no',
    PanCard: 'pan_card',
    MobileNo: 'mobile_no',
    Email: 'email',
    Address: 'address',
    PermanentAddress: 'permanent_address',
    City: 'city',
    selectedState: 'state',
    PinCode: 'pin_code',
    employerName: 'employer_name',
    employerAddress: 'employer_address',
    employerPanNumber: 'employer_pan_number',
    tanNumber: 'tan_number',
    employeeReferenceNo: 'employee_reference_no',
    Year: 'year',
    TaxDeducted: 'tax_deducted',
    Salary: 'salary',
    PrerequisiteIncome: 'prerequisite_income',
    ProfitIncome: 'profit_income',
    OtherIncome: 'other_income',
    HRA: 'hra',
    LTA: 'lta',
    OtherExemptedAllowances: 'other_exempted_allowances',
    ProfessionalTax: 'professional_tax',
    OwnHouseIncome: 'own_house_income',
    RentedHouseIncome: 'rented_house_income',
    DeemdedHouseIncome: 'deemed_house_income',
    OldFinalTax: 'old_final_tax',
    OldFinalCess: 'old_final_cess',
    NewFinalTax: 'new_final_tax',
    NewFinalCess: 'new_final_cess',
    PreferredSystem: 'preferred_system',
    TotalTaxableIncome: 'total_taxable_income',
    TotalIncome: 'total_income',
    TotalDeductions: 'total_deductions',
  };

  // Section 80 fields
  for (let i = 1; i <= 100; i++) {
    const section = `section${i}`;
    fieldMap[section] = `section_${i}`;
  }
  
  fieldMap.section80C = 'section_80c';
  fieldMap.section80CCC = 'section_80ccc';
  fieldMap.section80CCD1 = 'section_80ccd1';
  fieldMap.section80CCD2 = 'section_80ccd2';
  fieldMap.section80CCD1B = 'section_80ccd1b';
  fieldMap.section80CCF = 'section_80ccf';
  fieldMap.section80CCG = 'section_80ccg';
  fieldMap.section80D = 'section_80d';
  fieldMap.section80DD = 'section_80dd';
  fieldMap.section80DDB = 'section_80ddb';
  fieldMap.section80E = 'section_80e';
  fieldMap.section80EE = 'section_80ee';
  fieldMap.section80G = 'section_80g';
  fieldMap.section80GGA = 'section_80gga';
  fieldMap.section80GGC = 'section_80ggc';
  fieldMap.section80QQB = 'section_80qqb';
  fieldMap.section80RRB = 'section_80rrb';
  fieldMap.section80TTA = 'section_80tta';
  fieldMap.section80U = 'section_80u';

  const converted = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = fieldMap[key] || key;
    converted[dbKey] = value;
  }
  return converted;
};

// S-01: Tax Calculation
exports.Tax = catchAsync(async (req, res, next) => {
  const taxData = convertRequestToDbFormat(req.body);
  
  const result = await taxModel.createTaxCalculation(taxData);
  if (!result) {
    throw new AppError('Failed to save tax calculation', 500);
  }

  res.status(201).json({ status: 'success', data: result });
});

// S-07: Get Tax Details by Token
exports.Taxbody = catchAsync(async (req, res, next) => {
  const { Token } = req.body;
  
  const taxbody = await taxModel.getTaxByToken(Token);
  if (!taxbody) {
    throw new AppError('No data found for the provided Token', 404);
  }

  res.status(200).json(taxbody);
});

// S-08: Tax Filing History
exports.getUserTaxHistory = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const result = await taxModel.getTaxHistoryByEmail(email);

  res.status(200).json({ 
    status: 'success', 
    count: result.count || 0, 
    data: result.data || [] 
  });
});

// S-18: Generate ITR-1 (Sahaj) JSON
exports.generateITR1 = catchAsync(async (req, res, next) => {
  const { Token } = req.body;
  if (!Token) {
    throw new AppError('Token is required', 400);
  }

  const taxData = await taxModel.getTaxByToken(Token);
  if (!taxData) {
    throw new AppError('No tax data found for the provided Token', 404);
  }

  const itr1 = generateITR1JSON(taxData);

  res.status(200).json({ status: 'success', data: itr1 });
});
