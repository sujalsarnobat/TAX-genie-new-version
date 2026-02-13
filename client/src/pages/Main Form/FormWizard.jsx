import React, { useState, useEffect } from "react";
import "./FormWizard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle
} from "lucide-react";

// Validation patterns
const PATTERNS = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  mobile: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  pin: /^\d{6}$/,
  tan: /^[A-Z]{4}\d{5}[A-Z]{1}$/
};

// Step configuration
const STEPS = [
  { id: 1, title: "Personal", subtitle: "Your basic details", icon: User },
  { id: 2, title: "Contact", subtitle: "Address & communication", icon: MapPin },
  { id: 3, title: "Employer", subtitle: "Employment details", icon: Briefcase },
  { id: 4, title: "Income", subtitle: "Earnings & salary", icon: IndianRupee },
  { id: 5, title: "Deductions", subtitle: "Tax savings", icon: FileText }
];

function FormWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grouped State Management
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    fatherName: "",
    gender: "",
    maritalStatus: "",
    panCard: ""
  });

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

  const [employerInfo, setEmployerInfo] = useState({
    employerName: "",
    employerAddress: "",
    employerPan: "",
    tanNumber: "",
    employeeRefNo: "",
    assessmentYear: "2024-25",
    taxDeducted: ""
  });

  const [incomeInfo, setIncomeInfo] = useState({
    grossSalary: "",
    allowances: "",
    perquisites: "",
    profitIncome: "",
    hra: "",
    lta: "",
    otherAllowances: "",
    professionalTax: ""
  });

  const [deductions, setDeductions] = useState({
    section80C: "",
    section80D: "",
    section80E: "",
    section80G: "",
    homeLoanInterest: "",
    nps: ""
  });

  // Inline Validation
  const validateField = (name, value, pattern) => {
    if (pattern && value && !pattern.test(value)) {
      return false;
    }
    return true;
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!personalInfo.firstName.trim()) newErrors.firstName = "First name is required";
        if (!personalInfo.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!personalInfo.fatherName.trim()) newErrors.fatherName = "Father's name is required";
        if (!personalInfo.gender) newErrors.gender = "Please select gender";
        if (!personalInfo.panCard) {
          newErrors.panCard = "PAN is required";
        } else if (!PATTERNS.pan.test(personalInfo.panCard)) {
          newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";
        }
        break;
      case 2:
        if (!contactInfo.mobileNo) {
          newErrors.mobileNo = "Mobile number is required";
        } else if (!PATTERNS.mobile.test(contactInfo.mobileNo)) {
          newErrors.mobileNo = "Invalid mobile number";
        }
        if (!contactInfo.email) {
          newErrors.email = "Email is required";
        } else if (!PATTERNS.email.test(contactInfo.email)) {
          newErrors.email = "Invalid email format";
        }
        if (!contactInfo.address.trim()) newErrors.address = "Address is required";
        if (!contactInfo.city.trim()) newErrors.city = "City is required";
        if (!contactInfo.state) newErrors.state = "State is required";
        if (!PATTERNS.pin.test(contactInfo.pinCode)) newErrors.pinCode = "Invalid PIN code";
        break;
      case 3:
        if (!employerInfo.employerName.trim()) newErrors.employerName = "Employer name is required";
        if (!employerInfo.employerPan) {
          newErrors.employerPan = "Employer PAN is required";
        } else if (!PATTERNS.pan.test(employerInfo.employerPan)) {
          newErrors.employerPan = "Invalid PAN format";
        }
        if (employerInfo.tanNumber && !PATTERNS.tan.test(employerInfo.tanNumber)) {
          newErrors.tanNumber = "Invalid TAN format";
        }
        break;
      case 4:
        if (!incomeInfo.grossSalary) newErrors.grossSalary = "Gross salary is required";
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.form-field.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstErrorField.querySelector('input, select');
        if (input) input.focus();
      }
      toast.error("Please fill in all required fields correctly", {
        position: "top-center",
        autoClose: 3000
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      const firstErrorField = document.querySelector('.form-field.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstErrorField.querySelector('input, select');
        if (input) input.focus();
      }
      toast.error("Please fill in all required fields", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("http://localhost:8000/api/tax/save", {
        ...personalInfo,
        ...contactInfo,
        ...employerInfo,
        ...incomeInfo,
        ...deductions
      });
      
      toast.success("Tax details saved successfully!");
      setTimeout(() => navigate("/doc"), 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (setter, field, value, pattern = null) => {
    setter(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Progress percentage
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((step, index) => (
          <div 
            key={step.id} 
            className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            onClick={() => currentStep > step.id && setCurrentStep(step.id)}
          >
            <div className="step-icon-wrapper">
              {currentStep > step.id ? (
                <Check size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <div className="step-text">
              <span className="step-title">{step.title}</span>
              <span className="step-subtitle">{step.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="wizard-content">
        <div className="wizard-card">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="step-header">
                <h2 className="step-heading">Personal Information</h2>
                <p className="step-description">Enter your details as per government ID documents</p>
              </div>
              
              <div className="form-grid">
                <div className={`form-field ${errors.firstName ? 'error' : ''}`}>
                  <label className="field-label">First Name *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter first name"
                    value={personalInfo.firstName}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'firstName', e.target.value)}
                  />
                  {errors.firstName && <span className="error-message"><AlertCircle size={14} /> {errors.firstName}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">Middle Name</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter middle name"
                    value={personalInfo.middleName}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'middleName', e.target.value)}
                  />
                </div>

                <div className={`form-field ${errors.lastName ? 'error' : ''}`}>
                  <label className="field-label">Last Name *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter last name"
                    value={personalInfo.lastName}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'lastName', e.target.value)}
                  />
                  {errors.lastName && <span className="error-message"><AlertCircle size={14} /> {errors.lastName}</span>}
                </div>

                <div className={`form-field ${errors.dateOfBirth ? 'error' : ''}`}>
                  <label className="field-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="field-input"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'dateOfBirth', e.target.value)}
                  />
                  {errors.dateOfBirth && <span className="error-message"><AlertCircle size={14} /> {errors.dateOfBirth}</span>}
                </div>

                <div className={`form-field ${errors.fatherName ? 'error' : ''}`}>
                  <label className="field-label">Father's Name *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter father's name"
                    value={personalInfo.fatherName}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'fatherName', e.target.value)}
                  />
                  {errors.fatherName && <span className="error-message"><AlertCircle size={14} /> {errors.fatherName}</span>}
                </div>

                <div className={`form-field ${errors.gender ? 'error' : ''}`}>
                  <label className="field-label">Gender *</label>
                  <select
                    className="field-input"
                    value={personalInfo.gender}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-message"><AlertCircle size={14} /> {errors.gender}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">Marital Status</label>
                  <select
                    className="field-input"
                    value={personalInfo.maritalStatus}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'maritalStatus', e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div className={`form-field ${errors.panCard ? 'error' : ''}`}>
                  <label className="field-label">PAN Card *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="ABCDE1234F"
                    value={personalInfo.panCard}
                    onChange={(e) => handleInputChange(setPersonalInfo, 'panCard', e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                  {errors.panCard && <span className="error-message"><AlertCircle size={14} /> {errors.panCard}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-header">
                <h2 className="step-heading">Contact Information</h2>
                <p className="step-description">Your address and communication details</p>
              </div>
              
              <div className="form-grid">
                <div className={`form-field ${errors.mobileNo ? 'error' : ''}`}>
                  <label className="field-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="field-input"
                    placeholder="10-digit mobile"
                    value={contactInfo.mobileNo}
                    onChange={(e) => handleInputChange(setContactInfo, 'mobileNo', e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />
                  {errors.mobileNo && <span className="error-message"><AlertCircle size={14} /> {errors.mobileNo}</span>}
                </div>

                <div className={`form-field ${errors.email ? 'error' : ''}`}>
                  <label className="field-label">Email Address *</label>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="your@email.com"
                    value={contactInfo.email}
                    onChange={(e) => handleInputChange(setContactInfo, 'email', e.target.value)}
                  />
                  {errors.email && <span className="error-message"><AlertCircle size={14} /> {errors.email}</span>}
                </div>

                <div className={`form-field full-width ${errors.address ? 'error' : ''}`}>
                  <label className="field-label">Current Address *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="House no., Street, Locality"
                    value={contactInfo.address}
                    onChange={(e) => handleInputChange(setContactInfo, 'address', e.target.value)}
                  />
                  {errors.address && <span className="error-message"><AlertCircle size={14} /> {errors.address}</span>}
                </div>

                <div className="form-field full-width">
                  <div className="checkbox-row">
                    <label className="field-label">Permanent Address</label>
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={contactInfo.sameAsAddress}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setContactInfo(prev => ({
                            ...prev,
                            sameAsAddress: checked,
                            permanentAddress: checked ? prev.address : ""
                          }));
                        }}
                      />
                      <span className="checkbox-label-text">Same as current</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="House no., Street, Locality"
                    value={contactInfo.sameAsAddress ? contactInfo.address : contactInfo.permanentAddress}
                    onChange={(e) => handleInputChange(setContactInfo, 'permanentAddress', e.target.value)}
                    disabled={contactInfo.sameAsAddress}
                  />
                </div>

                <div className={`form-field ${errors.city ? 'error' : ''}`}>
                  <label className="field-label">City *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter city"
                    value={contactInfo.city}
                    onChange={(e) => handleInputChange(setContactInfo, 'city', e.target.value)}
                  />
                  {errors.city && <span className="error-message"><AlertCircle size={14} /> {errors.city}</span>}
                </div>

                <div className={`form-field ${errors.state ? 'error' : ''}`}>
                  <label className="field-label">State/UT *</label>
                  <select
                    className="field-input"
                    value={contactInfo.state}
                    onChange={(e) => handleInputChange(setContactInfo, 'state', e.target.value)}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                  {errors.state && <span className="error-message"><AlertCircle size={14} /> {errors.state}</span>}
                </div>

                <div className={`form-field ${errors.pinCode ? 'error' : ''}`}>
                  <label className="field-label">PIN Code *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="6-digit PIN"
                    value={contactInfo.pinCode}
                    onChange={(e) => handleInputChange(setContactInfo, 'pinCode', e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                  />
                  {errors.pinCode && <span className="error-message"><AlertCircle size={14} /> {errors.pinCode}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Employer Information */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="step-header">
                <h2 className="step-heading">Employer Information</h2>
                <p className="step-description">Details about your current employer</p>
              </div>
              
              <div className="form-grid">
                <div className={`form-field full-width ${errors.employerName ? 'error' : ''}`}>
                  <label className="field-label">Employer Name *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Company/Organization name"
                    value={employerInfo.employerName}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'employerName', e.target.value)}
                  />
                  {errors.employerName && <span className="error-message"><AlertCircle size={14} /> {errors.employerName}</span>}
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Employer Address</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Complete company address"
                    value={employerInfo.employerAddress}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'employerAddress', e.target.value)}
                  />
                </div>

                <div className={`form-field ${errors.employerPan ? 'error' : ''}`}>
                  <label className="field-label">Employer PAN *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="ABCDE1234F"
                    value={employerInfo.employerPan}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'employerPan', e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                  {errors.employerPan && <span className="error-message"><AlertCircle size={14} /> {errors.employerPan}</span>}
                </div>

                <div className={`form-field ${errors.tanNumber ? 'error' : ''}`}>
                  <label className="field-label">TAN Number</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="ABCD12345E"
                    value={employerInfo.tanNumber}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'tanNumber', e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                  {errors.tanNumber && <span className="error-message"><AlertCircle size={14} /> {errors.tanNumber}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">Employee Reference No.</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Employee ID"
                    value={employerInfo.employeeRefNo}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'employeeRefNo', e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Assessment Year *</label>
                  <select
                    className="field-input"
                    value={employerInfo.assessmentYear}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'assessmentYear', e.target.value)}
                  >
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Tax Deducted (TDS)</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={employerInfo.taxDeducted}
                    onChange={(e) => handleInputChange(setEmployerInfo, 'taxDeducted', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Income Details */}
          {currentStep === 4 && (
            <div className="step-content">
              <div className="step-header">
                <h2 className="step-heading">Income Details</h2>
                <p className="step-description">Your earnings from salary and other sources</p>
              </div>
              
              <div className="form-grid">
                <div className={`form-field ${errors.grossSalary ? 'error' : ''}`}>
                  <label className="field-label">Gross Salary *</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.grossSalary}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'grossSalary', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.grossSalary && <span className="error-message"><AlertCircle size={14} /> {errors.grossSalary}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">Allowances</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.allowances}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'allowances', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Perquisites</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.perquisites}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'perquisites', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Profit from Business</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.profitIncome}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'profitIncome', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">HRA Received</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.hra}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'hra', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">LTA</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.lta}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'lta', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Other Exempt Allowances</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.otherAllowances}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'otherAllowances', e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Professional Tax</label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={incomeInfo.professionalTax}
                    onChange={(e) => handleInputChange(setIncomeInfo, 'professionalTax', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Deductions */}
          {currentStep === 5 && (
            <div className="step-content">
              <div className="step-header">
                <h2 className="step-heading">Deductions</h2>
                <p className="step-description">Tax saving investments and deductions</p>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Section 80C <span className="limit">(Max ₹1.5L)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.section80C}
                    onChange={(e) => handleInputChange(setDeductions, 'section80C', Math.min(150000, parseInt(e.target.value.replace(/\D/g, '')) || 0).toString())}
                  />
                  <span className="field-hint">PPF, ELSS, LIC, Tuition fees, etc.</span>
                </div>

                <div className="form-field">
                  <label className="field-label">Section 80D <span className="limit">(Health Insurance)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.section80D}
                    onChange={(e) => handleInputChange(setDeductions, 'section80D', e.target.value.replace(/\D/g, ''))}
                  />
                  <span className="field-hint">Self: ₹25K | Parents: ₹50K (Sr. Citizen)</span>
                </div>

                <div className="form-field">
                  <label className="field-label">Section 80E <span className="limit">(Education Loan)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.section80E}
                    onChange={(e) => handleInputChange(setDeductions, 'section80E', e.target.value.replace(/\D/g, ''))}
                  />
                  <span className="field-hint">Interest on education loan (no limit)</span>
                </div>

                <div className="form-field">
                  <label className="field-label">Section 80G <span className="limit">(Donations)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.section80G}
                    onChange={(e) => handleInputChange(setDeductions, 'section80G', e.target.value.replace(/\D/g, ''))}
                  />
                  <span className="field-hint">Charitable donations</span>
                </div>

                <div className="form-field">
                  <label className="field-label">Home Loan Interest <span className="limit">(Max ₹2L)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.homeLoanInterest}
                    onChange={(e) => handleInputChange(setDeductions, 'homeLoanInterest', Math.min(200000, parseInt(e.target.value.replace(/\D/g, '')) || 0).toString())}
                  />
                  <span className="field-hint">Section 24(b) - Self-occupied property</span>
                </div>

                <div className="form-field">
                  <label className="field-label">NPS (80CCD 1B) <span className="limit">(Max ₹50K)</span></label>
                  <input
                    type="text"
                    className="field-input currency"
                    placeholder="₹ 0"
                    value={deductions.nps}
                    onChange={(e) => handleInputChange(setDeductions, 'nps', Math.min(50000, parseInt(e.target.value.replace(/\D/g, '')) || 0).toString())}
                  />
                  <span className="field-hint">Additional NPS contribution</span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="summary-card">
                <h3 className="summary-title">Summary</h3>
                <div className="summary-row">
                  <span>Total Deductions:</span>
                  <span className="summary-value">
                    ₹{formatCurrency(
                      (parseInt(deductions.section80C) || 0) +
                      (parseInt(deductions.section80D) || 0) +
                      (parseInt(deductions.section80E) || 0) +
                      (parseInt(deductions.section80G) || 0) +
                      (parseInt(deductions.homeLoanInterest) || 0) +
                      (parseInt(deductions.nps) || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="wizard-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrev}>
                <ChevronLeft size={18} />
                Previous
              </button>
            )}
            
            <div className="nav-spacer" />
            
            {currentStep < STEPS.length ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn-submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Calculate Tax & Submit"}
                {!isSubmitting && <Check size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormWizard;
