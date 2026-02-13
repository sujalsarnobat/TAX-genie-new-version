const mongoose = require('mongoose');

const UserTaxProfileSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Assessment Year
    assessmentYear: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{2,4}$/,
      default: '2024-25'
    },

    // Basic Income Details
    basicSalary: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    hra: {
      type: Number,
      min: 0,
      default: 0,
      description: 'House Rent Allowance'
    },

    lta: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Leave Travel Allowance'
    },

    otherAllowances: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Other allowances and perquisites'
    },

    // Standard Deduction (available in both regimes)
    standardDeduction: {
      type: Number,
      min: 0,
      default: 50000,
      description: 'Standard deduction under Section 16(ia)'
    },

    // Old Regime Specific Deductions
    section80C: {
      type: Number,
      min: 0,
      max: 150000,
      default: 0,
      description: 'PPF, EPF, Life Insurance, ELSS, NSC, Tax Saver FD, etc.'
    },

    section80D: {
      type: Number,
      min: 0,
      max: 100000,
      default: 0,
      description: 'Health Insurance Premium'
    },

    section80E: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Education Loan Interest'
    },

    section80G: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Donations to Charitable Institutions'
    },

    section24B: {
      type: Number,
      min: 0,
      max: 200000,
      default: 0,
      description: 'Home Loan Interest (Self-occupied property)'
    },

    // Tax Regime Selection
    selectedRegime: {
      type: String,
      enum: ['old', 'new'],
      default: 'new'
    },

    // Calculated Tax (Old Regime)
    oldRegimeTax: {
      grossIncome: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 },
      taxableIncome: { type: Number, default: 0 },
      incomeTax: { type: Number, default: 0 },
      cess: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 }
    },

    // Calculated Tax (New Regime)
    newRegimeTax: {
      grossIncome: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 },
      taxableIncome: { type: Number, default: 0 },
      incomeTax: { type: Number, default: 0 },
      cess: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 }
    },

    // Tax Savings Comparison
    taxSavings: {
      regime: { type: String, enum: ['old', 'new', 'equal'], default: 'new' },
      amount: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },

    // Form 16 Data
    form16Data: {
      uploaded: { type: Boolean, default: false },
      fileName: { type: String },
      uploadedAt: { type: Date },
      extractedData: {
        pan: String,
        employerName: String,
        grossSalary: Number,
        totalTax: Number
      }
    },

    // Metadata
    isActive: {
      type: Boolean,
      default: true
    },

    lastCalculated: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
UserTaxProfileSchema.index({ userId: 1, assessmentYear: 1 }, { unique: true });
UserTaxProfileSchema.index({ createdAt: -1 });

// Virtual: Calculate Gross Total Income
UserTaxProfileSchema.virtual('grossTotalIncome').get(function() {
  return this.basicSalary + this.hra + this.lta + this.otherAllowances;
});

// Method: Calculate Old Regime Tax
UserTaxProfileSchema.methods.calculateOldRegimeTax = function() {
  const grossIncome = this.grossTotalIncome;
  
  // Total deductions available in old regime
  const totalDeductions = 
    this.standardDeduction +
    this.section80C +
    this.section80D +
    this.section80E +
    this.section80G +
    this.section24B;
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  // Old Regime Tax Slabs (FY 2024-25)
  let incomeTax = 0;
  if (taxableIncome <= 250000) {
    incomeTax = 0;
  } else if (taxableIncome <= 500000) {
    incomeTax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    incomeTax = 12500 + (taxableIncome - 500000) * 0.20;
  } else {
    incomeTax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
  }
  
  // Health and Education Cess (4%)
  const cess = incomeTax * 0.04;
  const totalTax = incomeTax + cess;
  
  this.oldRegimeTax = {
    grossIncome,
    totalDeductions,
    taxableIncome,
    incomeTax: Math.round(incomeTax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax)
  };
  
  return this.oldRegimeTax;
};

// Method: Calculate New Regime Tax
UserTaxProfileSchema.methods.calculateNewRegimeTax = function() {
  const grossIncome = this.grossTotalIncome;
  
  // New regime only allows standard deduction (₹50,000)
  const totalDeductions = this.standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  // New Regime Tax Slabs (FY 2024-25)
  let incomeTax = 0;
  if (taxableIncome <= 300000) {
    incomeTax = 0;
  } else if (taxableIncome <= 600000) {
    incomeTax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    incomeTax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    incomeTax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    incomeTax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.20;
  } else {
    incomeTax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.30;
  }
  
  // Health and Education Cess (4%)
  const cess = incomeTax * 0.04;
  const totalTax = incomeTax + cess;
  
  this.newRegimeTax = {
    grossIncome,
    totalDeductions,
    taxableIncome,
    incomeTax: Math.round(incomeTax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax)
  };
  
  return this.newRegimeTax;
};

// Method: Compare Regimes and Calculate Savings
UserTaxProfileSchema.methods.compareRegimes = function() {
  this.calculateOldRegimeTax();
  this.calculateNewRegimeTax();
  
  const oldTax = this.oldRegimeTax.totalTax;
  const newTax = this.newRegimeTax.totalTax;
  const difference = Math.abs(oldTax - newTax);
  
  if (oldTax < newTax) {
    this.taxSavings = {
      regime: 'old',
      amount: difference,
      percentage: ((difference / newTax) * 100).toFixed(2)
    };
  } else if (newTax < oldTax) {
    this.taxSavings = {
      regime: 'new',
      amount: difference,
      percentage: ((difference / oldTax) * 100).toFixed(2)
    };
  } else {
    this.taxSavings = {
      regime: 'equal',
      amount: 0,
      percentage: 0
    };
  }
  
  this.lastCalculated = new Date();
  return this.taxSavings;
};

// Pre-save hook to calculate taxes
UserTaxProfileSchema.pre('save', function(next) {
  if (this.isModified('basicSalary') || 
      this.isModified('hra') || 
      this.isModified('lta') || 
      this.isModified('section80C') || 
      this.isModified('section80D')) {
    this.compareRegimes();
  }
  next();
});

const UserTaxProfile = mongoose.model('UserTaxProfile', UserTaxProfileSchema);

module.exports = UserTaxProfile;
