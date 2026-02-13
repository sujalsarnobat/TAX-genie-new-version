import React from 'react'
import Faq from "react-faq-component";
import './FaqSec.css';

function FaqSec() {

  const data = {
    title: "frequently asked questions",
    rows: [
      {
        title: "what is the deadline for filing income tax returns?",
        content: `the deadline for filing income tax returns in India is usually July 31st of the assessment year. however, this deadline may be extended by the government in certain cases. it's essential to check the latest updates from the Income Tax Department.`,
      },
      {
        title: "how is income tax calculated in India?",
        content: `income tax in India is calculated based on a slab system. different income levels are taxed at different rates. the government announces these tax slabs in the annual budget. taxable income is divided into various slabs, and each slab has a corresponding tax rate.`,
      },
      {
        title: "what are the tax-saving investment options available?",
        content: `there are several tax-saving investment options in India, such as PPF, EPF, NSC, tax-saving FDs, ELSS, and more. these investments come with tax benefits under Section 80C of the Income Tax Act. consult with a financial advisor to choose the best options.`,
      },
      {
        title: "how can I e-verify my income tax return?",
        content: `you can e-verify your income tax return through various methods, including net banking, Aadhar OTP, bank account-based OTP, or by sending a signed physical copy of ITR-V to the CPC in Bengaluru. e-verification is a convenient and paperless way to verify your return.`,
      },
      {
        title: "what is GST in India?",
        content: `GST is a unified indirect tax introduced in India, replacing VAT, service tax, and central excise. it is levied on the supply of goods and services. GST has multiple tax slabs, including 5%, 12%, 18%, and 28%, with some goods attracting a 0% or exempt rate.`,
      },
      {
        title: "what are the penalties for late filing?",
        content: `if you file your income tax return after the due date, you may be liable to pay a penalty. the penalty amount depends on various factors, including your total income and the delay period. file your returns on time to avoid penalties and legal complications.`,
      },
    ],
  };

  const styles = {
    bgColor: "transparent",
    titleTextColor: "#FFFFFF",
    titleTextSize: "2.5rem",
    rowTitleColor: "#FFFFFF",
    rowTitleTextSize: "1rem",
    rowContentColor: "rgba(255, 255, 255, 0.5)",
    rowContentTextSize: "0.95rem",
    rowContentPaddingTop: "12px",
    rowContentPaddingBottom: "12px",
    rowContentPaddingLeft: "24px",
    rowContentPaddingRight: "24px",
    arrowColor: "rgba(255, 255, 255, 0.4)",
  };

  const config = {
    animate: true,
    tabFocus: true,
  };

  return (
    <div className="faq-container">
      <Faq
        data={data}
        styles={styles}
        config={config}
      />
    </div>
  );
}

export default FaqSec