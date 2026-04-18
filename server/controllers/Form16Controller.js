const pdfParse = require('pdf-parse');

// ─── Helpers ──────────────────────────────────────────
/**
 * Parse an Indian-formatted number string to float.
 * Handles "12,34,567.89", "1234567", "12,345" etc.
 */
function parseAmount(str) {
  if (!str) return null;
  const clean = str.replace(/[₹Rs.\s]/gi, '').replace(/,/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

/**
 * Try an array of regex patterns against text. Return the first
 * successful numeric match, or null.
 */
function matchFirst(text, patterns) {
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) {
      const val = parseAmount(m[1]);
      if (val !== null) return val;
    }
  }
  return null;
}

/**
 * Try a single regex and return the captured group (string), or null.
 */
function matchString(text, patterns) {
  const list = Array.isArray(patterns) ? patterns : [patterns];
  for (const p of list) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

// ─── Pattern Definitions ──────────────────────────────
const PATTERNS = {
  // ─── Income fields ────────────────────────────────────
  grossSalary: [
    /Gross\s+(?:Total\s+)?Salary[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Salary\s+as\s+per\s+(?:provisions\s+of\s+)?(?:section|sec\.?)\s*17\s*\(\s*1\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /(?:1|a)\.\s*Salary\s+as\s+per.*?17\(1\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Total\s+of\s+salary[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Income\s+(?:under|from)\s+the\s+head\s+(?:"|\")?Salaries(?:"|\")?[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  perquisites: [
    /Value\s+of\s+perquisites[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /(?:section|sec\.?)\s*17\s*\(\s*2\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Perquisites[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  profitsInLieu: [
    /Profits\s+in\s+lieu\s+of\s+salary[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /(?:section|sec\.?)\s*17\s*\(\s*3\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],

  // ─── Exemptions / Allowances ──────────────────────────
  hra: [
    /House\s+Rent\s+Allowance[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /HRA[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /10\s*\(\s*13A\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  lta: [
    /Leave\s+Travel\s+(?:Allowance|Concession)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /LTA[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /5\s*\(\s*ii\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  standardDeduction: [
    /Standard\s+[Dd]eduction[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /(?:section|sec\.?)\s*16\s*\(\s*ia\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /16\s*\(\s*ia\s*\)[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  professionalTax: [
    /Professional\s+Tax[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Tax\s+on\s+Employment[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /(?:section|sec\.?)\s*16\s*\(\s*iii\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],

  // ─── Deductions Chapter VI-A ──────────────────────────
  section80C: [
    /(?:section|sec\.?)\s*80\s*C(?:\s|:|\b)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80C[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Deduction.*?80\s*C\b[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80CCC: [
    /(?:section|sec\.?)\s*80\s*CCC[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80CCC[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80CCD1: [
    /(?:section|sec\.?)\s*80\s*CCD\s*\(\s*1\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80CCD\s*\(\s*1\s*\)[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80CCD1B: [
    /(?:section|sec\.?)\s*80\s*CCD\s*\(\s*1B\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80CCD\s*\(\s*1B\s*\)[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /NPS\s+(?:contribution|deduction)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80CCD2: [
    /(?:section|sec\.?)\s*80\s*CCD\s*\(\s*2\s*\)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80CCD\s*\(\s*2\s*\)[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Employer.*?NPS[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80D: [
    /(?:section|sec\.?)\s*80\s*D[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80D[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Medical\s+Insurance[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80E: [
    /(?:section|sec\.?)\s*80\s*E[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80E[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Education\s+Loan\s+Interest[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80G: [
    /(?:section|sec\.?)\s*80\s*G[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80G[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Donations[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  section80TTA: [
    /(?:section|sec\.?)\s*80\s*TTA[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /80TTA[\s:]+(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Savings\s+(?:Account|Bank)\s+Interest[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  homeLoanInterest: [
    /(?:Interest\s+on\s+)?(?:Home|Housing)\s+Loan\s+Interest[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Income\s+from\s+(?:House|self-occupied)\s+Property[\s:]*(?:Rs\.?\s*)?[₹]?\s*-?\s*([\d,]+\.?\d*)/i,
    /Loss\s+from\s+house\s+property[\s:]*(?:Rs\.?\s*)?[₹]?\s*-?\s*([\d,]+\.?\d*)/i,
    /(?:section|sec\.?)\s*24[\s:]*(?:Rs\.?\s*)?[₹]?\s*-?\s*([\d,]+\.?\d*)/i,
  ],

  // ─── Tax & TDS ────────────────────────────────────────
  totalTax: [
    /Total\s+Tax\s+(?:Payable|Deducted)[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Tax\s+Deducted\s+at\s+Source[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Total\s+TDS[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Tax\s+on\s+Total\s+Income[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Net\s+Tax\s+Payable[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  totalIncome: [
    /(?:Gross\s+)?Total\s+Income[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Total\s+Taxable\s+Income[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],
  totalDeductions: [
    /(?:Aggregate|Total)\s+(?:of\s+)?Deductions[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
    /Total\s+(?:of\s+)?Chapter\s*VI-?A[\s:]*(?:Rs\.?\s*)?[₹]?\s*([\d,]+\.?\d*)/i,
  ],

  // ─── Identity / metadata ──────────────────────────────
  pan: [
    /PAN\s+(?:of\s+the\s+)?(?:Employee|Deductee)?\s*[:\s]*([A-Z]{5}\d{4}[A-Z])/i,
    /PAN\s*[:\s]\s*([A-Z]{5}\d{4}[A-Z])/i,
  ],
  employerPan: [
    /PAN\s+of\s+the\s+(?:Deductor|Employer)\s*[:\s]*([A-Z]{5}\d{4}[A-Z])/i,
    /Employer.*?PAN\s*[:\s]*([A-Z]{5}\d{4}[A-Z])/i,
  ],
  tan: [
    /TAN\s+(?:of\s+the\s+)?(?:Deductor|Employer)?\s*[:\s]*([A-Z]{4}\d{5}[A-Z])/i,
    /TAN\s*[:\s]\s*([A-Z]{4}\d{5}[A-Z])/i,
  ],
  assessmentYear: [
    /Assessment\s+Year[\s:]*(\d{4}\s*-\s*\d{2,4})/i,
    /A\.?\s*Y\.?\s*[:\s]*(\d{4}\s*-\s*\d{2,4})/i,
  ],
  employerName: [
    /Name\s+(?:and\s+Address\s+)?of\s+the\s+(?:Employer|Deductor)[\s:]*([^\n]+)/i,
    /Employer\s+Name[\s:]*([^\n]+)/i,
  ],
  employeeName: [
    /Name\s+(?:and\s+Address\s+)?of\s+the\s+(?:Employee|Deductee)[\s:]*([^\n]+)/i,
    /Employee\s+Name[\s:]*([^\n]+)/i,
  ],
};

// ─── Controller ───────────────────────────────────────
const parseForm16 = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Extract every field
    const d = {};
    const confidence = {};

    // Numeric fields
    const numericFields = [
      'grossSalary', 'perquisites', 'profitsInLieu',
      'hra', 'lta', 'standardDeduction', 'professionalTax',
      'section80C', 'section80CCC', 'section80CCD1', 'section80CCD1B', 'section80CCD2',
      'section80D', 'section80E', 'section80G', 'section80TTA',
      'homeLoanInterest', 'totalTax', 'totalIncome', 'totalDeductions',
    ];

    for (const field of numericFields) {
      if (PATTERNS[field]) {
        const val = matchFirst(text, PATTERNS[field]);
        if (val !== null) {
          d[field] = val;
          confidence[field] = 'high';
        }
      }
    }

    // String fields
    const stringFields = ['pan', 'employerPan', 'tan', 'assessmentYear', 'employerName', 'employeeName'];
    for (const field of stringFields) {
      if (PATTERNS[field]) {
        const val = matchString(text, PATTERNS[field]);
        if (val) {
          d[field] = val;
          confidence[field] = 'high';
        }
      }
    }

    // ─── Normalize Assessment Year to "YYYY-YY" ──────────
    if (d.assessmentYear) {
      const ay = d.assessmentYear.replace(/\s/g, '');
      const parts = ay.split('-');
      if (parts.length === 2 && parts[1].length === 4) {
        d.assessmentYear = `${parts[0]}-${parts[1].slice(2)}`;
      }
    }

    // ─── Derived / fallback values ────────────────────────
    // If no grossSalary but we have totalIncome + totalDeductions, derive it
    if (!d.grossSalary && d.totalIncome && d.totalDeductions) {
      d.grossSalary = d.totalIncome + d.totalDeductions + (d.standardDeduction || 0);
      confidence.grossSalary = 'derived';
    }

    // Map to the form's expected field names for convenience
    const formFields = {
      firstName: '',
      lastName: '',
      panCard: d.pan || '',
      grossSalary: d.grossSalary || 0,
      perquisites: d.perquisites || 0,
      profitIncome: d.profitsInLieu || 0,
      hra: d.hra || 0,
      lta: d.lta || 0,
      professionalTax: d.professionalTax || 0,
      assessmentYear: d.assessmentYear || '',
      employerName: d.employerName || '',
      employerPan: d.employerPan || '',
      tanNumber: d.tan || '',
      taxDeducted: d.totalTax || 0,
      section80C: d.section80C || 0,
      section80D: d.section80D || 0,
      section80E: d.section80E || 0,
      section80G: d.section80G || 0,
      homeLoanInterest: d.homeLoanInterest || 0,
      nps: (d.section80CCD1B || 0) + (d.section80CCD2 || 0),
    };

    // Parse employee name into first / last
    if (d.employeeName) {
      const nameParts = d.employeeName.split(/\s+/);
      formFields.firstName = nameParts[0] || '';
      formFields.lastName = nameParts.slice(1).join(' ') || '';
    }

    const fieldsFound = Object.keys(d).length;

    if (fieldsFound === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract any data from this PDF. Please ensure it is a valid Form 16.",
        rawText: text.substring(0, 800),
      });
    }

    return res.status(200).json({
      success: true,
      message: `Form 16 parsed — ${fieldsFound} fields extracted`,
      data: d,
      formFields,
      confidence,
      metadata: { pages: data.numpages, info: data.info },
    });
  } catch (error) {
    console.error("Error parsing Form 16:", error);
    return res.status(500).json({
      success: false,
      message: "Error parsing PDF file",
      error: error.message,
    });
  }
};

module.exports = { parseForm16 };
