import React from "react";
import "../AboutTaxes.css";
import data from "./tables/types-of-taxes.json";
import CircleExpandButton from "../../../../components/mis/CircleExpandButton/CircleExpandButton";

function TypesOfTaxes() {
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
        
        <div className="blog-title">Types Of Taxes in India</div>
        
        <div className="blog-content">
          <div className="content-section">
            <div className="content-heading">Tax Categories Overview</div>
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>{data[0].type}</th>
                    <th>{data[0].description}</th>
                    <th>{data[0].keyFeatures}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(1).map((taxData) => (
                    <tr key={taxData.id}>
                      <td><strong>{taxData.type}</strong></td>
                      <td>{taxData.description}</td>
                      <td>{taxData.keyFeatures}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="content-section">
            <div className="highlight-box">
              <p>
                Each tax type has unique characteristics, objectives, and administrative 
                procedures. They collectively contribute to government revenue and play 
                a critical role in India's fiscal system and economic policies.
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

export default TypesOfTaxes;
