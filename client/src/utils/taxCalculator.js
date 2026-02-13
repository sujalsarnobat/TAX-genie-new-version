/**
 * Tax Calculator Utility
 * Calculates tax for both Old and New Tax Regimes (FY 2024-25)
 */

export const calculateTax = (income, investments) => {
  const standardDeduction = 50000;
  const newRegimeStandardDeduction = 75000;

  // ==================== OLD TAX REGIME ====================
  
  // Calculate exemptions for Old Regime
  const hraExemption = Math.min(investments.hra * 0.4, 100000); // 40% of HRA or 1L, whichever is lower
  const ltaExemption = Math.min(investments.lta, 50000); // Max 50k exempt
  
  // Total deductions available in Old Regime
  const totalDeductions = 
    standardDeduction +
    investments.section80C + // Max 1.5L
    investments.section80D + // Max 25k/50k
    investments.section80E + // No limit
    investments.section24B + // Max 2L for self-occupied
    hraExemption +
    ltaExemption;
  
  // Taxable income for Old Regime
  let taxableOld = income + investments.otherAllowances - totalDeductions;
  if (taxableOld < 0) taxableOld = 0;
  
  // Calculate Old Regime Tax (Slabs for < 60 years)
  let oldRegimeTax = 0;
  if (taxableOld > 1000000) {
    oldRegimeTax = (taxableOld - 1000000) * 0.30 + 100000 + 12500;
  } else if (taxableOld > 500000) {
    oldRegimeTax = (taxableOld - 500000) * 0.20 + 12500;
  } else if (taxableOld > 250000) {
    oldRegimeTax = (taxableOld - 250000) * 0.05;
  } else {
    oldRegimeTax = 0;
  }
  
  // Add 4% Health & Education Cess
  const oldCess = oldRegimeTax * 0.04;
  const oldTotalTax = Math.round(oldRegimeTax + oldCess);

  // ==================== NEW TAX REGIME ====================
  
  // Taxable income for New Regime (Only standard deduction, no other exemptions)
  let taxableNew = income + investments.otherAllowances - newRegimeStandardDeduction;
  if (taxableNew < 0) taxableNew = 0;
  
  // Calculate New Regime Tax (FY 2024-25 Slabs)
  let newRegimeTax = 0;
  if (taxableNew > 1500000) {
    newRegimeTax = (taxableNew - 1500000) * 0.30 + 150000;
  } else if (taxableNew > 1200000) {
    newRegimeTax = (taxableNew - 1200000) * 0.20 + 90000;
  } else if (taxableNew > 900000) {
    newRegimeTax = (taxableNew - 900000) * 0.15 + 45000;
  } else if (taxableNew > 600000) {
    newRegimeTax = (taxableNew - 600000) * 0.10 + 15000;
  } else if (taxableNew > 300000) {
    newRegimeTax = (taxableNew - 300000) * 0.05;
  } else {
    newRegimeTax = 0;
  }
  
  // Add 4% Health & Education Cess
  const newCess = newRegimeTax * 0.04;
  const newTotalTax = Math.round(newRegimeTax + newCess);

  // ==================== RETURN COMPARISON ====================
  
  return {
    oldRegimeTax: oldTotalTax,
    newRegimeTax: newTotalTax,
    savings: Math.abs(oldTotalTax - newTotalTax),
    betterRegime: oldTotalTax < newTotalTax ? 'old' : 'new',
    oldDetails: {
      grossIncome: income + investments.otherAllowances,
      deductions: Math.round(totalDeductions),
      taxableIncome: Math.round(taxableOld),
      taxBeforeCess: Math.round(oldRegimeTax),
      cess: Math.round(oldCess),
      totalTax: oldTotalTax
    },
    newDetails: {
      grossIncome: income + investments.otherAllowances,
      deductions: newRegimeStandardDeduction,
      taxableIncome: Math.round(taxableNew),
      taxBeforeCess: Math.round(newRegimeTax),
      cess: Math.round(newCess),
      totalTax: newTotalTax
    }
  };
};

/**
 * Format currency to Indian format
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate percentage savings
 */
export const calculateSavingsPercent = (oldTax, newTax) => {
  const higher = Math.max(oldTax, newTax);
  const lower = Math.min(oldTax, newTax);
  return ((higher - lower) / higher * 100).toFixed(1);
};
