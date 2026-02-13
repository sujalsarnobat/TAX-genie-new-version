const mongoose = require('mongoose')

const taxcalculationSchema = new mongoose.Schema(
  {
  Token: { type: String, required: true },
  AadharNo: { type: Number, default: 0 },
  // Personal Information
  FirstName: { type: String, default: "" },
  MiddleName: { type: String, default: "" },
  LastName: { type: String, default: "" },
  Name: { type: String, default: "" },
  DateOfBirth: { type: String, default: "" },
  FatherName: { type: String, default: "" },
  Gender: { type: String, default: "" },
  MaritalStatus: { type: String, default: "" },
  
  PanCard: { type: String, default: "" },
  MobileNo: { type: Number, default: 0 },
  Email: { type: String, default: "" },
        Address: { type: String, default: "" },
        PermanentAddress: { type: String, default: "" },
        City: { type: String, default: "" },
        selectedState: { type: String, default: "" },
        PinCode: { type: String, default: "" },
        
        employerName: { type: String, default: "" },
        employerAddress: { type: String, default: "" },
        employerPanNumber: { type: String, default: "" },
        tanNumber: { type: String, default: "" },
        employeeReferenceNo: { type: String, default: "" },
        Year: { type: String, default: "" },
        TaxDeducted: { type: Number, default: 0 },
        
        Salary: { type: Number, default: 0 },
        PrerequisiteIncome: { type: Number, default: 0 },
        ProfitIncome: { type: Number, default: 0 },
        OtherIncome: { type: Number, default: 0 },
        HRA: { type: Number, default: 0 },
        LTA: { type: Number, default: 0 },
        OtherExemptedAllowances: { type: Number, default: 0 },
        ProfessionalTax: { type: Number, default: 0 },
        
        OwnHouseIncome: { type: Number, default: 0 },
        
        section80C: { type: Number, default: 0 },
        section80CCC: { type: Number, default: 0 },
        section80CCD1: { type: Number, default: 0 },
        section80CCD2: { type: Number, default: 0 },
        section80CCD1B: { type: Number, default: 0 },
        section80CCF: { type: Number, default: 0 },
        section80CCG: { type: Number, default: 0 },
        section80D: { type: Number, default: 0 },
        section80DD: { type: Number, default: 0 },
        section80DDB: { type: Number, default: 0 },
        section80E: { type: Number, default: 0 },
        section80EE: { type: Number, default: 0 },
        section80G: { type: Number, default: 0 },
        section80GGA: { type: Number, default: 0 },
        section80GGC: { type: Number, default: 0 },
        section80QQB: { type: Number, default: 0 },
        section80RRB: { type: Number, default: 0 },
        section80TTA: { type: Number, default: 0 },
        section80U: { type: Number, default: 0 },
        
        RentedHouseIncome: { type: Number, default: 0 },
        DeemdedHouseIncome: { type: Number, default: 0 },
        OldFinalTax: { type: Number, default: 0 },
        OldFinalCess: { type: Number, default: 0 },
        NewFinalTax: { type: Number, default: 0 },
        NewFinalCess: { type: Number, default: 0 },
        PreferredSystem: {
          type: String,
          default: "NewRegime",
          enum: ["OldRegime", "NewRegime"],
        },
        TotalTaxableIncome: { type: Number, default: 0 },
        TotalIncome: { type: Number, default: 0 },
        TotalDeductions: { type: Number, default: 0 },

  },
  { timestamps: true }
  );
  
  const calculateOldRegimeTax = async function (income) {
    // Old Regime 2025: Rebate u/s 87A up to 5 lakh taxable income
    const TAX_REBATE = {
    old: 500000,
  };
  
  const calculateSlabTax = (income, rate) => income * rate;
  
  const calculateCess = (totalTax) => totalTax * 0.04;

  let totalTax = 0;

  if (income >= TAX_REBATE.old) {
    // Old Regime Tax Slabs (unchanged)
    // 0 - 2.5 lakh: 0%
    // 2.5 - 5 lakh: 5%
    // 5 - 10 lakh: 20%
    // Above 10 lakh: 30%
    totalTax += calculateSlabTax(Math.min(income, 250000), 0);

    totalTax += calculateSlabTax(
      Math.min(Math.max(income - 250000, 0), 500000 - 250000),
      0.05
    );

    totalTax += calculateSlabTax(
      Math.min(Math.max(income - 500000, 0), 1000000 - 500000),
      0.2
    );

    totalTax += calculateSlabTax(Math.max(income - 1000000, 0), 0.3);
  }

  const ceSS = calculateCess(totalTax);
  const Tax = totalTax + ceSS;

  return { Tax, ceSS };
};

