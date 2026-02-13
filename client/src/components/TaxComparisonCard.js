import React from 'react';
import { formatCurrency, calculateSavingsPercent } from '../utils/taxCalculator';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import './TaxComparisonCard.css';

const TaxComparisonCard = ({ oldTax, newTax, oldDetails, newDetails }) => {
  const betterRegime = oldTax < newTax ? 'old' : 'new';
  const savings = Math.abs(oldTax - newTax);
  const savingsPercent = calculateSavingsPercent(oldTax, newTax);

  const RegimeCard = ({ title, tax, details, isRecommended }) => (
    <Card className={`regime-card ${isRecommended ? 'recommended' : ''}`}>
      <Card.Body>
        {isRecommended && (
          <div className="recommended-badge">
            <Badge bg="success" className="px-3 py-1 fw-bold">✓ RECOMMENDED</Badge>
          </div>
        )}
        <div className="text-center">
          <h3 className={`regime-title ${isRecommended ? 'text-success' : ''}`}>{title}</h3>
          <div className={`regime-amount ${isRecommended ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(tax)}
          </div>
        </div>

        {/* Breakdown */}
        <div className="breakdown">
          <div className="breakdown-row">
            <span>Gross Income:</span>
            <span className="fw-semibold">{formatCurrency(details.grossIncome)}</span>
          </div>
          <div className="breakdown-row">
            <span>Deductions:</span>
            <span className="fw-semibold text-primary">- {formatCurrency(details.deductions)}</span>
          </div>
          <hr />
          <div className="breakdown-row">
            <span>Taxable Income:</span>
            <span className="fw-semibold">{formatCurrency(details.taxableIncome)}</span>
          </div>
          <div className="breakdown-row">
            <span>Tax:</span>
            <span className="fw-semibold">{formatCurrency(details.taxBeforeCess)}</span>
          </div>
          <div className="breakdown-row">
            <span>Cess (4%):</span>
            <span className="fw-semibold">{formatCurrency(details.cess)}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Card className="comparison-card">
      <Card.Body>
        <h2 className="comparison-title text-center">Tax Comparison</h2>
        <p className="comparison-subtitle text-center">Old Regime vs New Regime (FY 2024-25)</p>

        <Row className="g-4 mb-3">
          <Col md={6}>
            <RegimeCard 
              title="Old Tax Regime"
              tax={oldTax}
              details={oldDetails}
              isRecommended={betterRegime === 'old'}
            />
          </Col>
          <Col md={6}>
            <RegimeCard 
              title="New Tax Regime"
              tax={newTax}
              details={newDetails}
              isRecommended={betterRegime === 'new'}
            />
          </Col>
        </Row>

        {/* Savings Banner */}
        <div className="savings-banner text-center">
          <div className="savings-header">💰 Tax Savings</div>
          <p className="savings-subtitle">By choosing the <span className="fw-bold text-uppercase">{betterRegime} regime</span></p>
          <div className="savings-stats">
            <div>
              <div className="savings-amount">{formatCurrency(savings)}</div>
              <div className="savings-label">Total Savings</div>
            </div>
            <div className="savings-divider"></div>
            <div>
              <div className="savings-amount">{savingsPercent}%</div>
              <div className="savings-label">Less Tax</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-box">
          <p className="mb-0 text-center">
            <span className="fw-semibold">💡 Pro Tip:</span> The {betterRegime === 'old' ? 'Old Regime' : 'New Regime'} is better for you because {betterRegime === 'old' 
              ? 'your deductions (80C, 80D, HRA) significantly reduce your taxable income.' 
              : 'you have minimal deductions, and the new regime offers lower base rates.'}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaxComparisonCard;
