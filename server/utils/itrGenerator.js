/**
 * ITR-1 (Sahaj) JSON Generator
 * Maps TaxSarthi tax calculation data to the Income Tax Department's ITR-1 schema.
 * This JSON can be uploaded to incometax.gov.in for filing.
 */

const generateITR1JSON = (taxData) => {
  const regime = taxData.PreferredSystem;
  const isOld = regime === 'OldRegime';

  const totalTax = isOld
    ? (taxData.OldFinalTax || 0)
    : (taxData.NewFinalTax || 0);

  const totalCess = isOld
    ? (taxData.OldFinalCess || 0)
    : (taxData.NewFinalCess || 0);

  const taxBeforeCess = totalTax - totalCess;

  // Parse AY string, e.g. "2025-26" → { start: "2025", end: "2026" }
  const ayParts = (taxData.Year || '2025-26').split('-');
  const ayStart = ayParts[0] || '2025';
  const ayEnd = ayParts[1] ? (ayParts[1].length === 2 ? ayParts[0].slice(0, 2) + ayParts[1] : ayParts[1]) : '2026';

  return {
    Form_ITR1: {
      FormName: 'ITR-1',
      Description: 'For Individuals having Income from Salaries, One House Property, Other Sources (Interest etc.)',
      AssessmentYear: `${ayStart}-${ayEnd}`,
      SchemaVersion: 'Ver1.0',

      PartA_GEN1: {
        PersonalInfo: {
          AssesseeName: {
            FirstName: taxData.FirstName || '',
            MiddleName: taxData.MiddleName || '',
            SurNameOrOrgName: taxData.LastName || '',
          },
          PAN: taxData.PanCard || '',
          AadhaarCardNo: taxData.AadharNo ? String(taxData.AadharNo) : '',
          DOB: taxData.DateOfBirth || '',
          FatherName: taxData.FatherName || '',
          Gender: taxData.Gender || '',
          MaritalStatus: taxData.MaritalStatus || '',
          MobileNo: taxData.MobileNo ? String(taxData.MobileNo) : '',
          EmailAddress: taxData.Email || '',
          Address: {
            ResidenceNo: taxData.Address || '',
            CityOrTownOrDistrict: taxData.City || '',
            StateCode: taxData.selectedState || '',
            PinCode: taxData.PinCode || '',
            CountryCode: 'IN',
          },
        },
        FilingStatus: {
          ReturnFileSec: 11, // u/s 139(1) — on or before due date
          OptOutNewTaxRegime: isOld ? 'Y' : 'N',
        },
      },

      ScheduleS: {
        // Schedule Salary
        Salaries: taxData.Salary || 0,
        ValueOfPerquisites: taxData.PrerequisiteIncome || 0,
        ProfitsinLieuOfSalary: taxData.ProfitIncome || 0,
        GrossSalary:
          (taxData.Salary || 0) +
          (taxData.PrerequisiteIncome || 0) +
          (taxData.ProfitIncome || 0),
        AllwncExemptUs10: {
          HRA: taxData.HRA || 0,
          LTA: taxData.LTA || 0,
          OtherExempt: taxData.OtherExemptedAllowances || 0,
          TotalAllwncExemptUs10: (taxData.HRA || 0) + (taxData.LTA || 0) + (taxData.OtherExemptedAllowances || 0),
        },
        ProfessionalTaxUs16iii: taxData.ProfessionalTax || 0,
        EntertainmentAlw16ii: 0,
        DeductionUs16: 75000, // Standard deduction AY 2025-26
        IncomeFromSalary: taxData.TotalIncome || 0,
      },

      ScheduleHP: {
        // House Property
        IncomeFromHP: (taxData.OwnHouseIncome || 0) + (taxData.RentedHouseIncome || 0) + (taxData.DeemdedHouseIncome || 0),
        LetOut: {
          AnnualValue: taxData.RentedHouseIncome || 0,
          StandardDeduction30Percent: Math.round((taxData.RentedHouseIncome || 0) * 0.3),
        },
        SelfOccupied: {
          InterestPayable: taxData.OwnHouseIncome || 0,
        },
      },

      ScheduleOS: {
        // Other Sources
        IncomeOthSrc: taxData.OtherIncome || 0,
      },

      ScheduleVIA: {
        // Chapter VI-A Deductions
        DeductUndChapVIA: {
          Section80C: taxData.section80C || 0,
          Section80CCC: taxData.section80CCC || 0,
          Section80CCD1: taxData.section80CCD1 || 0,
          Section80CCD1B: taxData.section80CCD1B || 0,
          Section80CCD2: taxData.section80CCD2 || 0,
          Section80D: taxData.section80D || 0,
          Section80DD: taxData.section80DD || 0,
          Section80DDB: taxData.section80DDB || 0,
          Section80E: taxData.section80E || 0,
          Section80EE: taxData.section80EE || 0,
          Section80G: taxData.section80G || 0,
          Section80GGA: taxData.section80GGA || 0,
          Section80GGC: taxData.section80GGC || 0,
          Section80TTA: taxData.section80TTA || 0,
          Section80U: taxData.section80U || 0,
          TotalChapVIADeductions: taxData.TotalDeductions || 0,
        },
      },

      PartBTI: {
        // Total Income computation
        GrossTotalIncome: taxData.TotalIncome || 0,
        TotalDeductions: isOld ? (taxData.TotalDeductions || 0) : 0,
        TotalIncome: isOld
          ? (taxData.TotalTaxableIncome || 0)
          : (taxData.TotalIncome || 0),
      },

      PartBTTI: {
        // Tax computation
        ComputationOfTaxLiability: {
          TaxRegime: isOld ? 'O' : 'N',
          TotalIncomeForTax: isOld
            ? Math.max(0, (taxData.TotalTaxableIncome || 0) - 75000) // after std deduction
            : (taxData.TotalIncome || 0),
          TaxPayableOnTI: taxBeforeCess,
          Rebate87A: taxBeforeCess === 0 ? 0 : 0, // already factored into tax computation
          TaxPayableAfterRebate: taxBeforeCess,
          Surcharge: 0,
          HealthAndEducationCess: totalCess,
          GrossTaxLiability: totalTax,
          TDSClaimed: taxData.TaxDeducted || 0,
          BalanceTaxPayable: Math.max(0, totalTax - (taxData.TaxDeducted || 0)),
          RefundDue: Math.max(0, (taxData.TaxDeducted || 0) - totalTax),
        },
      },

      Verification: {
        Declaration: `I, ${taxData.Name || taxData.FirstName || ''}, hereby declare that the information given in this return is true, correct, and complete.`,
        Place: taxData.City || '',
        Date: new Date().toISOString().split('T')[0],
      },

      EmployerDetails: {
        EmployerName: taxData.employerName || '',
        EmployerAddress: taxData.employerAddress || '',
        EmployerPAN: taxData.employerPanNumber || '',
        TAN: taxData.tanNumber || '',
        EmployeeRefNo: taxData.employeeReferenceNo || '',
      },
    },

    _metadata: {
      generatedBy: 'TaxSarthi',
      generatedAt: new Date().toISOString(),
      version: '1.0',
      disclaimer:
        'This JSON is auto-generated based on data provided by the user. Please verify all fields before uploading to incometax.gov.in. TaxSarthi is not responsible for any discrepancies.',
    },
  };
};

module.exports = { generateITR1JSON };
