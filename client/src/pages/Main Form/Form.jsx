// /* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-expressions */
// import React, { useState, useEffect, useCallback } from "react";
// import "./Form.css";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import FloatingLabel from "react-bootstrap/FloatingLabel";
// import CheckBox from "../../components/mis/CheckBox/CheckBox";
// import Tooltip from "react-bootstrap/Tooltip";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import States from "../../utils/States.json";
// import axios from "axios";
// import { IoInformationCircleOutline } from "react-icons/io5";
// import { toast } from "react-toastify";
// import Accordion from "react-bootstrap/Accordion";
// import AccordionBody from "react-bootstrap/esm/AccordionBody";
// import {
//   FaRegCircleUser,
//   FaRegAddressCard,
//   FaLaptopCode,
// } from "react-icons/fa6";
// import { GrMoney } from "react-icons/gr";
// import { FaMoneyBills, FaMoneyBillTrendUp } from "react-icons/fa6";
// import { TbPigMoney } from "react-icons/tb";
// import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
// import { BsFillHouseAddFill } from "react-icons/bs";
// import { MdCastForEducation } from "react-icons/md";
// import "./Accordion.css";
// import ImageModal from "../../components/mis/ImageModal";
// import { useNavigate } from "react-router-dom";

// const encodeAadhar = (aadharNumber) => {
//   let encodedAadhar = 0;
//   let multiplier = 1;

//   while (aadharNumber > 0) {
//     const digit = ((aadharNumber % 10) + 3) % 10; // Ensure the result is between 0 and 9
//     encodedAadhar += digit * multiplier;
//     aadharNumber = Math.floor(aadharNumber / 10);
//     multiplier *= 10;
//   }

//   return encodedAadhar;
// };

// const decodeAadhar = (excess3Code) => {
//   let decodedAadhar = 0;
//   let multiplier = 1;

//   while (excess3Code > 0) {
//     const digit = ((excess3Code % 10) - 3 + 10) % 10; // Ensure the result is between 0 and 9
//     decodedAadhar += digit * multiplier;
//     excess3Code = Math.floor(excess3Code / 10);
//     multiplier *= 10;
//   }

//   return decodedAadhar;
// };

// function FormFilling() {
//   const [formData, setFormData] = useState({
//     FirstName: "",
//     MiddleName: "",
//     LastName: "",
//     Name: "",
//     DateOfBirth: "",
//     FatherName: "",
//     Gender: "",
//     MaritalStatus: "",

//     PanCard: "",
//     MobileNo: 0,
//     Email: "",
//     Address: "",
//     PermanentAddress: "",
//     City: "",
//     selectedState: "",
//     PinCode: "",

//     employerName: "",
//     employerAddress: "",
//     employerPanNumber: "",
//     tanNumber: "",
//     employeeReferenceNo: "",
//     Year: "",
//     TaxDeducted: 0,
//   });

//   const navigate = useNavigate();

//   const [RentedHouseIncome, setRentedHouseIncome] = useState(0);
//   const [DeemdedHouseIncome, setDeemdedHouseIncome] = useState(0);

//   const [OldFinalTax, setOldFinalTax] = useState(0);
//   const [OldFinalCess, setOldFinalCess] = useState(0);
//   const [NewFinalTax, setNewFinalTax] = useState(0);
//   const [NewFinalCess, setNewFinalCess] = useState(0);
//   const [PreferredSystem, setPreferredSystem] = useState("");

//   const [AadharNo, setAadharNo] = useState(0);

//   const {
//     FirstName,
//     MiddleName,
//     LastName,
//     Name,
//     DateOfBirth,
//     FatherName,
//     Gender,
//     MaritalStatus,
//     PanCard,
//     MobileNo,
//     Email,
//     Address,
//     PermanentAddress,
//     City,
//     selectedState,
//     PinCode,
//     employerName,
//     employerAddress,
//     employerPanNumber,
//     tanNumber,
//     employeeReferenceNo,
//     Year,
//     TaxDeducted,
//   } = formData;

//   //Checkboxes
//   const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//   const [sameAsAddress, setSameAsAddress] = useState(false);
//   const [show, setShow] = useState(false);

//   const handleChange = useCallback((newData) => {
//     setFormData((prevFormData) => ({ ...prevFormData, ...newData }));
//   }, []);

//   function onChange(e) {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.id]: e.target.value,
//     }));
//   }

//   //Income
//   const [Salary, setSalary] = useState(0);
//   const [PrerequisiteIncome, setPrerequisiteIncome] = useState(0);
//   const [ProfitIncome, setProfitIncome] = useState(0);
//   const [OtherIncome, setOtherIncome] = useState(0);

//   const [HRA, setHRA] = useState(0);
//   const [LTA, setLTA] = useState(0);
//   const [OtherExemptedAllowances, setOtherExemptedAllowances] = useState(0);
//   const [ProfessionalTax, setProfessionalTax] = useState(0);
//   const [OwnHouseIncome, setOwnHouseIncome] = useState(0);

//   //Deductions
//   const [BasicDeductions, setBasicDeductions] = useState(0);
//   const [Medical, setMedical] = useState(0);
//   const [EducationalLoan, setEducationalLoan] = useState(0);
//   const [Nps, setNps] = useState(0);
//   const [Deposits, setDeposits] = useState(0);
//   const [Charity, setCharity] = useState(0);

//   //Deductions according to the number
//   const [section80C, setSection80C] = useState(0);
//   const [section80CCC, setSection80CCC] = useState(0);
//   const [section80CCD1, setSection80CCD1] = useState(0);
//   const [section80CCD2, setSection80CCD2] = useState(0);
//   const [section80CCD1B, setSection80CCD1B] = useState(0);
//   const [section80CCF, setSection80CCF] = useState(0);
//   const [section80CCG, setSection80CCG] = useState(0);
//   const [section80D, setSection80D] = useState(0);
//   const [section80DD, setSection80DD] = useState(0);
//   const [section80DDB, setSection80DDB] = useState(0);
//   const [section80E, setSection80E] = useState(0);
//   const [section80EE, setSection80EE] = useState(0);
//   const [section80G, setSection80G] = useState(0);
//   const [section80GGA, setSection80GGA] = useState(0);
//   const [section80GGC, setSection80GGC] = useState(0);
//   const [section80QQB, setSection80QQB] = useState(0);
//   const [section80RRB, setSection80RRB] = useState(0);
//   const [section80TTA, setSection80TTA] = useState(0);
//   const [section80U, setSection80U] = useState(0);

//   // const [section80GGB, setSection80GGB] = useState(0);
//   // const [section80GG, setSection80GG] = useState(0);
//   // const [section80IA, setSection80IA] = useState(0);
//   // const [section80IAB, setSection80IAB] = useState(0);
//   // const [section80IB, setSection80IB] = useState(0);
//   // const [section80IC, setSection80IC] = useState(0);
//   // const [section80ID, setSection80ID] = useState(0);
//   // const [section80IE, setSection80IE] = useState(0);
//   // const [section80JJA, setSection80JJA] = useState(0);
//   // const [section80JJAA, setSection80JJAA] = useState(0);
//   // const [section80LA, setSection80LA] = useState(0);
//   // const [section80P, setSection80P] = useState(0);

