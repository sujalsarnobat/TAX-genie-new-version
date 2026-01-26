import React from 'react';
import TaxForm from '../../components/TaxForm';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { Container, Row, Col } from 'react-bootstrap';
import { FileText, Zap, Target, Shield, Clock, Award, TrendingDown } from 'lucide-react';
import './TaxCalculatorPage.css';

const TaxCalculatorPage = () => {
  return (
    <div className="tax-calculator-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <Shield size={16} />
              <span>secure & confidential</span>
            </div>
            <h1 className="hero-title">
              tax intelligence.<br />
              <span className="gradient-text">reimagined.</span>
            </h1>
            <p className="hero-subtitle">
              experience precision-engineered tax optimization.<br />
              upload form-16. get recommendations. save thousands.
            </p>
            
            {/* Feature Pills */}
            <div className="feature-pills">
              <div className="pill">
                <Zap size={14} />
                <span>ai-powered parsing</span>
              </div>
              <div className="pill">
                <Target size={14} />
                <span>instant comparison</span>
              </div>
              <div className="pill">
                <TrendingDown size={14} />
                <span>maximize savings</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <section className="calculator-section">
        <Container>
          <TaxForm />
        </Container>
      </section>

      {/* How It Works - CRED Style */}
      <section className="process-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">engineered for simplicity</h2>
            <p className="section-subtitle">three steps. zero complexity.</p>
          </div>
          
          <Row className="g-4">
            <Col lg={4}>
              <div className="process-card">
                <div className="process-number">01</div>
                <div className="process-icon">
                  <FileText size={32} />
                </div>
                <h3 className="process-title">upload form-16</h3>
                <p className="process-description">
                  advanced ai parser extracts every detail from your pdf. salary, deductions, tax paid—all captured instantly.
                </p>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="process-card">
                <div className="process-number">02</div>
                <div className="process-icon">
                  <Zap size={32} />
                </div>
                <h3 className="process-title">auto-fill & review</h3>
                <p className="process-description">
                  fields populate automatically. review and adjust any values. complete control at your fingertips.
                </p>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="process-card">
                <div className="process-number">03</div>
                <div className="process-icon">
                  <Target size={32} />
                </div>
                <h3 className="process-title">get recommendation</h3>
                <p className="process-description">
                  see which regime saves you more. detailed breakdown. clear savings. make the smart choice.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why TaxSarthi - Premium Features */}
      <section className="features-section">
        <Container>
          <div className="premium-card">
            <div className="premium-header">
              <Award size={36} />
              <h2 className="premium-title">why taxsarthi stands apart</h2>
            </div>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-content">
                  <h3>military-grade accuracy</h3>
                  <p>based on latest FY 2024-25 tax slabs. verified calculations. zero errors.</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Clock size={24} />
                </div>
                <div className="feature-content">
                  <h3>time is wealth</h3>
                  <p>no manual entry. no spreadsheets. upload and done in 60 seconds.</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Target size={24} />
                </div>
                <div className="feature-content">
                  <h3>intelligent recommendations</h3>
                  <p>personalized advice. clear reasoning. optimal regime for your profile.</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Award size={24} />
                </div>
                <div className="feature-content">
                  <h3>always free</h3>
                  <p>no hidden costs. no premium tiers. full access for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default TaxCalculatorPage;
