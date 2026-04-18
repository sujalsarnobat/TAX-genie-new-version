import React, { useEffect, useState, useRef } from "react";
import "./OutPutDoc.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Download,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  Calendar,
  Hash,
  IndianRupee,
  Shield,
  FileDown,
} from "lucide-react";

const generateRandomNumber = () =>
  Math.floor(10000 + Math.random() * 90000);

const getCurrentDate = () => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
};

const formatCurrency = (val) => {
  if (val === undefined || val === null || val === "N/A") return "—";
  const num = Number(val);
  if (isNaN(num)) return "—";
  if (num === 0) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
};

function OutPutDoc() {
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const Token = localStorage.getItem("token");

  // Force black background on body to override Bootstrap's white --bs-body-bg
  useEffect(() => {
    document.body.style.background = "#0a0a0a";
    return () => { document.body.style.background = ""; };
  }, []);

  const [invoiceNumber] = useState(() => {
    const stored = localStorage.getItem("invoiceNumber");
    return stored ? parseInt(stored, 10) : generateRandomNumber();
  });
  const invoiceDate = getCurrentDate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Old Regime slab definitions (Age < 60)
  const OldSlabDefs = [
    { label: "₹0 — ₹2.5L", rate: "0%", min: 0, max: 250000, pct: 0 },
    { label: "₹2.5L — ₹5L", rate: "5%", min: 250000, max: 500000, pct: 0.05 },
    { label: "₹5L — ₹10L", rate: "20%", min: 500000, max: 1000000, pct: 0.20 },
    { label: "₹10L+", rate: "30%", min: 1000000, max: Infinity, pct: 0.30 },
  ];

  // New Regime 2025 slab definitions
  const NewSlabDefs = [
    { label: "₹0 — ₹4L", rate: "0%", min: 0, max: 400000, pct: 0 },
    { label: "₹4L — ₹8L", rate: "5%", min: 400000, max: 800000, pct: 0.05 },
    { label: "₹8L — ₹12L", rate: "10%", min: 800000, max: 1200000, pct: 0.10 },
    { label: "₹12L — ₹16L", rate: "15%", min: 1200000, max: 1600000, pct: 0.15 },
    { label: "₹16L — ₹20L", rate: "20%", min: 1600000, max: 2000000, pct: 0.20 },
    { label: "₹20L — ₹24L", rate: "25%", min: 2000000, max: 2400000, pct: 0.25 },
    { label: "₹24L+", rate: "30%", min: 2400000, max: Infinity, pct: 0.30 },
  ];

  // Compute slab-wise tax from taxable income (with 87A rebate)
  const computeSlabTax = (taxableIncome, slabs, rebateLimit) => {
    const income = Math.max(0, taxableIncome || 0);
    const results = slabs.map((slab) => {
      const taxable = Math.max(0, Math.min(income, slab.max) - slab.min);
      return { ...slab, tax: Math.round(taxable * slab.pct) };
    });
    // 87A Rebate: if income below rebate limit, all slab taxes become 0
    if (income < rebateLimit) {
      return results.map((r) => ({ ...r, tax: 0 }));
    }
    return results;
  };

  const STANDARD_DEDUCTION = 75000;
  // Old Regime: TotalIncome - TotalDeductions - StandardDeduction (matches server pre-save hook)
  const oldTaxableIncome = userData
    ? Math.max(0, (userData.TotalTaxableIncome || 0) - STANDARD_DEDUCTION)
    : 0;
  // New Regime: uses gross TotalIncome (no deductions, matches server)
  const newTaxableIncome = userData ? (userData.TotalIncome || 0) : 0;
  const oldSlabResults = computeSlabTax(oldTaxableIncome, OldSlabDefs, 500000);
  const newSlabResults = computeSlabTax(newTaxableIncome, NewSlabDefs, 1200000);

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://localhost:8000/api/v1/tax/calculationbody", { Token })
      .then((result) => setUserData(result.data))
      .catch(() => toast.error("Failed to load tax data"))
      .finally(() => setLoading(false));
  }, [Token]);

  useEffect(() => {
    localStorage.setItem("invoiceNumber", invoiceNumber.toString());
  }, [invoiceNumber]);

  async function onclickDownload() {
    const el = document.querySelector("#OutPutSec");
    const data = await html2canvas(el, { scale: 2, backgroundColor: "#0a0a0a" });
    const img = data.toDataURL("image/png");
    const doc = new jsPDF("portrait", "pt", "a4");
    const pdfWidth = doc.internal.pageSize.getWidth() - 20;
    const pdfHeight = (data.height * pdfWidth) / data.width;
    doc.addImage(img, "PNG", 10, 15, pdfWidth, pdfHeight);
    doc.save(`TaxSarthi-Report-${invoiceNumber}.pdf`);
  }

  const [itrLoading, setItrLoading] = useState(false);

  async function downloadITR1JSON() {
    if (!Token) {
      toast.error("No token found");
      return;
    }
    setItrLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/v1/tax/generate-itr1", { Token });
      const itrData = res.data.data;
      const blob = new Blob([JSON.stringify(itrData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ITR1-${userData?.Name || "TaxSarthi"}-${userData?.Year || "2025-26"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("ITR-1 JSON downloaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate ITR-1");
    } finally {
      setItrLoading(false);
    }
  }

  const d = (field) => (userData ? userData[field] : null);
  const show = (field) => {
    const val = d(field);
    return val !== undefined && val !== null && val !== "" && val !== 0 ? val : "—";
  };

  const preferred = d("PreferredSystem");
  const isOldBetter = preferred === "OldRegime";
  const isNewBetter = preferred === "NewRegime";

  if (loading) {
    return (
      <div className="doc-loading">
        <div className="doc-loading-spinner" />
        <p>Loading your tax report...</p>
      </div>
    );
  }

  return (
    <div className="doc-page">
      {/* Top Action Bar */}
      <div className="doc-actions">
        <button className="doc-btn doc-btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="doc-actions-right">
          <button className="doc-btn doc-btn-ghost" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="doc-btn doc-btn-primary" onClick={onclickDownload}>
            <Download size={16} /> Download PDF
          </button>
          <button
            className="doc-btn doc-btn-secondary"
            onClick={downloadITR1JSON}
            disabled={itrLoading}
            title="Download ITR-1 JSON for incometax.gov.in"
          >
            <FileDown size={16} /> {itrLoading ? "Generating..." : "ITR-1 JSON"}
          </button>
          <button
            className="doc-btn doc-btn-ghost"
            onClick={() => { localStorage.clear(); navigate("/login"); }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <section id="OutPutSec" ref={pdfRef} className="doc-invoice">
        {/* Header */}
        <div className="doc-header">
          <div className="doc-header-left">
            <h1 className="doc-brand">TaxSarthi</h1>
            <p className="doc-tagline">Your Tax Computation Report</p>
          </div>
          <div className="doc-header-right">
            <div className="doc-header-badge">Tax Invoice</div>
            <div className="doc-header-meta">
              <div className="doc-meta-item">
                <Hash size={13} />
                <span>{invoiceNumber}</span>
              </div>
              <div className="doc-meta-item">
                <Calendar size={13} />
                <span>{invoiceDate}</span>
              </div>
              <div className="doc-meta-item">
                <FileText size={13} />
                <span>AY 2025-26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal + Employer Cards */}
        <div className="doc-info-grid">
          <div className="doc-card">
            <div className="doc-card-header">
              <User size={16} />
              <span>Personal Details</span>
            </div>
            <div className="doc-card-body">
              <h3 className="doc-card-name">{show("Name")}</h3>
              <div className="doc-detail-grid">
                <div className="doc-detail">
                  <span className="doc-label">Email</span>
                  <span className="doc-value">{show("Email")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Mobile</span>
                  <span className="doc-value">{show("MobileNo")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">PAN</span>
                  <span className="doc-value doc-mono">{show("PanCard")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Aadhaar</span>
                  <span className="doc-value doc-mono">{show("AadharNo")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">DOB</span>
                  <span className="doc-value">{show("DateOfBirth")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Father's Name</span>
                  <span className="doc-value">{show("FatherName")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Gender</span>
                  <span className="doc-value">{show("Gender")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Marital Status</span>
                  <span className="doc-value">{show("MaritalStatus")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="doc-card">
            <div className="doc-card-header">
              <Briefcase size={16} />
              <span>Employer Details</span>
            </div>
            <div className="doc-card-body">
              <h3 className="doc-card-name">{show("employerName")}</h3>
              <div className="doc-detail-grid">
                <div className="doc-detail">
                  <span className="doc-label">Address</span>
                  <span className="doc-value">{show("employerAddress")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Employer PAN</span>
                  <span className="doc-value doc-mono">{show("employerPanNumber")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">TAN</span>
                  <span className="doc-value doc-mono">{show("tanNumber")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Employee Ref</span>
                  <span className="doc-value">{show("employeeReferenceNo")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">Assessment Year</span>
                  <span className="doc-value">{show("Year")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">TDS Deducted</span>
                  <span className="doc-value">{formatCurrency(d("TaxDeducted"))}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">City</span>
                  <span className="doc-value">{show("City")}</span>
                </div>
                <div className="doc-detail">
                  <span className="doc-label">State</span>
                  <span className="doc-value">{show("selectedState")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="doc-stats-row">
          <div className="doc-stat">
            <span className="doc-stat-label">Status</span>
            <span className="doc-stat-value">Individual</span>
          </div>
          <div className="doc-stat">
            <span className="doc-stat-label">Residential</span>
            <span className="doc-stat-value">Resident</span>
          </div>
          <div className="doc-stat">
            <span className="doc-stat-label">Gender</span>
            <span className="doc-stat-value">{show("Gender")}</span>
          </div>
          <div className="doc-stat">
            <span className="doc-stat-label">Recommended Regime</span>
            <span className={`doc-stat-value ${preferred ? "doc-regime-badge" : ""}`}>
              {preferred === "OldRegime"
                ? "Old Regime"
                : preferred === "NewRegime"
                ? "New Regime"
                : "—"}
            </span>
          </div>
        </div>

        {/* Tax Summary */}
        <div className="doc-section">
          <div className="doc-section-title">
            <IndianRupee size={18} />
            <span>Tax Summary</span>
          </div>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th className="doc-col-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Salary Income</td>
                <td className="doc-col-right">{formatCurrency(d("Salary"))}</td>
              </tr>
              {d("PrerequisiteIncome") > 0 && (
                <tr>
                  <td>Perquisites</td>
                  <td className="doc-col-right">{formatCurrency(d("PrerequisiteIncome"))}</td>
                </tr>
              )}
              {d("ProfitIncome") > 0 && (
                <tr>
                  <td>Profit in lieu of Salary</td>
                  <td className="doc-col-right">{formatCurrency(d("ProfitIncome"))}</td>
                </tr>
              )}
              {d("OtherIncome") > 0 && (
                <tr>
                  <td>Other Income / Allowances</td>
                  <td className="doc-col-right">{formatCurrency(d("OtherIncome"))}</td>
                </tr>
              )}
              <tr className="doc-row-highlight">
                <td><strong>Gross Total Income</strong></td>
                <td className="doc-col-right">
                  <strong>{formatCurrency(d("TotalIncome"))}</strong>
                </td>
              </tr>
              <tr>
                <td>Total Deductions (Sec 80C-80U + HRA + LTA etc.)</td>
                <td className="doc-col-right">{formatCurrency(d("TotalDeductions"))}</td>
              </tr>
              <tr>
                <td>Standard Deduction</td>
                <td className="doc-col-right">{formatCurrency(STANDARD_DEDUCTION)}</td>
              </tr>
              <tr className="doc-row-highlight">
                <td><strong>Net Taxable Income (Old Regime)</strong></td>
                <td className="doc-col-right">
                  <strong>{formatCurrency(oldTaxableIncome)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regime Comparison */}
        <div className="doc-section">
          <div className="doc-section-title">
            <TrendingUp size={18} />
            <span>Regime Comparison</span>
          </div>
          <table className="doc-table doc-compare-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th className="doc-col-center">
                  Old Regime
                  {isOldBetter && <ThumbsUp size={14} className="doc-thumb" />}
                </th>
                <th className="doc-col-center">
                  New Regime
                  {isNewBetter && <ThumbsUp size={14} className="doc-thumb" />}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gross Total Income</td>
                <td className="doc-col-center">{formatCurrency(d("TotalIncome"))}</td>
                <td className="doc-col-center">{formatCurrency(d("TotalIncome"))}</td>
              </tr>
              <tr>
                <td>Deductions / Exemptions</td>
                <td className="doc-col-center">
                  {formatCurrency((d("TotalDeductions") || 0) + STANDARD_DEDUCTION)}
                </td>
                <td className="doc-col-center">—</td>
              </tr>
              <tr>
                <td>Taxable Income</td>
                <td className="doc-col-center">{formatCurrency(oldTaxableIncome)}</td>
                <td className="doc-col-center">{formatCurrency(newTaxableIncome)}</td>
              </tr>
              <tr>
                <td>Income Tax</td>
                <td className="doc-col-center">
                  {userData ? formatCurrency(d("OldFinalTax") - d("OldFinalCess")) : "—"}
                </td>
                <td className="doc-col-center">
                  {userData ? formatCurrency(d("NewFinalTax") - d("NewFinalCess")) : "—"}
                </td>
              </tr>
              <tr>
                <td>Health &amp; Education Cess (4%)</td>
                <td className="doc-col-center">{formatCurrency(d("OldFinalCess"))}</td>
                <td className="doc-col-center">{formatCurrency(d("NewFinalCess"))}</td>
              </tr>
              <tr className="doc-row-total">
                <td><strong>Total Tax Payable</strong></td>
                <td className={`doc-col-center ${isOldBetter ? "doc-better" : ""}`}>
                  <strong>{formatCurrency(d("OldFinalTax"))}</strong>
                </td>
                <td className={`doc-col-center ${isNewBetter ? "doc-better" : ""}`}>
                  <strong>{formatCurrency(d("NewFinalTax"))}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Recommendation Banner */}
          {preferred && (
            <div className={`doc-recommendation ${isOldBetter ? "doc-rec-old" : "doc-rec-new"}`}>
              <Shield size={18} />
              <span>
                <strong>{isOldBetter ? "Old Regime" : "New Regime"}</strong> is recommended for you
                {userData && (
                  <>
                    {" "}&mdash; you save{" "}
                    <strong>
                      {formatCurrency(
                        Math.abs((d("OldFinalTax") || 0) - (d("NewFinalTax") || 0))
                      )}
                    </strong>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Slab Breakup */}
        <div className="doc-section">
          <div className="doc-section-title">
            <TrendingDown size={18} />
            <span>Slab-wise Tax Breakup</span>
          </div>
          <div className="doc-slab-grid">
            {/* Old Regime */}
            <div className="doc-slab-card">
              <div className="doc-slab-card-header">
                Old Regime (Age &lt; 60)
                {isOldBetter && <ThumbsUp size={14} className="doc-thumb" />}
              </div>
              <table className="doc-table doc-slab-table">
                <thead>
                  <tr>
                    <th>Income Slab</th>
                    <th className="doc-col-center">Rate</th>
                    <th className="doc-col-right">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {oldSlabResults.map((slab, i) => (
                    <tr key={i}>
                      <td>{slab.label}</td>
                      <td className="doc-col-center">{slab.rate}</td>
                      <td className="doc-col-right">{formatCurrency(slab.tax)}</td>
                    </tr>
                  ))}
                  <tr className="doc-slab-subtotal">
                    <td><strong>Tax</strong></td>
                    <td></td>
                    <td className="doc-col-right">
                      <strong>
                        {userData
                          ? formatCurrency(d("OldFinalTax") - d("OldFinalCess"))
                          : "—"}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Cess (4%)</td>
                    <td className="doc-col-center">4%</td>
                    <td className="doc-col-right">{formatCurrency(d("OldFinalCess"))}</td>
                  </tr>
                  <tr className="doc-row-total">
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td className="doc-col-right">
                      <strong>{formatCurrency(d("OldFinalTax"))}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* New Regime */}
            <div className="doc-slab-card">
              <div className="doc-slab-card-header">
                New Regime (2025)
                {isNewBetter && <ThumbsUp size={14} className="doc-thumb" />}
              </div>
              <table className="doc-table doc-slab-table">
                <thead>
                  <tr>
                    <th>Income Slab</th>
                    <th className="doc-col-center">Rate</th>
                    <th className="doc-col-right">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {newSlabResults.map((slab, i) => (
                    <tr key={i}>
                      <td>{slab.label}</td>
                      <td className="doc-col-center">{slab.rate}</td>
                      <td className="doc-col-right">{formatCurrency(slab.tax)}</td>
                    </tr>
                  ))}
                  <tr className="doc-slab-subtotal">
                    <td><strong>Tax</strong></td>
                    <td></td>
                    <td className="doc-col-right">
                      <strong>
                        {userData
                          ? formatCurrency(d("NewFinalTax") - d("NewFinalCess"))
                          : "—"}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Cess (4%)</td>
                    <td className="doc-col-center">4%</td>
                    <td className="doc-col-right">{formatCurrency(d("NewFinalCess"))}</td>
                  </tr>
                  <tr className="doc-row-total">
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td className="doc-col-right">
                      <strong>{formatCurrency(d("NewFinalTax"))}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="doc-footer">
          <div className="doc-footer-top">
            <div className="doc-footer-terms">
              <h4>Terms &amp; Conditions</h4>
              <p>
                This is a computer-generated tax computation report based on the data you provided.
                Please verify all figures with your CA before filing. TaxSarthi is not liable for
                any discrepancies arising from incorrect inputs.
              </p>
            </div>
            <div className="doc-footer-sign">
              <div className="doc-sign-line"></div>
              <p>Authorized Signature</p>
            </div>
          </div>
          <div className="doc-footer-contact">
            <a href="tel:+00123647840">
              <Phone size={14} /> +00 123 647 840
            </a>
            <a href="mailto:info@taxsarthi.com">
              <Mail size={14} /> info@taxsarthi.com
            </a>
            <a href="#location">
              <MapPin size={14} /> 169 Mumbai, India
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OutPutDoc;