//   const [showIncomeModal, setShowIncomeModal] = useState(false);
//   const [showProfitsModal, setShowProfitsModal] = useState(false);
//   const [HeadIncome, setHeadIncome] = useState(0);

//   const [RentedhomeInterestPaid, setRentedHomeInterestPaid] = useState(0);
//   const [RentedrentReceived, setRentedRentReceived] = useState(0);
//   const [RentedmunicipalTax1, setRentedMunicipalTax1] = useState(0);

//   const [DeemedhomeInterestPaid, setDeemedHomeInterestPaid] = useState(0);
//   const [DeemedrentReceived, setDeemedRentReceived] = useState(0);
//   const [DeemedmunicipalTax1, setDeemedMunicipalTax1] = useState(0);

//   useEffect(() => {
//     const numericSalary = parseFloat(Salary) || 0;
//     const numericPrerequisiteIncome = parseFloat(PrerequisiteIncome) || 0;
//     const numericProfitIncome = parseFloat(ProfitIncome) || 0;
//     const numericHRA = parseFloat(HRA) || 0;
//     const numericLTA = parseFloat(LTA) || 0;
//     const numericOtherExemptedAllowances =
//       parseFloat(OtherExemptedAllowances) || 0;
//     const numericProfessionalTax = parseFloat(ProfessionalTax) || 0;
//     const numericOwnHouseIncome = parseFloat(OwnHouseIncome) || 0;

//     //house incomes
//     const numericRentedhomeInterest = parseFloat(RentedhomeInterestPaid) || 0;
//     const numericRentedrentReceived = parseFloat(RentedrentReceived) || 0;
//     const numericRentedmunicipalTax1 = parseFloat(RentedmunicipalTax1) || 0;

//     const numericDeemedhomeInterestPaid =
//       parseFloat(DeemedhomeInterestPaid) || 0;
//     const numericDeemedrentReceived = parseFloat(DeemedrentReceived) || 0;
//     const numericDeemedmunicipalTax1 = parseFloat(DeemedmunicipalTax1) || 0;

//     const calculateSlabTax = (income, rate) => {
//       return income * rate;
//     };
//     const finalRentedIncome = calculateSlabTax(
//       numericRentedrentReceived - numericRentedmunicipalTax1,
//       0.3
//     );
//     const ReIncome =
//       numericRentedrentReceived -
//       numericRentedmunicipalTax1 -
//       finalRentedIncome;
//     const Rented = Math.min(ReIncome - numericRentedhomeInterest, 200000);
//     const finalDeemedIncome = calculateSlabTax(
//       numericDeemedrentReceived - numericDeemedmunicipalTax1,
//       0.3
//     );
//     const DeIncome =
//       numericDeemedrentReceived -
//       numericDeemedmunicipalTax1 -
//       finalDeemedIncome;

//     const Deemded = Math.min(DeIncome - numericDeemedhomeInterestPaid, 200000);

//     const totalIncome =
//       numericSalary +
//       numericPrerequisiteIncome +
//       numericProfitIncome -
//       numericHRA -
//       numericLTA -
//       numericOtherExemptedAllowances -
//       numericProfessionalTax;

//     const updatedTotalIncome = isNaN(totalIncome) ? 0 : totalIncome;

//     setHeadIncome(updatedTotalIncome);

//     // Tax calculation
//     // Standard Deduction increased to Rs 75,000 in Budget 2024-25
//     const StandardDeductions = 75000;

//     const calculateFinalTax = () => {
//       const totalIncome =
//         numericSalary +
//         numericPrerequisiteIncome +
//         numericProfitIncome -
//         numericHRA -
//         numericLTA -
//         numericOtherExemptedAllowances -
//         numericProfessionalTax -
//         numericOwnHouseIncome +
//         Rented +
//         Deemded;
//       const totalDeductions =
//         section80C +
//         section80CCC +
//         section80CCD1 +
//         section80CCD2 +
//         section80CCD1B +
//         section80CCF +
//         section80CCG +
//         section80D +
//         section80DD +
//         section80DDB +
//         section80E +
//         section80EE +
//         section80G +
//         section80GGA +
//         section80GGC +
//         section80QQB +
//         section80RRB +
//         section80TTA +
//         section80U;

//       const taxableIncome = totalIncome - StandardDeductions - totalDeductions;

//       const { Tax, ceSS } = calculateOldRegimeTax(taxableIncome);
//       const { newfinaltax, newcess } = calculateNewRegimeTax(totalIncome);

//       return {
//         OldTax: Tax,
//         Oldess: ceSS,
//         NewTax: newfinaltax,
//         Newcess: newcess,
//       };
//     };

//     // Function to calculate old regime tax
//     // Old Regime 2025: Slabs unchanged, rebate u/s 87A up to 5 lakh
//     const calculateOldRegimeTax = (income) => {
//       const TAX_REBATE = {
//         old: 500000,
//       };

//       const calculateSlabTax = (income, rate) => {
//         return income * rate;
//       };

//       const calculateCess = (totalTax) => {
//         return totalTax * 0.04;
//       };

//       let totalTax = 0;
//       const OldtaxDetails = {};

//       // Old Regime Slabs:
//       // 0 - 2.5 lakh: 0%
//       // 2.5 - 5 lakh: 5%
//       // 5 - 10 lakh: 20%
//       // Above 10 lakh: 30%
//       if (income >= TAX_REBATE.old) {
//         OldtaxDetails.slab1 = calculateSlabTax(Math.min(income, 250000), 0);
//         totalTax += OldtaxDetails.slab1;
//         OldtaxDetails.slab2 = calculateSlabTax(
//           Math.min(Math.max(income - 250000, 0), 500000 - 250000),
//           0.05
//         );
//         totalTax += OldtaxDetails.slab2;
//         OldtaxDetails.slab3 = calculateSlabTax(
//           Math.min(Math.max(income - 500000, 0), 1000000 - 500000),
//           0.2
//         );
//         totalTax += OldtaxDetails.slab3;
//         OldtaxDetails.slab4 = calculateSlabTax(
//           Math.max(income - 1000000, 0),
//           0.3
//         );
//         totalTax += OldtaxDetails.slab4;
//       }

//       // Store OldtaxDetails in localStorage
//       localStorage.setItem("OldtaxDetails", JSON.stringify(OldtaxDetails));

//       const Tax = totalTax + calculateCess(totalTax);
//       const ceSS = calculateCess(totalTax);

//       return { Tax, ceSS };
//     };

//     // New Regime 2025 (Budget 2024-25)
//     // Tax rebate u/s 87A increased to 12 lakh (effectively no tax up to 12 lakh)
//     const calculateNewRegimeTax = (income) => {
//       const TAX_REBATE_NEW = {
//         new: 1200000, // Increased from 7 lakh to 12 lakh
//       };

