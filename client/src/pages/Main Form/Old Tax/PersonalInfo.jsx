/* eslint-disable react-hooks/exhaustive-deps */
// PersonalInfo.js - Enhanced Modern Design
import "../Accordion.css";
import React, { useState, useEffect } from "react";
import "../Form.css";
import "./PersonalInfo.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import CheckBox from "../../../components/mis/CheckBox/CheckBox";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import States from "../../../utils/States.json";
import Accordion from "react-bootstrap/Accordion";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { FaRegCircleUser, FaRegAddressCard, FaLock } from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

const PersonalInfo = ({ formData, onChange, handleLimitFunction }) => {
  const {
    FirstName,
    MiddleName,
    LastName,
    DateOfBirth,
    FatherName,
    Gender,
    MaritalStatus,
    AadharNo,
    PanCard,
    MobileNo,
    Email,
    Address,
    PermanentAddress,
    City,
    selectedState,
    PinCode,
  } = formData;

  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [validation, setValidation] = useState({
    pan: { valid: null, message: "" },
    aadhaar: { valid: null, message: "" },
    mobile: { valid: null, message: "" },
    email: { valid: null, message: "" },
  });

  // Validation functions
  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!pan) return { valid: null, message: "" };
    if (panRegex.test(pan)) {
      return { valid: true, message: "Valid PAN format" };
    }
    return { valid: false, message: "Invalid PAN (Format: ABCDE1234F)" };
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaar) return { valid: null, message: "" };
    if (aadhaarRegex.test(aadhaar)) {
      return { valid: true, message: "Valid Aadhaar number" };
    }
    return { valid: false, message: "Invalid Aadhaar (Must be 12 digits)" };
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9][0-9]{9}$/;
    if (!mobile) return { valid: null, message: "" };
    const cleaned = mobile.replace(/[^0-9]/g, '');
    if (mobileRegex.test(cleaned)) {
      return { valid: true, message: "Valid mobile number" };
    }
    return { valid: false, message: "Invalid mobile (10 digits, starting with 6-9)" };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { valid: null, message: "" };
    if (emailRegex.test(email)) {
      return { valid: true, message: "Valid email address" };
    }
    return { valid: false, message: "Invalid email format" };
  };

  const Link = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <a href=" " style={{ color: "black", textDecoration: "none" }}>
        {children}
      </a>
    </OverlayTrigger>
  );

  useEffect(() => {
    const userDataString = localStorage.getItem("userInfo");
    const userData = JSON.parse(userDataString);
    const Email = userData.email;
    const fetchData = async () => {
      try {
        if (Email) {
          // Make an axios request to your backend endpoint
          const response = await axios.post(
            `https://taxsaarthi.onrender.com/user/personalInfoaccess`,
            { Email }
          );

          // Assuming the backend response contains the personalInfo object
          const personalInfo = response.data;
          console.log(personalInfo);
          onChange({ FirstName: personalInfo.FirstName || "" });
          onChange({ MiddleName: personalInfo.MiddleName || "" });
          onChange({ LastName: personalInfo.LastName || "" });
          onChange({ DateOfBirth: personalInfo.DateOfBirth || "" });
          onChange({ FatherName: personalInfo.FatherName || "" });
          onChange({ Gender: personalInfo.Gender || "" });
          onChange({ MaritalStatus: personalInfo.MaritalStatus || "" });
          onChange({ AadharNo: personalInfo.AadharNo || 0 });
          onChange({ PanCard: personalInfo.PanCard || "" });
          onChange({ MobileNo: personalInfo.MobileNo || "" });
          onChange({ Email: personalInfo.Email || "" });
          onChange({ Address: personalInfo.Address || "" });
          onChange({ PermanentAddress: personalInfo.Address || "" });
          onChange({ City: personalInfo.City || "" });
          onChange({ selectedState: personalInfo.selectedState || "" });
          onChange({ PinCode: personalInfo.PinCode || "" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  return (
    <div className="personal-info-container">
      {/* Step Progress Indicator */}
      <div className="step-progress">
        <div className="step active">
          <div className="step-circle">1</div>
          <span className="step-label">Personal Info</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-circle">2</div>
          <span className="step-label">Documents</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-circle">3</div>
          <span className="step-label">Income</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-circle">4</div>
          <span className="step-label">Review</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-circle">5</div>
          <span className="step-label">Submit</span>
        </div>
      </div>

      <h1 className="formTitle">Personal Information</h1>
      <p className="form-subtitle">Fill in your details accurately as per official documents</p>
      <hr style={{ marginBottom: 20, borderColor: "rgba(255,255,255,0.1)" }} />
      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="iconDiv">
              <FaRegCircleUser style={{ height: "2em", width: "2em" }} />
              <div className="HeaderMainDiv">
                <h2 className="AccordionMainHeading">
                  Permanent Information
                </h2>
                <p className="accordionSubHeader">
                  Basic details as per your official ID
                </p>
              </div>
            </div>
          </Accordion.Header>
          <AccordionBody>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="formGridEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="First Name *"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={FirstName}
                    placeholder="First Name "
                    onChange={(e) => {
                      onChange({ FirstName: e.target.value });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Middle Name *"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={MiddleName}
                    placeholder="Middle Name"
                    onChange={(e) => {
                      onChange({ MiddleName: e.target.value });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last Name *"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={LastName}
                    placeholder="Last Name"
                    onChange={(e) => {
                      onChange({ LastName: e.target.value });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>
            <Form.Group
              as={Col}
              className="mb-3"
              md="6"
              controlId="formGridEmail"
            >
              <Form.Label>Date Of Birth *</Form.Label>
              <Form.Control
                type="text"
                value={DateOfBirth}
                placeholder="DD/MM/YYYY"
                onChange={(e) => {
                  onChange({ DateOfBirth: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              className="mb-3"
              controlId="formGridEmail"
            >
              <Form.Label>Father Name *</Form.Label>
              <Form.Control
                type="text"
                value={FatherName}
                placeholder=""
                onChange={(e) => {
                  onChange({ FatherName: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group as={Col} md="6" className="mb-3">
              <Form.Label>Gender *</Form.Label>
              <div className="pill-button-group">
                <button
                  type="button"
                  className={`pill-button ${Gender === "Male" ? "active" : ""}`}
                  onClick={() => onChange({ Gender: "Male" })}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`pill-button ${Gender === "Female" ? "active" : ""}`}
                  onClick={() => onChange({ Gender: "Female" })}
                >
                  Female
                </button>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" className="mb-3">
              <Form.Label>Marital Status *</Form.Label>
              <div className="pill-button-group">
                <button
                  type="button"
                  className={`pill-button ${MaritalStatus === "Married" ? "active" : ""}`}
                  onClick={() => onChange({ MaritalStatus: "Married" })}
                >
                  Married
                </button>
                <button
                  type="button"
                  className={`pill-button ${MaritalStatus === "Not Married" ? "active" : ""}`}
                  onClick={() => onChange({ MaritalStatus: "Not Married" })}
                >
                  Unmarried
                </button>
                <button
                  type="button"
                  className={`pill-button ${MaritalStatus === "Not share" ? "active" : ""}`}
                  onClick={() => onChange({ MaritalStatus: "Not share" })}
                >
                  Prefer not to say
                </button>
              </div>
            </Form.Group>
          </AccordionBody>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="iconDiv">
              <FaRegAddressCard style={{ height: "2em", width: "2em" }} />
              <div className="HeaderMainDiv">
                <h2 className="AccordionMainHeading">
                  Identification & Contact details
                </h2>
                <p className="accordionSubHeader">
                  <FaLock className="security-icon" /> Your data is encrypted and securely stored
                </p>
              </div>
            </div>
          </Accordion.Header>
          <AccordionBody>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formGridEmail">
                <div className="input-with-validation">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Aadhaar Card Number *"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      value={AadharNo}
                      onChange={(e) => {
                        onChange({ AadharNo: e.target.value });
                        setValidation({
                          ...validation,
                          aadhaar: validateAadhaar(e.target.value),
                        });
                      }}
                      placeholder="Aadhaar Card Number"
                      className={validation.aadhaar.valid === false ? "input-error" : validation.aadhaar.valid === true ? "input-success" : ""}
                    />
                  </FloatingLabel>
                  {validation.aadhaar.valid !== null && (
                    <div className={`validation-message ${validation.aadhaar.valid ? "success" : "error"}`}>
                      {validation.aadhaar.valid ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>{validation.aadhaar.message}</span>
                    </div>
                  )}
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <div className="input-with-validation">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="PAN Card Number *"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      value={PanCard}
                      onChange={(e) => {
                        onChange({ PanCard: e.target.value.toUpperCase() });
                        setValidation({
                          ...validation,
                          pan: validatePAN(e.target.value),
                        });
                      }}
                      placeholder="PAN Card Number"
                      className={validation.pan.valid === false ? "input-error" : validation.pan.valid === true ? "input-success" : ""}
                    />
                  </FloatingLabel>
                  {validation.pan.valid !== null && (
                    <div className={`validation-message ${validation.pan.valid ? "success" : "error"}`}>
                      {validation.pan.valid ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>{validation.pan.message}</span>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                className="mb-3"
                md="6"
                controlId="formGridEmail"
              >
                <div className="input-with-validation">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Mobile Number *"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      value={MobileNo}
                      placeholder="Mobile Number"
                      onChange={(e) => {
                        onChange({ MobileNo: e.target.value });
                        setValidation({
                          ...validation,
                          mobile: validateMobile(e.target.value),
                        });
                      }}
                      className={validation.mobile.valid === false ? "input-error" : validation.mobile.valid === true ? "input-success" : ""}
                    />
                  </FloatingLabel>
                  {validation.mobile.valid !== null && (
                    <div className={`validation-message ${validation.mobile.valid ? "success" : "error"}`}>
                      {validation.mobile.valid ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>{validation.mobile.message}</span>
                    </div>
                  )}
                </div>
              </Form.Group>
              <Form.Group
                as={Col}
                className="mb-3"
                md="6"
                controlId="formGridEmail"
              >
                <div className="input-with-validation">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email *"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      value={Email}
                      placeholder="Email"
                      onChange={(e) => {
                        onChange({ Email: e.target.value });
                        setValidation({
                          ...validation,
                          email: validateEmail(e.target.value),
                        });
                      }}
                      className={validation.email.valid === false ? "input-error" : validation.email.valid === true ? "input-success" : ""}
                    />
                  </FloatingLabel>
                  {validation.email.valid !== null && (
                    <div className={`validation-message ${validation.email.valid ? "success" : "error"}`}>
                      {validation.email.valid ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>{validation.email.message}</span>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                placeholder="Flat No, Building Name"
                type="text"
                value={Address}
                onChange={(e) => {
                  onChange({ Address: e.target.value });
                  if (sameAsAddress) {
                    onChange({ PermanentAddress: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label style={{ display: "flex", alignItems: "center" }}>
                Permanent Address{" "}
                <span style={{ marginLeft: "10px" }}>
                  <Link id="t-2" title="Check if same as current address">
                    <CheckBox
                      onChange={(e) => {
                        setSameAsAddress(e.target.checked);
                        if (e.target.checked) {
                          // Set PermanentAddress to be the same as Address
                          onChange({ PermanentAddress: Address });
                        } else {
                          // Reset PermanentAddress if the checkbox is unchecked
                          onChange({ PermanentAddress: "" });
                        }
                      }}
                      checked={sameAsAddress}
                    />
                  </Link>
                  <span className="same-address-label">Same as current address</span>
                </span>
              </Form.Label>
              <Form.Control
                placeholder="Permanent address"
                type="text"
                value={sameAsAddress ? Address : PermanentAddress}
                onChange={(e) => {
                  onChange({ PermanentAddress: e.target.value });
                }}
                disabled={sameAsAddress}
                className={sameAsAddress ? "input-locked" : ""}
              />
              {sameAsAddress && (
                <div className="address-locked-message">
                  <FaLock /> Address locked (same as current)
                </div>
              )}
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={City}
                  onChange={(e) => {
                    onChange({ City: e.target.value });
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State/UT</Form.Label>
                <Form.Select
                  value={selectedState}
                  onChange={(e) => {
                    onChange({ selectedState: e.target.value });
                  }}
                >
                  {States.map(
                    (
                      state // Added parentheses and return statement
                    ) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  value={PinCode}
                  onChange={(e) => {
                    onChange({ PinCode: e.target.value });
                  }}
                />
              </Form.Group>
            </Row>
          </AccordionBody>
        </Accordion.Item>
      </Accordion>

      {/* Sticky CTA Button */}
      <div className="cta-section">
        <button className="cta-button" type="button" onClick={() => {
          // Add your save and continue logic here
          console.log("Saving and continuing...");
        }}>
          Save & Continue
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