const calculateNewRegimeTax = async function (income) {
  // New Regime 2025 (Budget 2024-25)
  // Tax rebate u/s 87A increased to 12 lakh
  // Standard deduction increased to 75,000
  const TAX_REBATE_NEW = {
    new: 1200000,  // Increased from 7 lakh to 12 lakh
  };

  const calculateSlabTax = (income, rate) => income * rate;

  let totalTax = 0;

  // New Regime 2025 Tax Slabs:
  // 0 - 4 lakh: 0%
  // 4 - 8 lakh: 5%
  // 8 - 12 lakh: 10%
  // 12 - 16 lakh: 15%
  // 16 - 20 lakh: 20%
  // 20 - 24 lakh: 25%
  // Above 24 lakh: 30%
  
  if (income >= TAX_REBATE_NEW.new) {
    // 0 - 4 lakh: 0%
    totalTax += calculateSlabTax(Math.min(income, 400000), 0);

    // 4 - 8 lakh: 5%
    totalTax += calculateSlabTax(
        Math.min(Math.max(income - 400000, 0), 400000),
        0.05
    );

    // 8 - 12 lakh: 10%
    totalTax += calculateSlabTax(
        Math.min(Math.max(income - 800000, 0), 400000),
        0.1
    );

    // 12 - 16 lakh: 15%
    totalTax += calculateSlabTax(
        Math.min(Math.max(income - 1200000, 0), 400000),
        0.15
    );

    // 16 - 20 lakh: 20%
    totalTax += calculateSlabTax(
        Math.min(Math.max(income - 1600000, 0), 400000),
        0.2
    );
    
    // 20 - 24 lakh: 25%
    totalTax += calculateSlabTax(
        Math.min(Math.max(income - 2000000, 0), 400000),
        0.25
    );
    
    // Above 24 lakh: 30%
    totalTax += calculateSlabTax(Math.max(income - 2400000, 0), 0.3);
  }

  const calculateCess = (totalTax) => totalTax * 0.04;

  const newcess = calculateCess(totalTax);
  const newfinaltax = totalTax + newcess;

  return { newfinaltax, newcess };
};

taxcalculationSchema.pre("save", async function (next) {
  this.Name = `${this.FirstName} ${
    this.MiddleName ? this.MiddleName + " " : ""
  }${this.LastName}`;

  this.TotalIncome =
    this.Salary +
    this.PrerequisiteIncome +
    this.ProfitIncome +
    this.OtherIncome +
    this.RentedHouseIncome +
    this.DeemdedHouseIncome;

  this.TotalDeductions =
    this.section80C +
    this.section80CCC +
    this.section80CCD1 +
    this.section80CCD2 +
    this.section80CCD1B +
    this.section80CCF +
    this.section80CCG +
    this.section80D +
    this.section80DD +
    this.section80DDB +
    this.section80E +
    this.section80EE +
    this.section80G +
    this.section80GGA +
    this.section80GGC +
    this.section80QQB +
    this.section80RRB +
    this.section80TTA +
    this.section80U +
    this.HRA +
    this.LTA +
    this.OtherExemptedAllowances +
    this.ProfessionalTax +
    this.OwnHouseIncome;

  this.TotalTaxableIncome = this.TotalIncome - this.TotalDeductions;

  // Standard Deduction increased to Rs 75,000 in Budget 2024-25
  let StandardDeduction = 75000;

  let OldTaxableIncome =
    this.TotalIncome - this.TotalDeductions - StandardDeduction;

  const { Tax, ceSS } = await calculateOldRegimeTax(OldTaxableIncome);
  const { newfinaltax, newcess } = await calculateNewRegimeTax(this.TotalIncome);

  this.OldFinalTax = Tax;
  this.OldFinalCess = ceSS;
  this.NewFinalTax = newfinaltax;
  this.NewFinalCess = newcess;
  this.PreferredSystem =
    this.NewFinalTax < this.OldFinalTax ? "NewRegime" : "OldRegime";

  next();
});


const TaxCalculation = mongoose.model("TaxCalculation",taxcalculationSchema);

module.exports = TaxCalculation;