const UserTaxProfile = require('../Models/UserTaxProfile');

// Example 1: Create a new tax profile with sample data
const createSampleProfile = async () => {
  try {
    const sampleProfile = new UserTaxProfile({
      userId: '507f1f77bcf86cd799439011', // Replace with actual user ID
      assessmentYear: '2024-25',
      basicSalary: 800000,
      hra: 200000,
      lta: 50000,
      otherAllowances: 30000,
      standardDeduction: 50000,
      section80C: 150000, // PPF, ELSS, Life Insurance
      section80D: 25000,  // Health Insurance
      section80E: 20000,  // Education Loan Interest
      section24B: 150000  // Home Loan Interest
    });

    // Calculate taxes for both regimes
    sampleProfile.compareRegimes();

    console.log('\n========== TAX COMPARISON EXAMPLE ==========\n');
    console.log('📊 Income Details:');
    console.log(`   Basic Salary: ₹${sampleProfile.basicSalary.toLocaleString('en-IN')}`);
    console.log(`   HRA: ₹${sampleProfile.hra.toLocaleString('en-IN')}`);
    console.log(`   LTA: ₹${sampleProfile.lta.toLocaleString('en-IN')}`);
    console.log(`   Other Allowances: ₹${sampleProfile.otherAllowances.toLocaleString('en-IN')}`);
    console.log(`   Gross Income: ₹${sampleProfile.grossTotalIncome.toLocaleString('en-IN')}`);

    console.log('\n💰 OLD TAX REGIME:');
    console.log(`   Gross Income: ₹${sampleProfile.oldRegimeTax.grossIncome.toLocaleString('en-IN')}`);
    console.log(`   Total Deductions: ₹${sampleProfile.oldRegimeTax.totalDeductions.toLocaleString('en-IN')}`);
    console.log(`   Taxable Income: ₹${sampleProfile.oldRegimeTax.taxableIncome.toLocaleString('en-IN')}`);
    console.log(`   Income Tax: ₹${sampleProfile.oldRegimeTax.incomeTax.toLocaleString('en-IN')}`);
    console.log(`   Cess (4%): ₹${sampleProfile.oldRegimeTax.cess.toLocaleString('en-IN')}`);
    console.log(`   Total Tax: ₹${sampleProfile.oldRegimeTax.totalTax.toLocaleString('en-IN')}`);

    console.log('\n✨ NEW TAX REGIME:');
    console.log(`   Gross Income: ₹${sampleProfile.newRegimeTax.grossIncome.toLocaleString('en-IN')}`);
    console.log(`   Total Deductions: ₹${sampleProfile.newRegimeTax.totalDeductions.toLocaleString('en-IN')}`);
    console.log(`   Taxable Income: ₹${sampleProfile.newRegimeTax.taxableIncome.toLocaleString('en-IN')}`);
    console.log(`   Income Tax: ₹${sampleProfile.newRegimeTax.incomeTax.toLocaleString('en-IN')}`);
    console.log(`   Cess (4%): ₹${sampleProfile.newRegimeTax.cess.toLocaleString('en-IN')}`);
    console.log(`   Total Tax: ₹${sampleProfile.newRegimeTax.totalTax.toLocaleString('en-IN')}`);

    console.log('\n🎯 RECOMMENDATION:');
    if (sampleProfile.taxSavings.regime === 'old') {
      console.log(`   ✅ OLD REGIME is better for you!`);
      console.log(`   💵 You save: ₹${sampleProfile.taxSavings.amount.toLocaleString('en-IN')} (${sampleProfile.taxSavings.percentage}%)`);
    } else if (sampleProfile.taxSavings.regime === 'new') {
      console.log(`   ✅ NEW REGIME is better for you!`);
      console.log(`   💵 You save: ₹${sampleProfile.taxSavings.amount.toLocaleString('en-IN')} (${sampleProfile.taxSavings.percentage}%)`);
    } else {
      console.log(`   ⚖️ Both regimes have equal tax liability`);
    }

    console.log('\n==========================================\n');

    // Uncomment to save to database
    // await sampleProfile.save();
    // console.log('✅ Profile saved to database');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Example 2: Form 16 Data Simulation
const simulateForm16Extraction = () => {
  console.log('\n========== FORM 16 PARSING EXAMPLE ==========\n');
  
  const sampleForm16Text = `
    Form 16 - Part A & Part B
    Assessment Year: 2024-25
    
    PART A - DETAILS OF TAX DEDUCTED
    PAN: ABCDE1234F
    Name of Employee: Rajesh Kumar
    Name and Address of the Employer: TechCorp India Pvt Ltd
    
    PART B - DETAILS OF SALARY PAID AND TAX DEDUCTED
    1. Gross Salary: Rs. 10,80,000
       a. Salary as per Section 17(1): Rs. 8,00,000
       b. House Rent Allowance: Rs. 2,00,000
       c. Leave Travel Allowance: Rs. 50,000
       d. Other Allowances: Rs. 30,000
    
    2. Less: Allowances to the extent exempt u/s 10
       House Rent Allowance: Rs. 80,000
    
    3. Standard Deduction: Rs. 50,000
    
    4. Deductions under Chapter VI-A
       a. Deduction under Section 80C: Rs. 1,50,000
       b. Deduction under Section 80D: Rs. 25,000
       c. Deduction under Section 80E: Rs. 20,000
    
    5. Total Tax Deducted at Source: Rs. 78,000
  `;

  // Simulate regex extraction
  const grossSalaryMatch = sampleForm16Text.match(/Gross\s+Salary[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i);
  const totalTaxMatch = sampleForm16Text.match(/Total\s+Tax\s+Deducted\s+at\s+Source[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i);
  const panMatch = sampleForm16Text.match(/PAN[:\s]*([A-Z]{5}\d{4}[A-Z])/i);
  const section80CMatch = sampleForm16Text.match(/Deduction\s+under\s+Section\s+80C[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i);
  const section80DMatch = sampleForm16Text.match(/Deduction\s+under\s+Section\s+80D[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i);

  console.log('📄 Extracted Form 16 Data:');
  console.log(`   PAN: ${panMatch ? panMatch[1] : 'Not found'}`);
  console.log(`   Gross Salary: ₹${grossSalaryMatch ? parseFloat(grossSalaryMatch[1].replace(/,/g, '')).toLocaleString('en-IN') : 'Not found'}`);
  console.log(`   Section 80C: ₹${section80CMatch ? parseFloat(section80CMatch[1].replace(/,/g, '')).toLocaleString('en-IN') : 'Not found'}`);
  console.log(`   Section 80D: ₹${section80DMatch ? parseFloat(section80DMatch[1].replace(/,/g, '')).toLocaleString('en-IN') : 'Not found'}`);
  console.log(`   Total TDS: ₹${totalTaxMatch ? parseFloat(totalTaxMatch[1].replace(/,/g, '')).toLocaleString('en-IN') : 'Not found'}`);
  
  console.log('\n✅ This is how the Form16Controller extracts data from PDF!');
  console.log('==========================================\n');
};

// Example 3: API Testing with cURL command
const showAPIExample = () => {
  console.log('\n========== API USAGE EXAMPLE ==========\n');
  console.log('To test the Form 16 upload API, use this cURL command:\n');
  console.log('curl -X POST http://localhost:8000/api/form16/upload \\');
  console.log('  -F "form16=@/path/to/your/form16.pdf" \\');
  console.log('  -H "Content-Type: multipart/form-data"\n');
  
  console.log('Or use Postman:');
  console.log('1. Method: POST');
  console.log('2. URL: http://localhost:8000/api/form16/upload');
  console.log('3. Body: form-data');
  console.log('4. Key: form16 (type: File)');
  console.log('5. Value: Select your Form 16 PDF file\n');
  
  console.log('Expected Response:');
  console.log(JSON.stringify({
    success: true,
    message: "Form 16 parsed successfully",
    data: {
      grossSalary: 1080000,
      totalTax: 78000,
      pan: "ABCDE1234F",
      assessmentYear: "2024-25",
      standardDeduction: 50000,
      section80C: 150000,
      section80D: 25000
    },
    metadata: {
      pages: 2,
      info: {}
    }
  }, null, 2));
  console.log('\n==========================================\n');
};

// Run all examples
const runExamples = async () => {
  console.log('\n🚀 TAX SARTHI - FORM 16 & TAX CALCULATION EXAMPLES\n');
  
  // Example 1: Tax Calculation
  await createSampleProfile();
  
  // Example 2: Form 16 Parsing Simulation
  simulateForm16Extraction();
  
  // Example 3: API Usage
  showAPIExample();
};

// Uncomment to run examples
// runExamples();

module.exports = {
  createSampleProfile,
  simulateForm16Extraction,
  showAPIExample,
  runExamples
};
