const pdfParse = require('pdf-parse');

/**
 * Parse Form 16 PDF and extract tax-related information
 * @param {Object} req - Express request object with file upload
 * @param {Object} res - Express response object
 */
const parseForm16 = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded"
      });
    }

    // Parse the PDF buffer
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    
    // Extract text from PDF
    const text = data.text;

    // Regex patterns for Form 16 fields
    const patterns = {
      // Gross Salary patterns - handles various formats
      grossSalary: [
        /Gross\s+Salary[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
        /Gross\s+Salary[:\s]*([\d,]+\.?\d*)/i,
        /Total\s+Gross\s+Salary[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
        /Salary\s+as\s+per\s+Section\s+17\(1\)[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i
      ],
      
      // Total Tax patterns
      totalTax: [
        /Total\s+Tax[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
        /Total\s+Tax\s+Payable[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
        /Tax\s+Deducted\s+at\s+Source[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
        /Total\s+TDS[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i
      ],

      // Additional useful fields
      pan: /PAN[:\s]*([A-Z]{5}\d{4}[A-Z])/i,
      assessmentYear: /Assessment\s+Year[:\s]*(\d{4}-\d{2,4})/i,
      employerName: /Name\s+and\s+Address\s+of\s+the\s+Employer[:\s]*([^\n]+)/i,
      employeeName: /Name\s+of\s+Employee[:\s]*([^\n]+)/i,
      standardDeduction: /Standard\s+Deduction[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
      hra: /House\s+Rent\s+Allowance[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
      section80C: /Deduction\s+under\s+Section\s+80C[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i,
      section80D: /Deduction\s+under\s+Section\s+80D[:\s]*Rs\.?\s*([\d,]+\.?\d*)/i
    };

    // Extract data using patterns
    const extractedData = {};

    // Extract Gross Salary
    for (const pattern of patterns.grossSalary) {
      const match = text.match(pattern);
      if (match) {
        extractedData.grossSalary = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Extract Total Tax
    for (const pattern of patterns.totalTax) {
      const match = text.match(pattern);
      if (match) {
        extractedData.totalTax = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Extract PAN
    const panMatch = text.match(patterns.pan);
    if (panMatch) {
      extractedData.pan = panMatch[1];
    }

    // Extract Assessment Year
    const ayMatch = text.match(patterns.assessmentYear);
    if (ayMatch) {
      extractedData.assessmentYear = ayMatch[1];
    }

    // Extract Employee Name
    const nameMatch = text.match(patterns.employeeName);
    if (nameMatch) {
      extractedData.employeeName = nameMatch[1].trim();
    }

    // Extract Employer Name
    const employerMatch = text.match(patterns.employerName);
    if (employerMatch) {
      extractedData.employerName = employerMatch[1].trim();
    }

    // Extract Standard Deduction
    const stdDeductionMatch = text.match(patterns.standardDeduction);
    if (stdDeductionMatch) {
      extractedData.standardDeduction = parseFloat(stdDeductionMatch[1].replace(/,/g, ''));
    }

    // Extract HRA
    const hraMatch = text.match(patterns.hra);
    if (hraMatch) {
      extractedData.hra = parseFloat(hraMatch[1].replace(/,/g, ''));
    }

    // Extract Section 80C
    const section80CMatch = text.match(patterns.section80C);
    if (section80CMatch) {
      extractedData.section80C = parseFloat(section80CMatch[1].replace(/,/g, ''));
    }

    // Extract Section 80D
    const section80DMatch = text.match(patterns.section80D);
    if (section80DMatch) {
      extractedData.section80D = parseFloat(section80DMatch[1].replace(/,/g, ''));
    }

    // Check if critical data was extracted
    if (!extractedData.grossSalary && !extractedData.totalTax) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract Gross Salary or Total Tax from Form 16. Please ensure the PDF is a valid Form 16 document.",
        extractedData,
        rawText: text.substring(0, 500) // First 500 chars for debugging
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Form 16 parsed successfully",
      data: extractedData,
      metadata: {
        pages: data.numpages,
        info: data.info
      }
    });

  } catch (error) {
    console.error("Error parsing Form 16:", error);
    return res.status(500).json({
      success: false,
      message: "Error parsing PDF file",
      error: error.message
    });
  }
};

module.exports = {
  parseForm16
};