//       const calculateSlabTax = (income, rate) => income * rate;

//       let totalTax = 0;

//       const NewtaxDetails = {};

//       // New Regime 2025 Slabs:
//       // 0 - 4 lakh: 0%
//       // 4 - 8 lakh: 5%
//       // 8 - 12 lakh: 10%
//       // 12 - 16 lakh: 15%
//       // 16 - 20 lakh: 20%
//       // 20 - 24 lakh: 25%
//       // Above 24 lakh: 30%
//       if (income >= TAX_REBATE_NEW.new) {
//         // 0 - 4 lakh: 0%
//         NewtaxDetails.slab1 = calculateSlabTax(Math.min(income, 400000), 0);
//         totalTax += NewtaxDetails.slab1;
        
//         // 4 - 8 lakh: 5%
//         NewtaxDetails.slab2 = calculateSlabTax(
//           Math.max(Math.min(income - 400000, 400000), 0),
//           0.05
//         );
//         totalTax += NewtaxDetails.slab2;
        
//         // 8 - 12 lakh: 10%
//         NewtaxDetails.slab3 = calculateSlabTax(
//           Math.max(Math.min(income - 800000, 400000), 0),
//           0.1
//         );
//         totalTax += NewtaxDetails.slab3;
        
//         // 12 - 16 lakh: 15%
//         NewtaxDetails.slab4 = calculateSlabTax(
//           Math.max(Math.min(income - 1200000, 400000), 0),
//           0.15
//         );
//         totalTax += NewtaxDetails.slab4;
        
//         // 16 - 20 lakh: 20%
//         NewtaxDetails.slab5 = calculateSlabTax(
//           Math.max(Math.min(income - 1600000, 400000), 0),
//           0.2
//         );
//         totalTax += NewtaxDetails.slab5;
        
//         // 20 - 24 lakh: 25%
//         NewtaxDetails.slab6 = calculateSlabTax(
//           Math.max(Math.min(income - 2000000, 400000), 0),
//           0.25
//         );
//         totalTax += NewtaxDetails.slab6;
        
//         // Above 24 lakh: 30%
//         NewtaxDetails.slab7 = calculateSlabTax(
//           Math.max(income - 2400000, 0),
//           0.3
//         );
//         totalTax += NewtaxDetails.slab7;
//       }

//       localStorage.setItem("NewtaxDetails", JSON.stringify(NewtaxDetails));

//       const calculateCess = (totalTax) => {
//         const newCess = totalTax * 0.04;
//         return newCess;
//       };

//       const newfinaltax = totalTax + calculateCess(totalTax);
//       const newcess = totalTax * 0.04;

//       return { newfinaltax, newcess };
//     };

//     const { OldTax, Oldess, NewTax, Newcess } = calculateFinalTax();

//     const preferredSystem =
//       NewFinalTax < OldFinalTax ? "NewRegime" : "OldRegime";

//     setRentedHouseIncome(Rented);
//     setDeemdedHouseIncome(Deemded);

//     setOldFinalTax(OldTax);
//     setOldFinalCess(Oldess);
//     setNewFinalTax(NewTax);
//     setNewFinalCess(Newcess);
//     setPreferredSystem(preferredSystem);
//   }, [
//     Salary,
//     PrerequisiteIncome,
//     ProfitIncome,
//     OtherIncome,
//     HRA,
//     LTA,
//     OtherExemptedAllowances,
//     ProfessionalTax,
//     RentedhomeInterestPaid,
//     RentedrentReceived,
//     RentedmunicipalTax1,
//     DeemedhomeInterestPaid,
//     DeemedrentReceived,
//     DeemedmunicipalTax1,
//     RentedHouseIncome,
//     DeemdedHouseIncome,
//     NewFinalTax,
//     OldFinalTax,
//     OwnHouseIncome,
//     section80C,
//     section80CCC,
//     section80CCD1,
//     section80CCD2,
//     section80CCD1B,
//     section80CCF,
//     section80CCG,
//     section80D,
//     section80DD,
//     section80DDB,
//     section80E,
//     section80EE,
//     section80G,
//     section80GGA,
//     section80GGC,
//     section80QQB,
//     section80RRB,
//     section80TTA,
//     section80U,
//   ]);

//   const Token = localStorage.getItem("token");

//   const handleLimitFunction = (e, value, limit) => {
//     const inputValue = parseInt(value, 10) || 0;

//     if (inputValue > limit) {
//       // Perform some operation when value exceeds the limit
//       toast.error(`Max Limit is Rs ${limit}`);
//       e.target.style.borderColor = "red";
//       return inputValue; // You can set it to the limit or perform a different operation here
//     }

//     // If value is within the limit, return the original value
//     e.target.style.borderColor = "";
//     return inputValue;
//   };

//   const Link = ({ id, children, title }) => (
//     <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
//       <a href=" " style={{ color: "black", textDecoration: "none" }}>
//         {children}
//       </a>
//     </OverlayTrigger>
//   );

//   const handleGenderChange = (e) => {
//     handleChange({ Gender: e.target.value });
//   };

