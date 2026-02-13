import React, { useState } from 'react';
import axios from 'axios';
import TaxComparisonCard from './TaxComparisonCard';
import { calculateTax } from '../utils/taxCalculator';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { Form, Row, Col, Button, Card, InputGroup } from 'react-bootstrap';
import './TaxForm.css';

const TaxForm = () => {
  const [formData, setFormData] = useState({
    grossSalary: '',
    hra: '',
    lta: '',
    section80C: '',
    section80D: '',
    section80E: '',
    section24B: '',
    otherAllowances: ''
  });

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [taxComparison, setTaxComparison] = useState(null);
  const [calculateError, setCalculateError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        uploadFile(file);
      } else {
        alert('Please drop a PDF file');
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    const uploadData = new FormData();
    uploadData.append('form16', file);
    try {
      setUploading(true);
      setUploadSuccess(false);
      const response = await axios.post('http://localhost:8000/api/form16/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        const data = response.data.data;
        setFormData(prev => ({
          ...prev,
          grossSalary: data.grossSalary || prev.grossSalary,
          hra: data.hra || prev.hra,
          lta: data.lta || prev.lta,
          section80C: data.section80C || prev.section80C,
          section80D: data.section80D || prev.section80D,
          section80E: data.section80E || prev.section80E,
          section24B: data.section24B || prev.section24B
        }));
        setUploadedFile(file.name);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Could not read the PDF. Please ensure it is a valid Form 16 document.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculateTax = () => {
    setCalculateError('');
    const grossIncome = parseFloat(formData.grossSalary) || 0;
    if (grossIncome === 0) {
      setCalculateError('Please enter your gross salary to calculate taxes');
      return;
    }
    const investments = {
      hra: parseFloat(formData.hra) || 0,
      lta: parseFloat(formData.lta) || 0,
      section80C: parseFloat(formData.section80C) || 0,
      section80D: parseFloat(formData.section80D) || 0,
      section80E: parseFloat(formData.section80E) || 0,
      section24B: parseFloat(formData.section24B) || 0,
      otherAllowances: parseFloat(formData.otherAllowances) || 0
    };
    const result = calculateTax(grossIncome, investments);
    setTaxComparison(result);
  };

  return (
    <div className="tax-form-page">
      <div className="tax-form-container">
        <div className="tax-form-header">
          <h1>Smart Tax Calculator</h1>
          <p>Upload Form-16 or enter details manually to compare tax regimes</p>
        </div>

        {/* Upload Section */}
        <Card className={`dropzone ${dragActive ? 'active' : ''} ${uploadSuccess ? 'success' : ''}`}>
          <Card.Body>
            <div
              className="dropzone-inner"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                disabled={uploading}
                className="dropzone-input"
              />
              <div className="dropzone-content">
                {uploading ? (
                  <>
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="dropzone-title">Parsing your Form-16...</p>
                    <p className="dropzone-subtitle">This usually takes 2-3 seconds</p>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle2 size={56} className="icon-success" />
                    <p className="dropzone-title">File Uploaded Successfully!</p>
                    <p className="dropzone-subtitle">{uploadedFile}</p>
                    <p className="dropzone-hint">Fields have been auto-filled below</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={56} className="icon-primary" />
                    <p className="dropzone-title">Drag & drop your Form-16 PDF here</p>
                    <p className="dropzone-subtitle">or click to browse your computer</p>
                    <p className="dropzone-hint">PDF file • Max 5MB</p>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Form Section */}
        <Card className="tax-form-card">
          <Card.Body>
            <h2 className="card-title">Income & Deductions</h2>
            <p className="card-subtitle">Enter your financial details for accurate tax calculation</p>

            <Form>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group controlId="grossSalary">
                    <Form.Label>Annual Gross Salary</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.grossSalary}
                        onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                        placeholder="10,00,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Your total annual salary</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="hra">
                    <Form.Label>House Rent Allowance (HRA)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.hra}
                        onChange={(e) => handleInputChange('hra', e.target.value)}
                        placeholder="2,00,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Separate HRA from salary</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="lta">
                    <Form.Label>Leave Travel Allowance (LTA)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.lta}
                        onChange={(e) => handleInputChange('lta', e.target.value)}
                        placeholder="50,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Annual travel allowance</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="otherAllowances">
                    <Form.Label>Other Allowances</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.otherAllowances}
                        onChange={(e) => handleInputChange('otherAllowances', e.target.value)}
                        placeholder="30,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Conveyance, medical, etc.</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="section80C">
                    <Form.Label>Section 80C <span className="text-muted">(Max ₹1.5L)</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.section80C}
                        onChange={(e) => handleInputChange('section80C', e.target.value)}
                        placeholder="1,50,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">PPF, ELSS, Life Insurance, etc.</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="section80D">
                    <Form.Label>Section 80D <span className="text-muted">(Health Insurance)</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.section80D}
                        onChange={(e) => handleInputChange('section80D', e.target.value)}
                        placeholder="25,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Health insurance premiums</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="section80E">
                    <Form.Label>Section 80E <span className="text-muted">(Education Loan)</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.section80E}
                        onChange={(e) => handleInputChange('section80E', e.target.value)}
                        placeholder="20,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Education loan interest</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="section24B">
                    <Form.Label>Section 24B <span className="text-muted">(Home Loan)</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={formData.section24B}
                        onChange={(e) => handleInputChange('section24B', e.target.value)}
                        placeholder="2,00,000"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">Home loan interest (self-occupied)</Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* Error Message */}
              {calculateError && (
                <div className="calc-error">
                  <AlertCircle size={18} className="me-2" />
                  <span>{calculateError}</span>
                </div>
              )}

              <button
                className="obsidian-lift-button"
                onClick={handleCalculateTax}
              >
                Calculate & Compare Tax
              </button>
            </Form>
          </Card.Body>
        </Card>

        {/* Tax Comparison Result */}
        {taxComparison && (
          <TaxComparisonCard
            oldTax={taxComparison.oldRegimeTax}
            newTax={taxComparison.newRegimeTax}
            oldDetails={taxComparison.oldDetails}
            newDetails={taxComparison.newDetails}
          />
        )}
      </div>
    </div>
  );
};

export default TaxForm;
