# Software Requirements Specification (SRS)

## TaxSarthi — AI-Powered Tax Filing & Advisory Platform

| Field | Detail |
|-------|--------|
| **Document Version** | 1.0 |
| **Date** | February 13, 2026 |
| **Author** | Sujal Baburao Sarnobat |
| **Project** | TaxSarthi |
| **Repository** | [GitHub — TAX-genie-new-version](https://github.com/sujalsarnobat/TAX-genie-new-version) |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Design](#6-database-design)
7. [API Specification](#7-api-specification)
8. [User Interface](#8-user-interface)
9. [Current Implementation Status](#9-current-implementation-status)
10. [Suggestions for Enhancement](#10-suggestions-for-enhancement)

---

## 1. Introduction

### 1.1 Purpose

TaxSarthi is a full-stack web application designed to simplify Indian income tax filing for individual taxpayers. It automates tax calculations under both Old and New (2025) regimes, provides educational tax content, and generates downloadable PDF tax reports.

### 1.2 Scope

The system covers:

- User registration and authentication
- Personal information management
- Multi-step tax data entry (income, deductions, employer details)
- Automated Old vs New regime tax comparison
- Form 16 PDF parsing and auto-fill
- PDF tax report generation and download
- Educational tax guides and FAQs
- Standalone tax calculator tool

### 1.3 Intended Audience

- **Primary Users:** Indian individual taxpayers (salaried employees)
- **Secondary Users:** Tax consultants, CA professionals assisting clients
- **Developers:** Contributors to the open-source project

### 1.4 Definitions & Abbreviations

| Term | Meaning |
|------|---------|
| ITR | Income Tax Return |
| HRA | House Rent Allowance |
| LTA | Leave Travel Allowance |
| PAN | Permanent Account Number |
| TAN | Tax Deduction/Collection Account Number |
| Sec 80C/80D/etc. | Deduction sections under the Income Tax Act, 1961 |
| Old Regime | Traditional tax regime with deductions & exemptions |
| New Regime 2025 | Simplified tax regime with lower rates, fewer deductions |

---

## 2. Overall Description

### 2.1 Product Perspective

TaxSarthi is a MERN-stack (MongoDB, Express.js, React.js, Node.js) single-page application deployed on Vercel (frontend) and Render (backend).

### 2.2 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, React-Bootstrap, Ant Design, Lucide Icons |
| **State Management** | React Context API (UserProvider) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens, 1-hour expiry) |
| **PDF Generation** | jsPDF + html2canvas (client-side) |
| **PDF Parsing** | pdf-parse (server-side, Form 16) |
| **File Upload** | Multer (memory storage, 5MB limit) |
| **Analytics** | Google Analytics 4 (react-ga4) |
| **Performance** | Vercel Speed Insights |
| **Deployment** | Vercel (frontend), Render (backend API) |

### 2.3 User Classes

| User Class | Capabilities |
|------------|-------------|
| **Guest** | View landing page, educational content, tax guides, FAQs, standalone tax calculator |
| **Registered User** | All guest features + sign up, log in, save profile, fill tax forms, generate & download PDF reports, view documents list |

### 2.4 Operating Environment

- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Device:** Desktop and mobile (responsive design)
- **Backend:** Node.js 18+ runtime
- **Database:** MongoDB Atlas (cloud)

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │  Header  │ │  Home    │ │ FormWiz  │ │  PDF Report   │   │
│  │  Footer  │ │  Page    │ │  ard     │ │  Generator    │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ Profile  │ │ Tax Calc │ │ Carousel │ │  CardShowcase │   │
│  │  Page    │ │  Page    │ │   3D     │ │  (Accordion)  │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘   │
│                    ↕ Axios HTTP                              │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   SERVER (Express.js)                         │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Routes: /user  /api/v1/tax  /policy  /api/form16      │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ Controllers: User, Tax, OldReign, PersonalInfo, Form16│   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ Middleware: CORS, JSON parser, Multer, JWT             │   │
│  └────────────────────────────────────────────────────────┘   │
│                    ↕ Mongoose                                │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                              │
│  Collections: users, taxcalculations, oldreigns,             │
│               personalinfos                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Functional Requirements

### 4.1 Authentication Module (FR-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | User can sign up with name, email, and password | High |
| FR-AUTH-02 | User can log in with email and password | High |
| FR-AUTH-03 | System issues JWT token on successful authentication (1-hour expiry) | High |
| FR-AUTH-04 | User session persists via localStorage until logout or token expiry | High |
| FR-AUTH-05 | Protected routes redirect unauthenticated users to login | High |

### 4.2 Personal Information Module (FR-PROFILE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROFILE-01 | User can enter and save personal details (name, DOB, father's name, gender, marital status) | High |
| FR-PROFILE-02 | User can enter identity documents (Aadhaar, PAN) | High |
| FR-PROFILE-03 | User can enter contact details (mobile, email, address, city, state, pincode) | High |
| FR-PROFILE-04 | System auto-fills saved profile data on revisit | Medium |
| FR-PROFILE-05 | System validates Aadhaar (unique), PAN format, mobile format | High |

### 4.3 Tax Data Entry Module (FR-FORM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FORM-01 | 5-step wizard form: Personal → Contact → Employer → Income → Deductions | High |
| FR-FORM-02 | Step validation before proceeding to the next step | High |
| FR-FORM-03 | PAN validation (ABCDE1234F format) | High |
| FR-FORM-04 | TAN validation (ABCD12345E format) | Medium |
| FR-FORM-05 | Mobile number validation (starts 6-9, 10 digits) | High |
| FR-FORM-06 | Email format validation | High |
| FR-FORM-07 | Pincode validation (6 digits) | Medium |
| FR-FORM-08 | Progress bar shows current step completion | Medium |
| FR-FORM-09 | Income fields: Gross Salary, Perquisites, Profit Income, Other Income, HRA, LTA, Other Allowances, Professional Tax | High |
| FR-FORM-10 | Deduction fields: 80C, 80D, 80E, 80G, Home Loan Interest, NPS | High |
| FR-FORM-11 | Employer fields: Name, Address, PAN, TAN, Employee Reference, Assessment Year, Tax Deducted | High |

### 4.4 Tax Calculation Engine (FR-CALC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CALC-01 | Compute Total Income = Sum of all income sources | High |
| FR-CALC-02 | Compute Total Deductions = Sum of all 80-series + HRA + LTA + allowances + professional tax | High |
| FR-CALC-03 | Compute Total Taxable Income = Total Income − Total Deductions | High |
| FR-CALC-04 | **Old Regime Tax Slabs:** 0–2.5L @0%, 2.5–5L @5%, 5–10L @20%, 10L+ @30% (₹75,000 standard deduction) | High |
| FR-CALC-05 | **New Regime 2025 Slabs:** 0–4L @0%, 4–8L @5%, 8–12L @10%, 12–16L @15%, 16–20L @20%, 20–24L @25%, 24L+ @30% | High |
| FR-CALC-06 | Apply Rebate u/s 87A: Old (taxable < ₹5L), New (taxable < ₹12L) | High |
| FR-CALC-07 | Apply 4% Health & Education Cess on computed tax | High |
| FR-CALC-08 | Determine Preferred Regime (lower total tax liability) | High |
| FR-CALC-09 | Client-side standalone calculator uses same slab logic | Medium |

### 4.5 Form 16 Parsing Module (FR-F16)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-F16-01 | Accept Form 16 PDF upload (max 5MB) | High |
| FR-F16-02 | Extract: Gross Salary, Total Tax, PAN, Assessment Year, Employee Name, Employer Name | High |
| FR-F16-03 | Extract deductions: Standard Deduction, HRA, 80C, 80D | Medium |
| FR-F16-04 | Auto-populate tax form fields from parsed data | High |
| FR-F16-05 | Drag-and-drop file upload interface | Medium |

### 4.6 PDF Report Generation (FR-PDF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PDF-01 | Generate detailed tax report with personal, employer, income, deductions, and tax computation | High |
| FR-PDF-02 | Display Old vs New regime side-by-side comparison with recommendation indicator | High |
| FR-PDF-03 | Show detailed slab-wise tax breakdown tables for both regimes | Medium |
| FR-PDF-04 | Download report as PDF (`taxreport-<Token>.pdf`) | High |
| FR-PDF-05 | Refresh data and regenerate report | Low |

### 4.7 Document Checklist Module (FR-DOCS)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DOCS-01 | Display checklist of 4 required documents (Aadhaar, PAN, Salary Slip, Proof of Address) | Medium |
| FR-DOCS-02 | All documents must be acknowledged before proceeding to form | Medium |
| FR-DOCS-03 | Auth-gated access (redirect to login if unauthenticated) | High |

### 4.8 Educational Content Module (FR-EDU)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EDU-01 | "About Taxes" landing page with topic links | Medium |
| FR-EDU-02 | "What Are Taxes" informational page | Low |
| FR-EDU-03 | "Types of Taxes" page (Income Tax, GST, Capital Gains, etc.) | Low |
| FR-EDU-04 | "ITR Filing" step-by-step guide | Medium |
| FR-EDU-05 | "Tax Planning" strategies page | Low |
| FR-EDU-06 | "Save Taxes" deduction tips page | Medium |
| FR-EDU-07 | "Tax Notice" information page | Low |
| FR-EDU-08 | FAQ page with accordion-style Q&A | Medium |
| FR-EDU-09 | Section 139(9) and Section 142(1) detailed pages | Low |

### 4.9 Landing Page & UI (FR-UI)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-UI-01 | Hero section with video background, headline, and CTA button | Medium |
| FR-UI-02 | 3D rotating carousel showcasing 6 platform features | Medium |
| FR-UI-03 | Accordion CardShowcase with expandable guide cards (click to expand 60/40%) | Medium |
| FR-UI-04 | Tutorial video section with embedded YouTube videos | Low |
| FR-UI-05 | Statistics display (assets managed, taxes filed, taxes saved) | Low |
| FR-UI-06 | Testimonials marquee | Low |
| FR-UI-07 | Contact form (email, subject, message) | Medium |
| FR-UI-08 | Responsive navigation with 5 dropdown menus | High |
| FR-UI-09 | CRED-inspired dark theme (#0a0a0a background, green accents) | Medium |
| FR-UI-10 | Route-based loading animation (BoxLoader) | Low |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-01 | Page load time < 3 seconds on 4G connection |
| NFR-PERF-02 | Tax computation completes in < 500ms |
| NFR-PERF-03 | PDF generation completes in < 5 seconds |
| NFR-PERF-04 | Form 16 parsing completes in < 10 seconds |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | JWT-based authentication with 1-hour token expiry |
| NFR-SEC-02 | CORS enabled on backend |
| NFR-SEC-03 | Environment variables for secrets (MONGO_URI, JWT_SECRET) |
| NFR-SEC-04 | File upload limited to 5MB PDFs |

### 5.3 Usability

| ID | Requirement |
|----|-------------|
| NFR-USE-01 | Responsive design for desktop and mobile |
| NFR-USE-02 | Form validation with inline error messages |
| NFR-USE-03 | Toast notifications for success/error feedback |
| NFR-USE-04 | Loading states during async operations |

### 5.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-01 | 404 error page for invalid routes |
| NFR-REL-02 | Graceful error handling on API failures |
| NFR-REL-03 | Data persistence in MongoDB Atlas |

### 5.5 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCA-01 | Stateless backend (horizontal scaling via Render) |
| NFR-SCA-02 | MongoDB Atlas auto-scaling support |

---

## 6. Database Design

### 6.1 Collections

#### `users` (Person model)

| Field | Type | Constraints |
|-------|------|-------------|
| name | String | required |
| email | String | required, unique |
| password | String | required |

#### `personalinfos` (PersonalInfo model)

| Field | Type | Constraints |
|-------|------|-------------|
| Token | String | required |
| FirstName | String | required |
| MiddleName | String | optional |
| LastName | String | required |
| DateOfBirth | String | required |
| FatherName | String | required |
| Gender | String | required |
| MaritalStatus | String | required |
| AadharNo | Number | required, unique |
| PanCard | String | required |
| MobileNo | String | required |
| Email | String | required, unique |
| Address | String | required |
| City | String | required |
| selectedState | String | required |
| PinCode | String | required |

#### `taxcalculations` (TaxCalculation model)

| Group | Fields |
|-------|--------|
| **Identity** | Token, AadharNo, FirstName, MiddleName, LastName, Name (computed), DateOfBirth, FatherName, Gender, MaritalStatus, PanCard, MobileNo, Email |
| **Address** | Address, PermanentAddress, City, selectedState, PinCode |
| **Employer** | employerName, employerAddress, employerPanNumber, tanNumber, employeeReferenceNo, Year, TaxDeducted |
| **Income** | Salary, PrerequisiteIncome, ProfitIncome, OtherIncome, HRA, LTA, OtherExemptedAllowances, ProfessionalTax |
| **House Property** | OwnHouseIncome, RentedHouseIncome, DeemdedHouseIncome |
| **Deductions** | section80C, 80CCC, 80CCD1, 80CCD2, 80CCD1B, 80CCF, 80CCG, 80D, 80DD, 80DDB, 80E, 80EE, 80G, 80GGA, 80GGC, 80QQB, 80RRB, 80TTA, 80U |
| **Computed** | TotalIncome, TotalDeductions, TotalTaxableIncome, OldFinalTax, OldFinalCess, NewFinalTax, NewFinalCess, PreferredSystem (Old/New) |

#### `oldreigns` (OldReign model)

- Same schema as `taxcalculations` but without auto-computed tax fields in pre-save hook.

---

## 7. API Specification

### 7.1 Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://taxsaarthi.onrender.com` |
| Development | `http://localhost:8000` |

### 7.2 Endpoints

#### Authentication

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/user/signup` | `{ name, email, password }` | `{ _id, name, email, token }` | Register new user |
| POST | `/user/login` | `{ email, password }` | `{ _id, name, email, token }` | Login existing user |

#### Personal Information

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/user/personalInfosave` | Personal info fields | `{ saved document }` | Upsert personal info |
| POST | `/user/personalInfoaccess` | `{ Email }` | `{ personal info }` | Retrieve personal info |

#### Tax Calculations

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/api/v1/tax/calculations` | All tax fields | `{ tax document with computed values }` | Create tax calculation |
| POST | `/api/v1/tax/calculationbody` | `{ Token }` | `{ tax document }` | Retrieve tax calculation |
| GET | `/api/v1/tax/calculations` | — | `"It is working"` | Health check |

#### Old Regime

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/policy/oldreign` | Tax fields | `{ old regime document }` | Create old regime entry |
| POST | `/policy/oldbody` | `{ Token }` | `{ old regime document }` | Retrieve old regime entry |

#### Form 16 Parsing

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/api/form16/upload` | `multipart/form-data (pdf)` | `{ parsed fields }` | Parse Form 16 PDF |

---

## 8. User Interface

### 8.1 Page Map

```
Landing Page (/)
├── Header (Navigation)
│   ├── Calculator → /tax-calculator, /old
│   ├── Taxes → /taxes/about-taxes, /taxes/types-of-taxes, /taxes/what-are-taxes
│   ├── Savings → /taxes/save-taxes, /taxes/tax-planning
│   ├── Filing → /form-filling, /taxes/tax-notice
│   └── FAQs → /taxes/faqs, /taxes/section-139-9, /taxes/section-142-1
├── Hero Section (Video BG + CTA)
├── Carousel3D (6 Feature Cards)
├── Tutorial Videos (4 YouTube Embeds)
├── CardShowcase (4 Accordion Guide Cards)
├── Stats Section
├── Testimonials Marquee
├── FAQ Accordion
└── Contact Form

Auth (/login)
├── Sign In Tab
└── Sign Up Tab

Profile (/profile) → Docs Checklist (/docs-list) → Form Wizard (/form-filling) → PDF Report (/doc)

Tax Calculator (/tax-calculator) — Standalone tool with Form 16 upload

Educational Pages (/taxes/*)
└── About, What Are Taxes, Types, ITR Filing, Tax Planning, Save Taxes, Tax Notice, FAQs, Sections
```

### 8.2 Design Language

| Property | Value |
|----------|-------|
| **Theme** | CRED-inspired dark premium |
| **Background** | #0a0a0a / #0e0e0e |
| **Primary Text** | #FFFFFF / #f5f5f5 |
| **Accent Color** | #4ADE80 (Green) |
| **Secondary Text** | #707070 / #888888 |
| **Card Backgrounds** | rgba(20, 20, 20, 0.95) |
| **Typography** | Playfair Display (headings), system sans-serif (body) |
| **Border Style** | Sharp corners (border-radius: 0) — Neo-Brutalist |
| **Interactions** | Offset box-shadows, color transitions, 3D transforms |
| **Animations** | fadeInUp, textReveal, glowPulse, float (CSS keyframes) |

---

## 9. Current Implementation Status

| Module | Status | Notes |
|--------|--------|-------|
| User Signup/Login | ✅ Implemented | Plain-text password (no hashing) |
| Personal Info CRUD | ✅ Implemented | Upsert by email |
| 5-Step Form Wizard | ✅ Implemented | Full validation |
| Tax Calculation (Server) | ✅ Implemented | Old + New 2025 slabs with pre-save hook |
| Tax Calculation (Client) | ✅ Implemented | Standalone calculator page |
| Form 16 PDF Parsing | ✅ Implemented | Regex-based text extraction |
| PDF Report Generation | ✅ Implemented | jsPDF + html2canvas |
| Document Checklist | ✅ Implemented | 4 required documents |
| Educational Pages | ✅ Implemented | 9 educational routes |
| Landing Page | ✅ Implemented | Hero, Carousel3D, CardShowcase, Stats, Testimonials, FAQ, Contact |
| Dark Theme UI | ✅ Implemented | CRED-inspired, Neo-Brutalist |
| Google Analytics | ✅ Implemented | GA4 tracking |
| Responsive Design | ✅ Implemented | Mobile + Desktop |
| Password Hashing | ❌ Not Implemented | Critical security gap |
| Email Verification | ❌ Not Implemented | — |
| Admin Dashboard | ⚠️ Partial | Separate folder exists (TaxSaarthi_Admin) but not integrated |
| Dark/Light Theme Toggle | ⚠️ Partial | ThemeToggle component exists in header |

---

## 10. Suggestions for Enhancement

### 🔴 Critical (Security & Reliability)

| # | Suggestion | Impact |
|---|-----------|--------|
| S-01 | **Password Hashing** — Use bcrypt to hash passwords before storing in DB. Current system stores plain text. | Security |
| S-02 | **Input Sanitization** — Add server-side validation and sanitization (express-validator) to prevent injection attacks. | Security |
| S-03 | **Rate Limiting** — Add rate limiting on auth endpoints to prevent brute force attacks (express-rate-limit). | Security |
| S-04 | **HTTPS Enforcement** — Ensure all API calls use HTTPS in production. | Security |
| S-05 | **Error Handling Middleware** — Add centralized error handling middleware on the Express server instead of scattered try-catch. | Reliability |

### 🟠 High Priority (Core Features)

| # | Suggestion | Impact |
|---|-----------|--------|
| S-06 | **Email OTP Verification** — Verify user email during signup using OTP (Nodemailer + OTP generation). | Trust & Security |
| S-07 | **Forgot Password Flow** — Password reset via email link/OTP. | Usability |
| S-08 | **Tax Filing History** — Allow users to view past tax calculations and reports (currently only latest by Token). | Core Feature |
| S-09 | **Multi-Year Support** — Let users select assessment year (AY 2024-25, 2025-26, etc.) with matching slab rules. | Accuracy |
| S-10 | **Admin Dashboard Integration** — Connect the existing TaxSaarthi_Admin module for user management, analytics, and admin operations. | Management |
| S-11 | **Form 16 Parser Accuracy** — Improve regex patterns or integrate OCR (Tesseract.js) for better Form 16 data extraction from varied formats. | Accuracy |

### 🟡 Medium Priority (UX & Features)

| # | Suggestion | Impact |
|---|-----------|--------|
| S-12 | **AI Tax Chatbot** — Integrate an AI chatbot (OpenAI/Gemini API) for personalized tax advice and query resolution. | Innovation |
| S-13 | **Dark/Light Theme Toggle** — Complete the ThemeToggle implementation with CSS variables and localStorage persistence. | UX |
| S-14 | **Progress Auto-Save** — Save form wizard progress to DB/localStorage so users can resume later. | UX |
| S-15 | **PDF Email Delivery** — Send generated PDF report to user's email (Nodemailer + attachment). | Convenience |
| S-16 | **Notification System** — Notify users about tax deadlines, filing reminders via email or in-app. | Engagement |
| S-17 | **Data Export** — Allow users to export their tax data as JSON/CSV for backup. | Utility |
| S-18 | **ITR Form Pre-fill** — Generate ITR-1 (Sahaj) form pre-filled with user data for direct upload to income tax portal. | Core Feature |
| S-19 | **Comparison Dashboard** — Visual dashboard with charts comparing Old vs New regime breakdown (Chart.js / Recharts). | Visualization |
| S-20 | **Contact Form Backend** — Actually send contact form submissions to an email or store in DB (currently no backend handler). | Completeness |

### 🟢 Low Priority (Polish & Growth)

| # | Suggestion | Impact |
|---|-----------|--------|
| S-21 | **SEO Optimization** — Add meta tags, Open Graph tags, structured data for all educational pages. | Discoverability |
| S-22 | **PWA Support** — Add service worker and manifest for offline access and "Add to Home Screen" capability. | Mobile UX |
| S-23 | **Localization (i18n)** — Add Hindi and Marathi language support for wider reach. | Accessibility |
| S-24 | **Unit & Integration Tests** — Add Jest + React Testing Library tests for components and API endpoints (Supertest). | Quality |
| S-25 | **CI/CD Pipeline** — Set up GitHub Actions for automated testing, linting, and deployment. | DevOps |
| S-26 | **Social Login** — Add Google/GitHub OAuth for easier sign-up (Passport.js). | Convenience |
| S-27 | **User Feedback System** — In-app feedback/rating mechanism with backend storage. | Product |
| S-28 | **Accessibility (a11y)** — WCAG 2.1 compliance — ARIA labels, keyboard navigation, screen reader support. | Inclusivity |
| S-29 | **Performance Monitoring** — Add backend APM (Sentry/New Relic) for error tracking and performance monitoring. | Observability |
| S-30 | **API Documentation** — Generate Swagger/OpenAPI docs for all backend endpoints. | Developer DX |

---

### Suggested Implementation Priority Order

Based on impact and effort, here's the recommended order for the next implementation sprint:

1. **S-01** — Password Hashing (bcrypt) ← Quick win, critical
2. **S-05** — Error Handling Middleware ← Foundation for reliability
3. **S-02** — Input Sanitization ← Security baseline
4. **S-08** — Tax Filing History ← High user value
5. **S-12** — AI Tax Chatbot ← Differentiating feature
6. **S-14** — Progress Auto-Save ← UX improvement
7. **S-19** — Comparison Dashboard with Charts ← Visual appeal
8. **S-06** — Email OTP Verification ← Trust building
9. **S-10** — Admin Dashboard Integration ← Management
10. **S-20** — Contact Form Backend ← Completeness

---

*This SRS document reflects the current state of the TaxSarthi application as of February 13, 2026. It will be updated as new features are implemented based on the implementation plan derived from this document.*
