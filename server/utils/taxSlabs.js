/**
 * Multi-Year Tax Slab Configuration
 * ───────────────────────────────────
 * Each key is an Assessment Year ("YYYY-YY").
 * old.slabs / new.slabs — array of { upTo, rate } (upTo = Infinity for last slab).
 * old.rebateLimit / new.rebateLimit — Section 87A rebate threshold on taxable income.
 * standardDeduction — Standard deduction amount for that year.
 */

const TAX_SLABS = {
  // ─── AY 2025-26  (Budget 2024-25, current default) ───────
  "2025-26": {
    standardDeduction: 75000,
    old: {
      rebateLimit: 500000,
      slabs: [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 0.05 },
        { upTo: 1000000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
    new: {
      rebateLimit: 1200000,
      slabs: [
        { upTo: 400000, rate: 0 },
        { upTo: 800000, rate: 0.05 },
        { upTo: 1200000, rate: 0.10 },
        { upTo: 1600000, rate: 0.15 },
        { upTo: 2000000, rate: 0.20 },
        { upTo: 2400000, rate: 0.25 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
  },

  // ─── AY 2024-25  (Budget 2023-24) ─────────────────────────
  "2024-25": {
    standardDeduction: 50000,
    old: {
      rebateLimit: 500000,
      slabs: [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 0.05 },
        { upTo: 1000000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
    new: {
      rebateLimit: 700000,
      slabs: [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 0.05 },
        { upTo: 900000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
  },

  // ─── AY 2023-24  (Budget 2022-23) ─────────────────────────
  "2023-24": {
    standardDeduction: 50000,
    old: {
      rebateLimit: 500000,
      slabs: [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 0.05 },
        { upTo: 1000000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
    new: {
      rebateLimit: 700000,
      slabs: [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 0.05 },
        { upTo: 900000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ],
    },
  },
};

// Default to latest year if unknown
const DEFAULT_YEAR = "2025-26";

/**
 * Get slab config for a given assessment year.
 * Falls back to DEFAULT_YEAR if year is unknown.
 */
function getSlabConfig(year) {
  return TAX_SLABS[year] || TAX_SLABS[DEFAULT_YEAR];
}

/**
 * Compute income tax from slab array.
 * @param {number} income - taxable income
 * @param {Array}  slabs  - [{ upTo, rate }]
 * @returns {number} tax before cess
 */
function computeSlabTax(income, slabs) {
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, upTo) - prev;
    tax += taxable * rate;
    prev = upTo;
  }
  return tax;
}

module.exports = { TAX_SLABS, DEFAULT_YEAR, getSlabConfig, computeSlabTax };