//   const handleMarriedChange = (e) => {
//     handleChange({ MaritalStatus: e.target.value });
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = (e) => {
//     e.preventDefault();
//     setShow(true);
//   };

//   async function onSubmit(e) {
//     e.preventDefault();
//     console.log(OldFinalTax, OldFinalCess, NewFinalTax, NewFinalCess);
//     if (isCheckboxChecked) {
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/policy/oldreign",
//           {
//             Token,
//             AadharNo,
//             FirstName,
//             MiddleName,
//             LastName,
//             Name,
//             DateOfBirth,
//             FatherName,
//             Gender,
//             MaritalStatus,
//             PanCard,
//             MobileNo,
//             Email,
//             Address,
//             PermanentAddress,
//             City,
//             selectedState,
//             PinCode,
//             employerName,
//             employerAddress,
//             employerPanNumber,
//             tanNumber,
//             employeeReferenceNo,
//             Year,
//             TaxDeducted,
//             Salary,
//             PrerequisiteIncome,
//             ProfitIncome,
//             OtherIncome,
//             HRA,
//             LTA,
//             OtherExemptedAllowances,
//             ProfessionalTax,
//             OwnHouseIncome,
//             //deductions
//             section80C,
//             section80CCC,
//             section80CCD1,
//             section80CCD2,
//             section80CCD1B,
//             section80CCF,
//             section80CCG,
//             section80D,
//             section80DD,
//             section80DDB,
//             section80E,
//             section80EE,
//             section80G,
//             section80GGA,
//             section80GGC,
//             section80QQB,
//             section80RRB,
//             section80TTA,
//             section80U,

//             RentedHouseIncome,
//             DeemdedHouseIncome,
//             OldFinalTax,
//             OldFinalCess,
//             NewFinalTax,
//             NewFinalCess,
//             PreferredSystem,
//           }
//         );
//         console.log(response.data); // Log the response data
//         toast.success("Data is saved. You will be redirected in few seconds");
//         setTimeout(() => {
//           navigate("/doc");
//         }, 1500);
//       } catch (err) {
//         if (err.response) {
//           console.error("Response Error:", err.response.data);
//         } else if (err.request) {
//           console.error("Request Error:", err.request);
//         } else {
//           console.error("Error:", err.message);
//         }
//         toast.error("Try again after sometime");
//       }
//     } else {
//       toast.warning("Please verify the information before submitting.");
//     }
//   }
//   return (
//     <section id="form-filling">
//       <div className="personalInfo">
//         <h1 className="formTitle">Personal Information</h1>
//         <hr style={{ marginBottom: 20 }} />
//         <Form onSubmit={onSubmit}>
//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaRegCircleUser style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Permanent Information{" "}
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info as per your government identity
//                       documents(PAN, Aadhaar etc.)
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>
//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} md="4" controlId="formGridEmail">
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="First Name *"
//                       className="mb-3"
//                     >
//                       <Form.Control
//                         type="text"
//                         value={FirstName}
//                         id="FirstName"
//                         placeholder="First Name "
//                         onChange={onChange}
//                       />
//                     </FloatingLabel>
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridEmail">
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="Middle Name *"
//                       className="mb-3"
//                     >
//                       <Form.Control
//                         type="text"
//                         value={MiddleName}
//                         placeholder="Middle Name"
//                         onChange={(e) => {
//                           handleChange({ MiddleName: e.target.value });
//                         }}
//                       />
//                     </FloatingLabel>
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridEmail">
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="Last Name *"
//                       className="mb-3"
//                     >
//                       <Form.Control
//                         type="text"
//                         value={LastName}
//                         placeholder="Last Name"
//                         onChange={(e) => {
//                           handleChange({ LastName: e.target.value });
//                         }}
//                       />
//                     </FloatingLabel>
//                   </Form.Group>
//                 </Row>
//                 <Form.Group
//                   as={Col}
//                   className="mb-3"
//                   md="6"
//                   controlId="formGridEmail"
//                 >
//                   <Form.Label>Date Of Birth *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={DateOfBirth}
//                     placeholder="DD/MM/YYYY"
//                     onChange={(e) => {
//                       handleChange({ DateOfBirth: e.target.value });
//                     }}
//                   />
//                 </Form.Group>
//                 <Form.Group
//                   as={Col}
//                   md="6"
//                   className="mb-3"
//                   controlId="formGridEmail"
//                 >
//                   <Form.Label>Father Name *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={FatherName}
//                     placeholder=""
//                     onChange={(e) => {
//                       handleChange({ FatherName: e.target.value });
//                     }}
//                   />
//                 </Form.Group>
//                 <Form.Group as={Col} md="6" className="mb-3">
//                   <Form.Label>Gender *</Form.Label>
//                   <Form.Check
//                     style={{ marginLeft: "16px" }}
//                     inline
//                     type="radio"
//                     label="Male"
//                     value="male"
//                     checked={Gender === "male"}
//                     onChange={handleGenderChange}
//                   />
//                   <Form.Check
//                     inline
//                     style={{ marginLeft: "16px" }}
//                     type="radio"
//                     label="Female"
//                     value="female"
//                     checked={Gender === "female"}
//                     onChange={handleGenderChange}
//                   />
//                 </Form.Group>
//                 <Form.Group as={Col} md="6" className="mb-3">
//                   <Form.Label>Marital Status *</Form.Label>
//                   <Form.Check
//                     style={{ marginLeft: "16px" }}
//                     inline
//                     type="radio"
//                     label="Married"
//                     value="Married"
//                     checked={MaritalStatus === "Married"}
//                     onChange={handleMarriedChange}
//                   />
//                   <Form.Check
//                     inline
//                     style={{ marginLeft: "16px" }}
//                     type="radio"
//                     label="Not Married"
//                     value="Not Married"
//                     checked={MaritalStatus === "Not Married"}
//                     onChange={handleMarriedChange}
//                   />

//                   <Form.Check
//                     inline
//                     style={{ marginLeft: "16px" }}
//                     type="radio"
//                     label="Not share"
//                     value="Not share"
//                     checked={MaritalStatus === "Not share"}
//                     onChange={handleMarriedChange}
//                   />
//                 </Form.Group>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaRegAddressCard style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Identification & Contact details{" "}
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info as per your government identity
//                       documents(PAN, Aadhaar etc.)
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>
//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} md="6" controlId="formGridEmail">
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="Aadhar Card Number"
//                       className="mb-3"
//                     >
//                       <Form.Control
//                         type="text"
//                         value={AadharNo}
//                         onChange={(e) => {
//                           setAadharNo(parseInt(e.target.value, 10) || 0);
//                         }}
//                         placeholder="Aadhar Card Number"
//                       />
//                     </FloatingLabel>
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridEmail">
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="PanCard Number"
//                       className="mb-3"
//                     >
//                       <Form.Control
//                         type="text"
//                         value={PanCard}
//                         onChange={(e) => {
//                           handleChange({ PanCard: e.target.value });
//                         }}
//                         placeholder="PanCard Number"
//                       />
//                     </FloatingLabel>
//                   </Form.Group>
//                 </Row>
//                 <Row className="mb-3">
//                   <Form.Group
//                     as={Col}
//                     className="mb-3"
//                     md="6"
//                     controlId="formGridEmail"
//                   >
//                     <Form.Label>Mobile Number *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={MobileNo}
//                       placeholder="DD/MM/YYYY"
//                       onChange={(e) => {
//                         handleChange({ MobileNo: e.target.value });
//                       }}
//                     />
//                   </Form.Group>
//                   <Form.Group
//                     as={Col}
//                     className="mb-3"
//                     md="6"
//                     controlId="formGridEmail"
//                   >
//                     <Form.Label>Email *</Form.Label>
//                     <Form.Control
//                       type="email"
//                       value={Email}
//                       placeholder="DD/MM/YYYY"
//                       onChange={(e) => {
//                         handleChange({ Email: e.target.value });
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>
//                 <Form.Group className="mb-3" controlId="formGridAddress1">
//                   <Form.Label>Address</Form.Label>
//                   <Form.Control
//                     placeholder="Flat No, Building Name"
//                     type="text"
//                     value={Address}
//                     onChange={(e) => {
//                       handleChange({ Address: e.target.value });
//                       if (sameAsAddress) {
//                         handleChange({ PermanentAddress: e.target.value });
//                       }
//                     }}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3" controlId="formGridAddress2">
//                   <Form.Label style={{ display: "flex", alignItems: "center" }}>
//                     Permanent Address{" "}
//                     <span style={{ marginLeft: "10px" }}>
//                       <Link
//                         id="t-2"
//                         title="Select If permanent address is the same"
//                       >
//                         <CheckBox
//                           onChange={(e) => {
//                             setSameAsAddress(e.target.checked);
//                             if (e.target.checked) {
//                               // Set PermanentAddress to be the same as Address
//                               handleChange({ PermanentAddress: Address });
//                             } else {
//                               // Reset PermanentAddress if the checkbox is unchecked
//                               handleChange({ PermanentAddress: "" });
//                             }
//                           }}
//                           checked={sameAsAddress}
//                         />
//                       </Link>
//                     </span>
//                   </Form.Label>
//                   <Form.Control
//                     placeholder="locality, city"
//                     type="text"
//                     value={sameAsAddress ? Address : PermanentAddress}
//                     onChange={(e) => {
//                       handleChange({ PermanentAddress: e.target.value });
//                     }}
//                     disabled={sameAsAddress}
//                   />
//                 </Form.Group>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridCity">
//                     <Form.Label>City</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={City}
//                       onChange={(e) => {
//                         handleChange({ City: e.target.value });
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridState">
//                     <Form.Label>State/UT</Form.Label>
//                     <Form.Select
//                       value={selectedState}
//                       onChange={(e) => {
//                         handleChange({ selectedState: e.target.value });
//                       }}
//                     >
//                       {States.map(
//                         (
//                           state // Added parentheses and return statement
//                         ) => (
//                           <option key={state.id} value={state.name}>
//                             {state.name}
//                           </option>
//                         )
//                       )}
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label>Zip</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={PinCode}
//                       onChange={(e) => {
//                         handleChange({ PinCode: e.target.value });
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <hr style={{ marginBottom: 20 }} />
//           <h1 className="formTitle">Employeers Information</h1>
//           <hr style={{ marginBottom: 20 }} />

//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaLaptopCode style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Employer & TDS Details{" "}
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info as per your government documents
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Form.Group className="mb-3" controlId="formGridAddress1">
//                   <Form.Label>Name of Employer</Form.Label>
//                   <Form.Control
//                     placeholder="Name"
//                     value={employerName}
//                     onChange={(e) =>
//                       handleChange({ employerName: e.target.value })
//                     }
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3" controlId="formGridAddress1">
//                   <Form.Label>Address of the Employer</Form.Label>
//                   <Form.Control
//                     placeholder="Flat No, Building Name"
//                     type="text"
//                     value={employerAddress}
//                     onChange={(e) =>
//                       handleChange({ employerAddress: e.target.value })
//                     }
//                   />
//                 </Form.Group>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridCity">
//                     <Form.Label>PAN Of the Deductor</Form.Label>
//                     <Form.Control
//                       value={employerPanNumber}
//                       onChange={(e) => {
//                         handleChange({ employerPanNumber: e.target.value });
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridCity">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       TAN Of the Deductor
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link id="t-2" title="Click To view a sample">
//                           <IoInformationCircleOutline onClick={handleShow} />
//                         </Link>
//                         <ImageModal
//                           src="https://assets1.cleartax-cdn.com/cleartax/images/1629801946_employerdetails.png"
//                           headerTitle="Ensure that you add the Employer Name and Employer TAN from your form 16"
//                           show={show}
//                           handleClose={handleClose}
//                         />
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       value={tanNumber}
//                       onChange={(e) =>
//                         handleChange({ tanNumber: e.target.value })
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Employee Reference No
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="provided by the Employer
// (If available)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>

//                     <Form.Control
//                       value={employeeReferenceNo}
//                       onChange={(e) =>
//                         handleChange({ employeeReferenceNo: e.target.value })
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridCity">
//                     <Form.Label>Period With Employer (yyyy).</Form.Label>
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="From"
//                       className="mb-3"
//                     >
//                       <Form.Control placeholder="From" />
//                     </FloatingLabel>
//                     <FloatingLabel
//                       controlId="floatingInput"
//                       label="To"
//                       className="mb-3"
//                     >
//                       <Form.Control placeholder="To (yyyy)" />
//                     </FloatingLabel>
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label>Assessment Year</Form.Label>
//                     <Form.Control
//                       placeholder="2022-2023"
//                       value={Year}
//                       onChange={(e) => {
//                         handleChange({ Year: e.target.value });
//                       }}
//                     />
//                     <Form.Label style={{ marginTop: "20px" }}>
//                       Total tax deducted BY Employer *
//                     </Form.Label>
//                     <Form.Control
//                       placeholder=""
//                       value={TaxDeducted}
//                       onChange={(e) => {
//                         handleChange({
//                           TaxDeducted: parseInt(e.target.value, 10) || 0,
//                         });
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           {/* Income Info */}
//           <hr style={{ marginBottom: 20 }} />
//           <h1 className="formTitle">Income Information</h1>
//           <hr style={{ marginBottom: 20 }} />
//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <TbPigMoney style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading"> Salary BreakUp </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info as per your Salary Slip
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Income From Salary
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Salary before reducing HRA, LTA, standard deductions & professional tax. 
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={Salary}
//                       onChange={(e) =>
//                         setSalary(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Perquisites under section 17(2)*
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link id="t-2" title="Click To view sample ">
//                           <IoInformationCircleOutline
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setShowIncomeModal(!showIncomeModal);
//                             }}
//                           />
//                         </Link>
//                         <ImageModal
//                           src="https://assets1.cleartax-cdn.com/cleartax/images/1629905376_172form12ba.png"
//                           headerTitle="These are the benefits given to you by your employer, in addition to wages or salary. These typically include the following:"
//                           show={showIncomeModal}
//                           handleClose={() => setShowIncomeModal(false)}
//                         />
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={PrerequisiteIncome}
//                       onChange={(e) =>
//                         setPrerequisiteIncome(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Profits in lieu of salary under section 17(3)
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link id="t-2" title="Click To view sample ">
//                           <IoInformationCircleOutline
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setShowProfitsModal(!showProfitsModal);
//                             }}
//                           />
//                         </Link>
//                         <ImageModal
//                           src="https://assets1.cleartax-cdn.com/cleartax/images/1629905424_173form12ba.png"
//                           headerTitle="These are the benefits given to you by your employer, in addition to wages or salary. These typically include the following:"
//                           show={showProfitsModal}
//                           handleClose={() => setShowProfitsModal(false)}
//                         />
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={ProfitIncome}
//                       onChange={(e) =>
//                         setProfitIncome(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <GiReceiveMoney style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Exempt allowances under section 10*{" "}
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info as per your Salary Slip
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       House Rent Exemption
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Salaried individuals living in rented houses (paying rent) can claim the House Rent Allowance (HRA).
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={HRA}
//                       onChange={(e) =>
//                         setHRA(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Leave Travel Allowance (LTA) Exemption
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="allowance which is paid to the employee by the employer when the former is traveling with their family or alone
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={LTA}
//                       onChange={(e) =>
//                         setLTA(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Other Exempt allowances
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="All types of Exemption given by the Employer
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={OtherExemptedAllowances}
//                       onChange={(e) =>
//                         setOtherExemptedAllowances(
//                           parseInt(e.target.value, 10) || 0
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//                 <Row>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Professional tax under section 16(iii)
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="individuals employed in various professions, trades, and employments, typically to fund local government activities.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={ProfessionalTax}
//                       onChange={(e) =>
//                         setProfessionalTax(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Income Chargeble on head Salary
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="individuals employed in various professions, trades, and employments, typically to fund local government activities.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control disabled placeholder="0" value={HeadIncome} />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <BsFillHouseAddFill style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Rental Income or House Property
//                     </h2>
//                     <p className="accordionSubHeader">
//                       lease add the details if you earned rent from your house
//                       property or paid interest on housing loan
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <h5>Self-occupied House Property</h5>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Interest paid on loan for this house property
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="If you have a housing loan against a house you live in then you can claim a tax deduction of upto Rs. 2,00,000.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={OwnHouseIncome}
//                       onChange={(e) =>
//                         setOwnHouseIncome(
//                           handleLimitFunction(e, e.target.value, 200000)
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//                 <div
//                   style={{
//                     Display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                     gap: "10px",
//                     marginTop: "1rem",
//                   }}
//                 >
//                   <h5>Rental Property</h5>
//                   <p>
//                     30% Deduction under section 24 is automatically provided for
//                     by our software in Tax Calculation.
//                   </p>
//                 </div>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Annual Rent Received by you
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Please specify the portion of the rent received by you if the property is co-owned.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={RentedrentReceived}
//                       onChange={(e) =>
//                         setRentedRentReceived(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Municipal Tax
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Specifying House tax you paid reduces your tax liability
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={RentedmunicipalTax1}
//                       onChange={(e) =>
//                         setRentedMunicipalTax1(
//                           parseInt(e.target.value, 10) || 0
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Interest paid on loan for this house property
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="If you have a housing loan against a house you live in then you can claim a tax deduction of upto Rs. 2,00,000.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={RentedhomeInterestPaid}
//                       onChange={(e) =>
//                         setRentedHomeInterestPaid(
//                           handleLimitFunction(e, e.target.value, 200000)
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//                 <div
//                   style={{
//                     Display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                     gap: "10px",
//                     marginTop: "1rem",
//                   }}
//                 >
//                   <h5>Deemed Let Out Property</h5>
//                   <p>
//                     30% Deduction under section 24 is automatically provided for
//                     by our software in Tax Calculation.
//                   </p>
//                 </div>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Estimated Annual Rent Receivable
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Please specify the portion of the rent received by you if the property is co-owned.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={DeemedrentReceived}
//                       onChange={(e) =>
//                         setDeemedRentReceived(parseInt(e.target.value, 10) || 0)
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Municipal Tax
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Specifying House tax you paid reduces your tax liability
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={DeemedmunicipalTax1}
//                       onChange={(e) =>
//                         setDeemedMunicipalTax1(
//                           parseInt(e.target.value, 10) || 0
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Interest paid on loan for this house property
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="If you have a housing loan against a house you live in then you can claim a tax deduction of upto Rs. 2,00,000.
//                     "
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={DeemedhomeInterestPaid}
//                       onChange={(e) =>
//                         setDeemedHomeInterestPaid(
//                           handleLimitFunction(e, e.target.value, 200000)
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaMoneyBills style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Other Sources of Income{" "}
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Form.Group as={Col} controlId="formGridZip">
//                   <Form.Label style={{ display: "flex", alignItems: "center" }}>
//                     Other Income
//                     <span
//                       style={{ marginLeft: "10px", alignContent: "center" }}
//                     >
//                       <Link
//                         id="t-2"
//                         title="Includes taxable freelancing income or any other taxable income
//                     "
//                       >
//                         <IoInformationCircleOutline />
//                       </Link>
//                     </span>
//                   </Form.Label>
//                   <Form.Control
//                     placeholder="0"
//                     value={OtherIncome}
//                     onChange={(e) =>
//                       setOtherIncome(parseInt(e.target.value, 10) || 0)
//                     }
//                   />
//                 </Form.Group>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           {/* All Tax Deductions */}
//           <hr style={{ marginBottom: 20 }} />
//           <h1 className="formTitle">Deductions</h1>
//           <hr style={{ marginBottom: 20 }} />
//           <Accordion defaultActiveKey="0" flush alwaysOpen>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaMoneyBills style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Section 80C - Deductions on Investments
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80C
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Provident Fund, Public Provident Fund, Premium Payments towards Life Insurance, Equity Linked Savings Scheme (ELSS), National Savings Certificate, Sukanya Samriddhi Scheme etc. (Limit - Rs 1,50,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80C}
//                       onChange={(e) =>
//                         setSection80C(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             150000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCC
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Amount deposited in LIC or other insurer's annuity plan for a pension (Limit - Rs 1,50,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCC}
//                       onChange={(e) =>
//                         setSection80CCC(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             150000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCD (1)
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Payment made towads Goverment Schemes like APY, NPS etc (Limit - 10% of salary)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCD1}
//                       onChange={(e) => {
//                         let limit = 0.1 * Salary;
//                         setSection80CCD1(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             limit
//                           )
//                         );
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCD (2)
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Employer's contribution to National Pension Scheme account (Limit - 10% of salary)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCD2}
//                       onChange={(e) => {
//                         let limit = 0.1 * Salary;
//                         setSection80CCD2(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             limit
//                           )
//                         );
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCD (1B)
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Additional contribution to National Pension Scheme account (Limit - Rs 50,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCD1B}
//                       onChange={(e) =>
//                         setSection80CCD1B(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             50000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCC
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Rajiv Gandhi Equity Scheme (Limit - Rs 25,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCC}
//                       onChange={(e) => {
//                         setSection80CCC(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             25000
//                           )
//                         );
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCF
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Open to both Hindu Undivided Families and Individuals, Section 80CCF contains provisions for tax deductions on subscription of long-term infrastructure bonds which have been notified by the government. (Max Limit - Rs 20,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCF}
//                       onChange={(e) => {
//                         setSection80CCF(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             20000
//                           )
//                         );
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80CCG
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Investments in equity savings schemes notified by the government are permitted for deductions, subject to the limit being 50% of the amount invested.
//                            (Limit - Rs 25,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80CCG}
//                       onChange={(e) =>
//                         setSection80CCG(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             25000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <GrMoney style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Section 80D - Deductions on Health Related Investments
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80D
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Deductions on amounts spent by an individual towards the premium of a health insurance policy. This includes payment made on behalf of a spouse, children, parents, or self to a Central Government health plan (Limit - Rs 15,000 (age<60))"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80D}
//                       onChange={(e) =>
//                         setSection80D(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             15000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80DD
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="On payments made towards the treatment of dependents with disability. Amount paid as premium to purchase or maintain an insurance policy for such dependent (Limit - Rs 75,000 for normal disability(40% - 79%) and Rs 1.25 lakh for severe disablity(80% or above))"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80DD}
//                       onChange={(e) =>
//                         setSection80DD(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             125000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80DDB
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Section 80DDB can be utilised by HUFs and resident individuals and provides provisions for deductions on the expense incurred by an individual/family towards medical treatment of certain diseases. 
//                           (Limit - Rs 40,000, which can be increased to Rs 60,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80DDB}
//                       onChange={(e) => {
//                         setSection80DDB(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             60000
//                           )
//                         );
//                       }}
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <MdCastForEducation style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Section 80E – Interest on Education Loan
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80E
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="This loan can be availed either by the taxpayer himself/herself or to sponsor the education of his/her ward/child. Only individuals are eligible for this deduction, with loans taken from approved charitable organizations and financial institutions permitted for tax benefits.
//                           (Limit - No maximum limit)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80E}
//                       onChange={(e) =>
//                         setSection80E(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             15000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80EE
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Only individual taxpayers are eligible for deductions under Section 80EE, with the interest repayment of a loan taken by them to buy a residential property qualifying for deductions. (Limit - Rs 3 lakhs)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80EE}
//                       onChange={(e) =>
//                         setSection80EE(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             125000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <GiPayMoney style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Section 80G – Income Tax Benefits Towards Donations for
//                       Social Causes
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80G
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="encourages taxpayers to donate to funds and charitable institutions, offering tax benefits on monetary donations. (Limit - Rs 100% deductions without any limit. 50% deduction without qualifying limits.(Qualifing limit depends on the institutions))"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80G}
//                       onChange={(e) =>
//                         setSection80G(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80GGA
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Tax deductions under this section can be availed by all assessees, subject to them not having any income through profit or gain from a business or profession. Donations by such members to enhance social/scientific/statistical research or towards the National Urban Poverty Eradication Fund are eligible for tax benefits. (Limit - Rs No maximum limit)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80GGA}
//                       onChange={(e) =>
//                         setSection80GGA(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80GGC
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Under this section, funds donated/contributed by an assessee to a political party or electoral trust are eligible for deduction. Local authorities and artificial juridical persons are not entitled to the tax deductions available under Section 80GGC.
//                           (Limit - No maximum limit)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80GGC}
//                       onChange={(e) =>
//                         setSection80GGC(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Accordion flush>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="iconDiv">
//                   <FaMoneyBillTrendUp style={{ height: "2em", width: "2em" }} />
//                   <div className="HeaderMainDiv">
//                     <h2 className="AccordionMainHeading">
//                       {" "}
//                       Other Deductions – Income Tax Benefits for all other
//                       reason
//                     </h2>
//                     <p className="accordionSubHeader">
//                       Please provide all info
//                     </p>
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <AccordionBody>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80QQB
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Section 80QQB permits tax deductions on royalty earned from sale of books. Only resident Indian authors are eligible to claim deductions under this section (Limit - Rs 3 lakhs)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80QQB}
//                       onChange={(e) =>
//                         setSection80QQB(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             300000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80RRB
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Patent owners are given tax breaks under Section 80RRB, which also grants tax relief to residents who receive royalties from their patent as income.
//                           (Limit - Rs 3 lakhs)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80RRB}
//                       onChange={(e) =>
//                         setSection80RRB(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             300000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80TTA
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Deductions under Section 80TTA can be claimed by Hindu Undivided Families and Individual taxpayers.
//                           (Limit - Rs 10,000)"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80TTA}
//                       onChange={(e) =>
//                         setSection80TTA(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             10000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       Section 80U
//                       <span
//                         style={{ marginLeft: "10px", alignContent: "center" }}
//                       >
//                         <Link
//                           id="t-2"
//                           title="Only resident individual taxpayers with disabilities are eligible to claim tax deductions under Section 80U
//                           (Limit - Rs 75,000(at least 40% disabled))"
//                         >
//                           <IoInformationCircleOutline />
//                         </Link>
//                       </span>
//                     </Form.Label>
//                     <Form.Control
//                       placeholder="0"
//                       value={section80U}
//                       onChange={(e) =>
//                         setSection80U(
//                           handleLimitFunction(
//                             e,
//                             parseInt(e.target.value, 10) || 0,
//                             300000
//                           )
//                         )
//                       }
//                     />
//                   </Form.Group>
//                 </Row>
//               </AccordionBody>
//             </Accordion.Item>
//           </Accordion>

