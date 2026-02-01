import React, { useState } from "react";
import "./FormNew.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Home, 
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function FormNew() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: false,
    employer: false,
    income: false,
    deductions: false
  });

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    fatherName: "",
    gender: "",
    maritalStatus: "",
    panCard: "",
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    mobileNo: "",
    email: "",
    address: "",
    permanentAddress: "",
    city: "",
    state: "",
    pinCode: "",
    sameAsAddress: false
  });

  // Employer Information
  const [employerInfo, setEmployerInfo] = useState({
    employerName: "",
    employerAddress: "",
    employerPan: "",
    tanNumber: "",
    employeeRefNo: "",
    assessmentYear: "",
    taxDeducted: ""
  });

  // Income Information
  const [incomeInfo, setIncomeInfo] = useState({
    salary: "",
    allowances: "",
    prerequisites: "",
    profitIncome: "",
    hra: "",
    lta: "",
    otherAllowances: "",
    professionalTax: ""
  });

  // Deductions
  const [deductions, setDeductions] = useState({
    section80C: "",
    section80D: "",
    section80E: "",
    section80G: "",
    homeLoanInterest: "",
    nps: ""
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:8000/api/tax/save", {
        ...personalInfo,
        ...contactInfo,
        ...employerInfo,
        ...incomeInfo,
        ...deductions
      });
      
      toast.success("Data saved successfully!");
      setTimeout(() => {
        navigate("/doc");
      }, 1500);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  const handleReset = () => {
    setPersonalInfo({
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      fatherName: "",
      gender: "",
      maritalStatus: "",
      panCard: "",
    });
    setContactInfo({
      mobileNo: "",
      email: "",
      address: "",
      permanentAddress: "",
      city: "",
      state: "",
      pinCode: "",
      sameAsAddress: false
    });
    setEmployerInfo({
      employerName: "",
      employerAddress: "",
      employerPan: "",
      tanNumber: "",
      employeeRefNo: "",
      assessmentYear: "",
      taxDeducted: ""
    });
    setIncomeInfo({
      salary: "",
      allowances: "",
      prerequisites: "",
      profitIncome: "",
      hra: "",
      lta: "",
      otherAllowances: "",
      professionalTax: ""
    });
    setDeductions({
      section80C: "",
      section80D: "",
      section80E: "",
      section80G: "",
      homeLoanInterest: "",
      nps: ""
    });
    toast.info("Form reset successfully");
  };

  return (
    <div className="modern-form-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1 className="form-title">Income Tax Return Form</h1>
          <p className="form-subtitle">Fill in your details for tax calculation and filing</p>
        </div>

        <form onSubmit={handleSubmit} className="modern-form">
          
          {/* Personal Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('personal')}
            >
              <div className="section-header-content">
                <User className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Personal Information</h2>
                  <p className="section-desc">Basic details as per government ID</p>
                </div>
              </div>
              {expandedSections.personal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.personal && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">First Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter first name"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Middle Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter middle name"
                      value={personalInfo.middleName}
                      onChange={(e) => setPersonalInfo({...personalInfo, middleName: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Last Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter last name"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Date of Birth *</label>
                    <input
                      type="date"
                      className="field-input"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Father's Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter father's name"
                      value={personalInfo.fatherName}
                      onChange={(e) => setPersonalInfo({...personalInfo, fatherName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Gender *</label>
                    <select
                      className="field-input"
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Marital Status *</label>
                    <select
                      className="field-input"
                      value={personalInfo.maritalStatus}
                      onChange={(e) => setPersonalInfo({...personalInfo, maritalStatus: e.target.value})}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">PAN Card *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCDE1234F"
                      value={personalInfo.panCard}
                      onChange={(e) => setPersonalInfo({...personalInfo, panCard: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('contact')}
            >
              <div className="section-header-content">
                <MapPin className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Contact Information</h2>
                  <p className="section-desc">Address and communication details</p>
                </div>
              </div>
              {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.contact && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="field-input"
                      placeholder="10-digit mobile number"
                      value={contactInfo.mobileNo}
                      onChange={(e) => setContactInfo({...contactInfo, mobileNo: e.target.value})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Email Address *</label>
                    <input
                      type="email"
                      className="field-input"
                      placeholder="your@email.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Current Address *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="House no., Street, Locality"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">
                      Permanent Address
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={contactInfo.sameAsAddress}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setContactInfo({
                              ...contactInfo,
                              sameAsAddress: checked,
                              permanentAddress: checked ? contactInfo.address : ""
                            });
                          }}
                        />
                        <span className="checkbox-text">Same as current address</span>
                      </label>
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="House no., Street, Locality"
                      value={contactInfo.sameAsAddress ? contactInfo.address : contactInfo.permanentAddress}
                      onChange={(e) => setContactInfo({...contactInfo, permanentAddress: e.target.value})}
                      disabled={contactInfo.sameAsAddress}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">City *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter city"
                      value={contactInfo.city}
                      onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">State/UT *</label>
                    <select
                      className="field-input"
                      value={contactInfo.state}
                      onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">PIN Code *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="6-digit PIN"
                      value={contactInfo.pinCode}
                      onChange={(e) => setContactInfo({...contactInfo, pinCode: e.target.value})}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employer Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('employer')}
            >
              <div className="section-header-content">
                <Briefcase className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Employer Information</h2>
                  <p className="section-desc">Details about your current employer</p>
                </div>
              </div>
              {expandedSections.employer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.employer && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="field-label">Employer Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Company/Organization name"
                      value={employerInfo.employerName}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Employer Address *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Complete address"
                      value={employerInfo.employerAddress}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerAddress: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Employer PAN *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCDE1234F"
                      value={employerInfo.employerPan}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerPan: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">TAN Number *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCD12345E"
                      value={employerInfo.tanNumber}
                      onChange={(e) => setEmployerInfo({...employerInfo, tanNumber: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Employee Reference No.</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Employee ID/Reference"
                      value={employerInfo.employeeRefNo}
                      onChange={(e) => setEmployerInfo({...employerInfo, employeeRefNo: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Assessment Year *</label>
                    <select
                      className="field-input"
                      value={employerInfo.assessmentYear}
                      onChange={(e) => setEmployerInfo({...employerInfo, assessmentYear: e.target.value})}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                      <option value="2022-23">2022-23</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Tax Deducted (TDS)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="Amount in ₹"
                      value={employerInfo.taxDeducted}
                      onChange={(e) => setEmployerInfo({...employerInfo, taxDeducted: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Income Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('income')}
            >
              <div className="section-header-content">
                <IndianRupee className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Income Details</h2>
                  <p className="section-desc">Salary and other income sources</p>
                </div>
              </div>
              {expandedSections.income ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.income && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Gross Salary *</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.salary}
                      onChange={(e) => setIncomeInfo({...incomeInfo, salary: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Allowances</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.allowances}
                      onChange={(e) => setIncomeInfo({...incomeInfo, allowances: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Perquisites</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.prerequisities}
                      onChange={(e) => setIncomeInfo({...incomeInfo, prerequisites: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Profit from Business</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.profitIncome}
                      onChange={(e) => setIncomeInfo({...incomeInfo, profitIncome: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">HRA Received</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.hra}
                      onChange={(e) => setIncomeInfo({...incomeInfo, hra: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">LTA</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.lta}
                      onChange={(e) => setIncomeInfo({...incomeInfo, lta: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Other Exempt Allowances</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.otherAllowances}
                      onChange={(e) => setIncomeInfo({...incomeInfo, otherAllowances: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Professional Tax</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.professionalTax}
                      onChange={(e) => setIncomeInfo({...incomeInfo, professionalTax: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deductions Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('deductions')}
            >
              <div className="section-header-content">
                <FileText className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Deductions</h2>
                  <p className="section-desc">Tax saving investments and deductions</p>
                </div>
              </div>
              {expandedSections.deductions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.deductions && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Section 80C (Max ₹1.5L)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80C}
                      onChange={(e) => setDeductions({...deductions, section80C: e.target.value})}
                      max={150000}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80D (Health Insurance)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80D}
                      onChange={(e) => setDeductions({...deductions, section80D: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80E (Education Loan)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80E}
                      onChange={(e) => setDeductions({...deductions, section80E: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80G (Donations)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80G}
                      onChange={(e) => setDeductions({...deductions, section80G: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Home Loan Interest (Max ₹2L)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.homeLoanInterest}
                      onChange={(e) => setDeductions({...deductions, homeLoanInterest: e.target.value})}
                      max={200000}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">NPS (Max ₹50K)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.nps}
                      onChange={(e) => setDeductions({...deductions, nps: e.target.value})}
                      max={50000}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Reset Form
            </button>
            <button type="submit" className="btn-primary">
              Calculate Tax & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormNew;
