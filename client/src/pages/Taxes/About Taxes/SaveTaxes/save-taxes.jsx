import React from "react";
import "../AboutTaxes.css";
import DedAndExem from "../../../../assets/save-taxes-02.png";
import CircleExpandButton from "../../../../components/mis/CircleExpandButton/CircleExpandButton";

function SaveTaxes() {
  return (
    <div className="tax-page-wrapper">
      <section className="blog-container">
        <div className="blog-header">
          <div className="blog-author">
            <div className="blog-author-profile">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Dollar_sign_in_circle_cleaned_%28PD_version%29.green.svg"
                alt="TaxSarthi"
              />
            </div>
            <div className="blog-author-name">TaxSarthi</div>
          </div>
          <div className="blog-date">Updated 2025</div>
        </div>
        
        <div className="blog-title">
          Smart Tax Planning: Save More Money in India
        </div>
        
        <div className="blog-content">
          <div className="content-section">
            <div className="content-heading">
              Tax-Saving Instruments (Section 80C)
            </div>
            <div className="content-paragraph">
              India offers several tax-saving investment options under Section 80C
              of the Income Tax Act. These investments help you save taxes while
              building wealth over time:
            </div>
            <div className="content-ul">
              <li>
                <strong>Public Provident Fund (PPF):</strong> Long-term savings scheme with 
                deduction up to ₹1.5 lakh/year. Interest earned and maturity amount are tax-free.
              </li>
              <li>
                <strong>Employee Provident Fund (EPF):</strong> Mandatory retirement savings for 
                salaried employees. Both employee and employer contributions qualify for tax benefits.
              </li>
              <li>
                <strong>National Savings Certificate (NSC):</strong> Fixed-income investment with 
                5-year lock-in. Initial investment qualifies for Section 80C deduction.
              </li>
              <li>
                <strong>Tax-Saving Fixed Deposits:</strong> Bank FDs with 5-year lock-in. 
                Principal amount eligible for Section 80C deduction.
              </li>
            </div>
          </div>

          <div className="content-section">
            <div className="content-heading">
              Deductions & Exemptions
            </div>
            <div className="content-image">
              <img src={DedAndExem} alt="Deductions and Exemptions" />
              <div className="image-caption">Tax Deductions and Exemptions Overview</div>
            </div>
            <div className="content-paragraph">
              Beyond Section 80C, several other sections offer valuable deductions:
            </div>
            <div className="content-ul">
              <li>
                <strong>Section 24 - Home Loan Interest:</strong> Claim up to ₹2 lakh/year 
                deduction on home loan interest for self-occupied property.
              </li>
              <li>
                <strong>Section 80D - Health Insurance:</strong> Premium paid for yourself, 
                spouse, children, and parents. Limits vary by age and policy type.
              </li>
              <li>
                <strong>Section 80E - Education Loan:</strong> Interest deduction available 
                for up to 8 years on higher education loans.
              </li>
              <li>
                <strong>Section 10(13A) - HRA:</strong> Exemption on House Rent Allowance 
                if living in rented accommodation.
              </li>
              <li>
                <strong>Section 10(38) - LTCG:</strong> Tax exemptions on long-term capital 
                gains from equity shares and mutual funds (conditions apply).
              </li>
            </div>
          </div>

          <div className="content-section">
            <div className="content-heading">National Pension System (NPS)</div>
            <div className="content-paragraph">
              The NPS is a government-sponsored retirement savings scheme with excellent tax benefits:
            </div>
            <div className="content-ul">
              <li>
                <strong>Section 80CCD(1):</strong> Deductions up to 10% of salary (salaried) 
                or 20% of gross income (self-employed), max ₹1.5 lakh.
              </li>
              <li>
                <strong>Section 80CCD(2):</strong> Additional deduction for employer's 
                contribution up to 10% of salary.
              </li>
            </div>
            <div className="highlight-box">
              <p>
                <strong>Pro Tip:</strong> NPS lets you choose between equity (higher risk/return) 
                and debt (lower risk) investments based on your retirement goals. Consult a 
                financial planner to create a customized tax-saving strategy.
              </p>
            </div>
          </div>
        </div>
        
        <div className="blog-footer">
          <div className="blog-author">
            <div className="blog-author-profile">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Dollar_sign_in_circle_cleaned_%28PD_version%29.green.svg"
                alt="TaxSarthi"
              />
            </div>
            <div className="blog-author-name">TaxSarthi</div>
          </div>
          <div className="next-button">
            <CircleExpandButton
              text="Explore More"
              bgColor="transparent"
              hoverBgColor="#ffffff"
              textColor="#ffffff"
              hoverTextColor="#0e0e0e"
              borderColor="#ffffff"
              showArrow={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SaveTaxes;