//           <Form.Group className="mb-3" id="formGridCheckbox">
//             <Form.Check
//               type="checkbox"
//               label="Have you verified the Information"
//               onChange={(e) => {
//                 setIsCheckboxChecked(e.target.checked);
//               }}
//             />
//           </Form.Group>

//           {/* Upcoming Deductions All fields */}

//           <Button variant="primary" type="submit" disabled={!isCheckboxChecked}>
//             Submit
//           </Button>
//         </Form>
//       </div>
//     </section>
//   );
// }

// export default FormFilling;

import React, { useState } from "react";
import "./FormNew.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Home, 
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function FormNew() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: false,
    employer: false,
    income: false,
    deductions: false
  });

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    fatherName: "",
    gender: "",
    maritalStatus: "",
    panCard: "",
  });

  // Contact Information
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

  // Employer Information
  const [employerInfo, setEmployerInfo] = useState({
    employerName: "",
    employerAddress: "",
    employerPan: "",
    tanNumber: "",
    employeeRefNo: "",
    assessmentYear: "",
    taxDeducted: ""
  });

  // Income Information
  const [incomeInfo, setIncomeInfo] = useState({
    salary: "",
    allowances: "",
    prerequisites: "",
    profitIncome: "",
    hra: "",
    lta: "",
    otherAllowances: "",
    professionalTax: ""
  });

  // Deductions
  const [deductions, setDeductions] = useState({
    section80C: "",
    section80D: "",
    section80E: "",
    section80G: "",
    homeLoanInterest: "",
    nps: ""
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:8000/api/tax/save", {
        ...personalInfo,
        ...contactInfo,
        ...employerInfo,
        ...incomeInfo,
        ...deductions
      });
      
      toast.success("Data saved successfully!");
      setTimeout(() => {
        navigate("/doc");
      }, 1500);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  const handleReset = () => {
    setPersonalInfo({
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      fatherName: "",
      gender: "",
      maritalStatus: "",
      panCard: "",
    });
    setContactInfo({
      mobileNo: "",
      email: "",
      address: "",
      permanentAddress: "",
      city: "",
      state: "",
      pinCode: "",
      sameAsAddress: false
    });
    setEmployerInfo({
      employerName: "",
      employerAddress: "",
      employerPan: "",
      tanNumber: "",
      employeeRefNo: "",
      assessmentYear: "",
      taxDeducted: ""
    });
    setIncomeInfo({
      salary: "",
      allowances: "",
      prerequisites: "",
      profitIncome: "",
      hra: "",
      lta: "",
      otherAllowances: "",
      professionalTax: ""
    });
    setDeductions({
      section80C: "",
      section80D: "",
      section80E: "",
      section80G: "",
      homeLoanInterest: "",
      nps: ""
    });
    toast.info("Form reset successfully");
  };

  return (
    <div className="modern-form-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1 className="form-title">Income Tax Return Form</h1>
          <p className="form-subtitle">Fill in your details for tax calculation and filing</p>
        </div>

        <form onSubmit={handleSubmit} className="modern-form">
          
          {/* Personal Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('personal')}
            >
              <div className="section-header-content">
                <User className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Personal Information</h2>
                  <p className="section-desc">Basic details as per government ID</p>
                </div>
              </div>
              {expandedSections.personal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.personal && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">First Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter first name"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Middle Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter middle name"
                      value={personalInfo.middleName}
                      onChange={(e) => setPersonalInfo({...personalInfo, middleName: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Last Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter last name"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Date of Birth *</label>
                    <input
                      type="date"
                      className="field-input"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Father's Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter father's name"
                      value={personalInfo.fatherName}
                      onChange={(e) => setPersonalInfo({...personalInfo, fatherName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Gender *</label>
                    <select
                      className="field-input"
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Marital Status *</label>
                    <select
                      className="field-input"
                      value={personalInfo.maritalStatus}
                      onChange={(e) => setPersonalInfo({...personalInfo, maritalStatus: e.target.value})}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">PAN Card *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCDE1234F"
                      value={personalInfo.panCard}
                      onChange={(e) => setPersonalInfo({...personalInfo, panCard: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('contact')}
            >
              <div className="section-header-content">
                <MapPin className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Contact Information</h2>
                  <p className="section-desc">Address and communication details</p>
                </div>
              </div>
              {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.contact && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="field-input"
                      placeholder="10-digit mobile number"
                      value={contactInfo.mobileNo}
                      onChange={(e) => setContactInfo({...contactInfo, mobileNo: e.target.value})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Email Address *</label>
                    <input
                      type="email"
                      className="field-input"
                      placeholder="your@email.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Current Address *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="House no., Street, Locality"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">
                      Permanent Address
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={contactInfo.sameAsAddress}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setContactInfo({
                              ...contactInfo,
                              sameAsAddress: checked,
                              permanentAddress: checked ? contactInfo.address : ""
                            });
                          }}
                        />
                        <span className="checkbox-text">Same as current address</span>
                      </label>
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="House no., Street, Locality"
                      value={contactInfo.sameAsAddress ? contactInfo.address : contactInfo.permanentAddress}
                      onChange={(e) => setContactInfo({...contactInfo, permanentAddress: e.target.value})}
                      disabled={contactInfo.sameAsAddress}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">City *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Enter city"
                      value={contactInfo.city}
                      onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">State/UT *</label>
                    <select
                      className="field-input"
                      value={contactInfo.state}
                      onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">PIN Code *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="6-digit PIN"
                      value={contactInfo.pinCode}
                      onChange={(e) => setContactInfo({...contactInfo, pinCode: e.target.value})}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employer Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('employer')}
            >
              <div className="section-header-content">
                <Briefcase className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Employer Information</h2>
                  <p className="section-desc">Details about your current employer</p>
                </div>
              </div>
              {expandedSections.employer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.employer && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="field-label">Employer Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Company/Organization name"
                      value={employerInfo.employerName}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Employer Address *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Complete address"
                      value={employerInfo.employerAddress}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerAddress: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Employer PAN *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCDE1234F"
                      value={employerInfo.employerPan}
                      onChange={(e) => setEmployerInfo({...employerInfo, employerPan: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">TAN Number *</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ABCD12345E"
                      value={employerInfo.tanNumber}
                      onChange={(e) => setEmployerInfo({...employerInfo, tanNumber: e.target.value.toUpperCase()})}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Employee Reference No.</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Employee ID/Reference"
                      value={employerInfo.employeeRefNo}
                      onChange={(e) => setEmployerInfo({...employerInfo, employeeRefNo: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Assessment Year *</label>
                    <select
                      className="field-input"
                      value={employerInfo.assessmentYear}
                      onChange={(e) => setEmployerInfo({...employerInfo, assessmentYear: e.target.value})}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                      <option value="2022-23">2022-23</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Tax Deducted (TDS)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="Amount in ₹"
                      value={employerInfo.taxDeducted}
                      onChange={(e) => setEmployerInfo({...employerInfo, taxDeducted: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Income Information Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('income')}
            >
              <div className="section-header-content">
                <IndianRupee className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Income Details</h2>
                  <p className="section-desc">Salary and other income sources</p>
                </div>
              </div>
              {expandedSections.income ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.income && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Gross Salary *</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.salary}
                      onChange={(e) => setIncomeInfo({...incomeInfo, salary: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Allowances</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.allowances}
                      onChange={(e) => setIncomeInfo({...incomeInfo, allowances: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Perquisites</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.prerequisities}
                      onChange={(e) => setIncomeInfo({...incomeInfo, prerequisites: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Profit from Business</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.profitIncome}
                      onChange={(e) => setIncomeInfo({...incomeInfo, profitIncome: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">HRA Received</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.hra}
                      onChange={(e) => setIncomeInfo({...incomeInfo, hra: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">LTA</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.lta}
                      onChange={(e) => setIncomeInfo({...incomeInfo, lta: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Other Exempt Allowances</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.otherAllowances}
                      onChange={(e) => setIncomeInfo({...incomeInfo, otherAllowances: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Professional Tax</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={incomeInfo.professionalTax}
                      onChange={(e) => setIncomeInfo({...incomeInfo, professionalTax: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deductions Section */}
          <div className="form-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection('deductions')}
            >
              <div className="section-header-content">
                <FileText className="section-icon" size={24} />
                <div className="section-title-group">
                  <h2 className="section-title">Deductions</h2>
                  <p className="section-desc">Tax saving investments and deductions</p>
                </div>
              </div>
              {expandedSections.deductions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.deductions && (
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Section 80C (Max ₹1.5L)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80C}
                      onChange={(e) => setDeductions({...deductions, section80C: e.target.value})}
                      max={150000}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80D (Health Insurance)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80D}
                      onChange={(e) => setDeductions({...deductions, section80D: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80E (Education Loan)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80E}
                      onChange={(e) => setDeductions({...deductions, section80E: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Section 80G (Donations)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.section80G}
                      onChange={(e) => setDeductions({...deductions, section80G: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Home Loan Interest (Max ₹2L)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.homeLoanInterest}
                      onChange={(e) => setDeductions({...deductions, homeLoanInterest: e.target.value})}
                      max={200000}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">NPS (Max ₹50K)</label>
                    <input
                      type="number"
                      className="field-input"
                      placeholder="₹ 0"
                      value={deductions.nps}
                      onChange={(e) => setDeductions({...deductions, nps: e.target.value})}
                      max={50000}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Reset Form
            </button>
            <button type="submit" className="btn-primary">
              Calculate Tax & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormNew;
