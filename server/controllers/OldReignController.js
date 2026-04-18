const supabase = require('../Config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to convert Mongoose field names to SQL field names (same as TaxController)
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

// Create Old Reign calculation
exports.Old = catchAsync(async (req, res, next) => {
  const oldData = convertRequestToDbFormat(req.body);
  
  const { data: result, error } = await supabase
    .from('old_reign_calculations')
    .insert([oldData])
    .select();

  if (error || !result || result.length === 0) {
    throw new AppError(error?.message || 'Failed to save old regime calculation', 500);
  }

  res.status(201).json({ status: 'success', data: result[0] });
});

// Get Old Reign calculation by Token
exports.Oldbody = catchAsync(async (req, res, next) => {
  const { Token } = req.body;
  
  const { data: oldreign, error } = await supabase
    .from('old_reign_calculations')
    .select('*')
    .eq('token', Token)
    .limit(1)
    .single();

  if (!oldreign || error) {
    throw new AppError('No data found for the provided Token', 404);
  }

  res.status(200).json(oldreign);
});


//Old Tax Reign Calculation
// const TAX_REBATE = {
//   old: 250000
// };

// function calculateOldRegimeTax(income) {
//   let totalTax = 0;

//   if (income >= TAX_REBATE.old) {
//     totalTax += calculateSlabTax(Math.min(income, 250000), 0);
//     totalTax += calculateSlabTax(Math.max(Math.min(income - 250000, 250000), 0), 0.05);
//     totalTax += calculateSlabTax(Math.max(Math.min(income - 500000, 500000), 0), 0.20);
//     totalTax += calculateSlabTax(Math.max(income - 1000000, 0), 0.30);
//   }

//   const finalTax = totalTax + calculateCess(totalTax);
  
//   return finalTax;
// }

// // Example usage for old regime
// const oldIncome = 2042000; // Replace with your actual income
// const oldRegimeTax = calculateOldRegimeTax(oldIncome);

// console.log(`Income: ₹${oldIncome}`);
// console.log(`Old Regime Tax: ₹${oldRegimeTax.toFixed(2)}`);

// function calculateSlabTax(income, rate) {
//   return income * rate;
// }

// function calculateCess(totalTax) {
//   return totalTax * 0.04;
// }



// New Tax Reign
// const TAX_REBATE = {
//   new: 700000,
// };

// function calculateNewRegimeTax(income) {
//   let totalTax = 0;

//   if (income >= TAX_REBATE.new) {
//     totalTax += calculateSlabTax(Math.min(income, 300000), 0);
//     totalTax += calculateSlabTax(
//       Math.max(Math.min(income - 300000, 300000), 0),
//       0.05
//     );
//     totalTax += calculateSlabTax(
//       Math.max(Math.min(income - 600000, 300000), 0),
//       0.1
//     );
//     totalTax += calculateSlabTax(
//       Math.max(Math.min(income - 900000, 300000), 0),
//       0.15
//     );
//     totalTax += calculateSlabTax(
//       Math.max(Math.min(income - 1200000, 300000), 0),
//       0.2
//     );
//     totalTax += calculateSlabTax(Math.max(income - 1500000, 0), 0.3);
//   }

//   const finalTax = totalTax + calculateCess(totalTax);

//   return finalTax;
// }

// function calculateSlabTax(income, rate) {
//   return income * rate;
// }

// function calculateCess(totalTax) {
//   return totalTax * 0.04;
// }

// // Example usage
// const income = 2042000; // Replace with your actual income
// const newRegimeTax = calculateNewRegimeTax(income);

// console.log(`Income: ₹${income}`);
// console.log(`New Regime Tax: ₹${newRegimeTax.toFixed(2)}`);
