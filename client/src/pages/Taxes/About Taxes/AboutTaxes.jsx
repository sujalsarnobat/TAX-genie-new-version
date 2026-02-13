import React from "react";
import "./AboutTaxes.css";
import Card from "../../../components/mis/Card/Card";
import CircleExpandButton from "../../../components/mis/CircleExpandButton/CircleExpandButton";

function AboutTaxes() {
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
        
        <div className="blog-title">A Beginner's Guide to Taxes</div>
        
        <div className="blog-content">
          <div className="content-section">
            <div className="content-heading">What are taxes?</div>
            <div className="content-paragraph">
              Taxes are an integral part of our lives, shaping economies and
              funding public services. But for many, they remain a daunting and
              often confusing subject. Fear not! We're here to break it down for
              you.
            </div>
            <div className="highlight-box">
              <p>
                <strong>Key Point:</strong> Taxes are compulsory financial contributions 
                imposed by governments on individuals and businesses to fund public 
                expenditures like infrastructure, education, healthcare, and social welfare.
              </p>
            </div>
          </div>

          <div className="content-section">
            <div className="content-heading">Types of Taxes</div>
            <div className="content-paragraph">
              Understanding different types of taxes helps you manage your finances better:
            </div>
            <div className="content-ul numbered">
              <li>
                <strong>Income Tax:</strong> Levied on earnings of individuals and businesses. 
                The amount depends on your income level, with different tax brackets for different ranges.
              </li>
              <li>
                <strong>Sales Tax:</strong> Also known as consumption tax, imposed on sale of goods 
                and services. Usually a percentage collected by the seller at point of sale.
              </li>
              <li>
                <strong>Property Tax:</strong> Based on real estate value. A significant revenue source 
                for local governments funding schools and infrastructure.
              </li>
              <li>
                <strong>Corporate Tax:</strong> Levied on corporate profits. Rate varies by country 
                and significantly impacts company's bottom line.
              </li>
              <li>
                <strong>Value Added Tax (VAT):</strong> A consumption tax levied on value added at 
                each stage of production or distribution of goods and services.
              </li>
            </div>
          </div>

          <div className="content-section">
            <div className="content-heading">Learn More</div>
            <div className="content-paragraph">
              Delve deeper into learning about taxes and start filing them using the resources below:
            </div>
          </div>
          
          <section id="blog-suggestions" style={{ background: 'transparent', padding: '1rem 0' }}>
            <div className="cards-container" style={{ padding: '0' }}>
              <Card
                title="What are taxes?"
                body="Get a deeper understanding about taxes."
                useNavigateTo="/taxes/what-are-taxes"
              />
              <Card
                title="ITR Filing"
                body="Get started with filing your own ITRs."
                useNavigateTo="/taxes/itr-filing"
              />
              <Card
                title="Smart Savings"
                body="Explore instruments to start saving big."
                useNavigateTo="/taxes/save-taxes"
              />
            </div>
          </section>
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

export default AboutTaxes;
