import React, { useState } from "react";
import "./Docs.css";
import Stack from "react-bootstrap/Stack";
import Checkbox from "../../components/mis/CheckBox/CheckBox";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserProvider";

function Docs() {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useUser();

  const [checkboxes, setCheckboxes] = useState({
    aadharCard: false,
    panCard: false,
    salarySlip: false,
    addressDocuments: false,
  });

  const handleCheckboxChange = (name) => {
    setCheckboxes({
      ...checkboxes,
      [name]: !checkboxes[name],
    });
  };

  // Document status: 'pending' | 'uploaded' | 'missing'
  const getDocumentStatus = (docName) => {
    if (checkboxes[docName]) return 'uploaded';
    return 'pending';
  };

  const documents = [
    { id: 'aadharCard', label: 'Aadhaar Card', icon: '🪪' },
    { id: 'panCard', label: 'PAN Card', icon: '💳' },
    { id: 'salarySlip', label: 'Salary Slip', icon: '📄' },
    { id: 'addressDocuments', label: 'Proof of Address', icon: '🏠' },
  ];

  const isAllChecked = () => {
    return (
      checkboxes.aadharCard &&
      checkboxes.panCard &&
      checkboxes.salarySlip &&
      checkboxes.addressDocuments
    );
  };

  function handleClick() {
    if (isAllChecked()) {
      alert("Please fill the form in one go or all progress will be lost");
      navigate("/form-filling");
    } else {
      alert("Please check all required checkboxes before proceeding.");
    }
  }

  return (
    <section className="docs-list">
      <div className="profile">
        {user && (
          <Dropdown fetchAgain={fetchAgain}>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              Profile
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  navigate("/profile");
                }}
              >
                My Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {user ? (
        <Stack gap={2} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
          <h3>Important Notices</h3>
          <ul>
            <li>
              Please ensure that all the information provided is accurate and up
              to date.
            </li>
            <li>
              Make sure to double-check the spelling and correctness of your
              personal details.
            </li>
            <li>
              Keep a copy of the completed form for your records before
              submission.
            </li>
            <li>
              If you encounter any technical issues while filling out the form,
              contact our support team immediately.
            </li>
          </ul>
          <div className="documents-header">
            <h2>Documents Required</h2>
            <div className="accent-line"></div>
          </div>
          
          <div className="documents-grid">
            {documents.map((doc) => {
              const status = getDocumentStatus(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`document-card ${status} ${checkboxes[doc.id] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxChange(doc.id)}
                >
                  <div className="card-glow"></div>
                  <div className="status-indicator">
                    {status === 'uploaded' && <span className="status-icon uploaded">✓</span>}
                    {status === 'pending' && <span className="status-icon pending">⏱</span>}
                    {status === 'missing' && <span className="status-icon missing">⚠</span>}
                  </div>
                  <div className="document-icon">{doc.icon}</div>
                  <div className="document-label">{doc.label}</div>
                  <input
                    type="checkbox"
                    checked={checkboxes[doc.id]}
                    onChange={() => handleCheckboxChange(doc.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>

          <div className="trust-message">
            <span className="lock-icon">🔒</span>
            Your documents are encrypted and securely stored.
          </div>

          <div className="button-wrapper">
            <button
              className="button-verify"
              onClick={handleClick}
              disabled={!isAllChecked()}
            >
              <span className="button-text">
                {isAllChecked() ? "Review & Submit Documents" : "Complete All Documents"}
              </span>
              <span className="button-arrow">→</span>
            </button>
          </div>
        </Stack>
      ) : (
        <div className="Docs-Login">
          <p className="Docs-Login-p">Please login to access this page</p>
          <button
            className="Docs-Login-button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      )}
    </section>
  );
}

export default Docs;
