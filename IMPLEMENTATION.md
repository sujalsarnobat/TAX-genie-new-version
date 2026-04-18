# Implementation Plan

## TaxSarthi — Feature Implementation Roadmap

| Field | Detail |
|-------|--------|
| **Version** | 1.0 |
| **Date** | February 13, 2026 |
| **Based On** | [SRS.md](SRS.md) v1.0 |
| **Author** | Sujal Baburao Sarnobat |

---

## Table of Contents

1. [Sprint Overview](#1-sprint-overview)
2. [Sprint 1 — Security Foundation](#2-sprint-1--security-foundation)
3. [Sprint 2 — Core Feature Enhancements](#3-sprint-2--core-feature-enhancements)
4. [Sprint 3 — AI & Smart Features](#4-sprint-3--ai--smart-features)
5. [Sprint 4 — UX & Visualization](#5-sprint-4--ux--visualization)
6. [Sprint 5 — Communication & Notifications](#6-sprint-5--communication--notifications)
7. [Sprint 6 — Polish & Growth](#7-sprint-6--polish--growth)
8. [File Change Map](#8-file-change-map)
9. [Dependency Installation Plan](#9-dependency-installation-plan)
10. [Testing Checklist](#10-testing-checklist)

---

## 1. Sprint Overview

| Sprint | Focus | Items | Effort |
|--------|-------|-------|--------|
| **Sprint 1** | Security Foundation | S-01, S-02, S-03, S-04, S-05 | 2-3 days |
| **Sprint 2** | Core Features | S-06, S-07, S-08, S-09, S-11 | 4-5 days |
| **Sprint 3** | AI & Smart Features | S-12, S-18 | 3-4 days |
| **Sprint 4** | UX & Visualization | S-13, S-14, S-19 | 3-4 days |
| **Sprint 5** | Communication | S-15, S-16, S-17, S-20 | 2-3 days |
| **Sprint 6** | Polish & Growth | S-21 to S-30 (excluding S-10) | 5-7 days |

**Total Estimated Effort: 19–26 days**

---

## 2. Sprint 1 — Security Foundation

### S-01: Password Hashing (bcrypt)

**Priority:** 🔴 Critical | **Effort:** 2 hours

**What to do:**
- Install `bcryptjs` on the server
- Hash password during signup before saving to DB
- Compare hashed password during login
- Write a one-time migration script to hash existing plain-text passwords

**Files to modify:**
| File | Changes |
|------|---------|
| `server/controllers/UserController.js` | Add bcrypt import, hash in `signup()`, compare in `login()` |
| `server/package.json` | Add `bcryptjs` dependency |

**Implementation:**

```javascript
// server/controllers/UserController.js

const bcrypt = require('bcryptjs');

// In signup():
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, password: hashedPassword });

// In login():
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({ message: "Invalid credentials" });
}
```

**Migration script (one-time):**
```javascript
// server/scripts/hashExistingPasswords.js
const User = require('../Models/Person');
const bcrypt = require('bcryptjs');
const connectDB = require('../Config/connect');

async function migrate() {
  await connectDB();
  const users = await User.find({});
  for (const user of users) {
    // Skip if already hashed (bcrypt hashes start with $2)
    if (!user.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log(`Hashed password for: ${user.email}`);
    }
  }
  console.log('Migration complete');
  process.exit(0);
}
migrate();
```

**Acceptance criteria:**
- [ ] New signups store hashed passwords
- [ ] Login works with hashed comparison
- [ ] Existing users can still login after migration
- [ ] Plain-text passwords no longer exist in DB

---

### S-02: Input Sanitization (express-validator)

**Priority:** 🔴 Critical | **Effort:** 3 hours

**What to do:**
- Install `express-validator`
- Add validation middleware for all POST endpoints
- Sanitize inputs (trim, escape HTML, normalize email)
- Return structured validation errors

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/middleware/validate.js` | NEW — Validation rules for each route |
| `server/routes/UserRoutes.js` | Add validation middleware to signup/login |
| `server/routes/TaxRoutes.js` | Add validation middleware |
| `server/routes/PersonalInfoRoute.js` | Add validation middleware |

**Implementation:**

```javascript
// server/middleware/validate.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

const personalInfoValidation = [
  body('FirstName').trim().notEmpty().escape(),
  body('LastName').trim().notEmpty().escape(),
  body('Email').isEmail().normalizeEmail(),
  body('AadharNo').isNumeric().isLength({ min: 12, max: 12 }),
  body('PanCard').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  body('MobileNo').matches(/^[6-9]\d{9}$/),
  body('PinCode').matches(/^\d{6}$/),
  handleValidationErrors
];

module.exports = { signupValidation, loginValidation, personalInfoValidation };
```

```javascript
// server/routes/UserRoutes.js (updated)
const { signupValidation, loginValidation } = require('../middleware/validate');
router.post('/signup', signupValidation, UserController.signup);
router.post('/login', loginValidation, UserController.login);
```

**Acceptance criteria:**
- [ ] Invalid email formats are rejected with 400 status
- [ ] XSS payloads are escaped in all string fields
- [ ] PAN/Aadhaar/Mobile formats are validated server-side
- [ ] Structured error messages returned for all validation failures

---

### S-03: Rate Limiting

**Priority:** 🔴 Critical | **Effort:** 1 hour

**What to do:**
- Install `express-rate-limit`
- Apply strict rate limit on auth endpoints (10 requests/15 min)
- Apply general rate limit on all other endpoints (100 requests/15 min)

**Files to modify:**
| File | Changes |
|------|---------|
| `server/index.js` | Add rate limiter middleware |

**Implementation:**

```javascript
// server/index.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
app.use('/user/signup', authLimiter);
app.use('/user/login', authLimiter);
```

**Acceptance criteria:**
- [ ] Auth endpoints blocked after 10 requests in 15 minutes
- [ ] General endpoints blocked after 100 requests in 15 minutes
- [ ] Proper 429 error message returned
- [ ] Rate limit headers present in responses

---

### S-04: HTTPS Enforcement

**Priority:** 🔴 Critical | **Effort:** 30 minutes

**What to do:**
- Add middleware to redirect HTTP to HTTPS in production
- Ensure all frontend API URLs use HTTPS
- Add `Strict-Transport-Security` header

**Files to modify:**
| File | Changes |
|------|---------|
| `server/index.js` | Add HTTPS redirect middleware |
| `client/src/` (API calls) | Ensure base URL uses `https://` |

**Implementation:**

```javascript
// server/index.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}
```

---

### S-05: Error Handling Middleware

**Priority:** 🔴 Critical | **Effort:** 2 hours

**What to do:**
- Create centralized error handling middleware
- Create custom `AppError` class
- Wrap all controller functions with async error catcher
- Return consistent error response format

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/middleware/errorHandler.js` | NEW — Centralized error handler |
| `server/utils/AppError.js` | NEW — Custom error class |
| `server/utils/catchAsync.js` | NEW — Async wrapper utility |
| `server/index.js` | Mount error handler as last middleware |
| `server/controllers/*.js` | Wrap handlers with catchAsync |

**Implementation:**

```javascript
// server/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

// server/utils/catchAsync.js
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
module.exports = catchAsync;

// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
module.exports = errorHandler;
```

```javascript
// server/controllers/UserController.js (refactored)
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already registered', 409);
  // ... rest of signup logic
});
```

**Acceptance criteria:**
- [ ] All controllers use catchAsync wrapper
- [ ] Unhandled errors return consistent JSON format
- [ ] Stack traces only visible in development mode
- [ ] Mongoose validation errors handled gracefully

---

## 3. Sprint 2 — Core Feature Enhancements

### S-06: Email OTP Verification

**Priority:** 🟠 High | **Effort:** 4 hours

**What to do:**
- Install `nodemailer`
- Create OTP model (email, otp, expiry)
- Send 6-digit OTP on signup before creating user
- Verify OTP endpoint to complete registration
- OTP expires after 10 minutes

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/Models/OTP.js` | NEW — OTP schema (email, otp, createdAt with TTL) |
| `server/Config/mailer.js` | NEW — Nodemailer transporter setup |
| `server/controllers/UserController.js` | Add `sendOTP()`, `verifyOTP()` functions |
| `server/routes/UserRoutes.js` | Add `/user/send-otp`, `/user/verify-otp` routes |
| `client/src/components/Auth/SignUp.jsx` | Add OTP input step after email entry |

**Schema:**
```javascript
// server/Models/OTP.js
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 min TTL
});
```

**Flow:**
1. User enters email + password → clicks "Send OTP"
2. Server generates 6-digit OTP → sends via email → stores hashed OTP in DB
3. User enters OTP → server verifies → creates account
4. If OTP expired/wrong → show error, allow resend

**Acceptance criteria:**
- [ ] OTP email delivered within 30 seconds
- [ ] OTP expires after 10 minutes
- [ ] Wrong OTP returns error with attempts remaining
- [ ] Signup blocked until OTP verified
- [ ] Resend OTP button with cooldown timer

---

### S-07: Forgot Password Flow

**Priority:** 🟠 High | **Effort:** 3 hours

**What to do:**
- Add "Forgot Password" link on login page
- Reuse OTP system from S-06
- After OTP verification, allow password reset
- Hash new password with bcrypt before saving

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/controllers/UserController.js` | Add `forgotPassword()`, `resetPassword()` |
| `server/routes/UserRoutes.js` | Add `/user/forgot-password`, `/user/reset-password` |
| `client/src/components/Auth/SignIn.jsx` | Add "Forgot Password?" link |
| `client/src/pages/Auth/ForgotPassword.jsx` | NEW — Forgot password page |
| `client/src/App.js` | Add `/forgot-password` route |

**Flow:**
1. User clicks "Forgot Password" → enters email
2. Server sends OTP to email
3. User enters OTP + new password
4. Server verifies OTP → hashes new password → updates user
5. Redirect to login with success message

**Acceptance criteria:**
- [ ] "Forgot Password" accessible from login page
- [ ] OTP sent to registered email only
- [ ] New password must meet minimum requirements (8+ chars)
- [ ] Success toast and redirect to login after reset

---

### S-08: Tax Filing History

**Priority:** 🟠 High | **Effort:** 4 hours

**What to do:**
- Add endpoint to fetch all tax calculations for a user (by email)
- Create "Tax History" page with list of past filings
- Each entry shows: date, assessment year, preferred regime, total tax
- Click to view full report (existing OutPutDoc page)

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/controllers/TaxController.js` | Add `getUserTaxHistory()` function |
| `server/routes/TaxRoutes.js` | Add `POST /api/v1/tax/history` endpoint |
| `client/src/pages/TaxHistory/TaxHistory.jsx` | NEW — History listing page |
| `client/src/pages/TaxHistory/TaxHistory.css` | NEW — Styling |
| `client/src/App.js` | Add `/tax-history` route |
| `client/src/components/header/Header.jsx` | Add "History" nav link |

**API:**
```javascript
// POST /api/v1/tax/history
// Body: { Email: "user@email.com" }
// Response: [{ Token, Year, PreferredSystem, OldFinalTax, NewFinalTax, createdAt }, ...]

const getUserTaxHistory = catchAsync(async (req, res) => {
  const { Email } = req.body;
  const history = await TaxCalculation.find({ Email })
    .select('Token Year PreferredSystem OldFinalTax OldFinalCess NewFinalTax NewFinalCess TotalIncome createdAt')
    .sort({ createdAt: -1 });
  res.json(history);
});
```

**UI — TaxHistory.jsx:**
- Table/card list with columns: Assessment Year, Total Income, Old Tax, New Tax, Preferred, Date, Action
- "View Report" button opens `/doc?token=<Token>`
- Empty state: "No tax filings yet. Start your first filing!"
- Dark themed, consistent with existing design

**Acceptance criteria:**
- [ ] History shows all past filings sorted by newest first
- [ ] Clicking "View Report" loads the correct PDF report
- [ ] Empty state displayed for new users
- [ ] Only authenticated users can access history

---

### S-09: Multi-Year Support

**Priority:** 🟠 High | **Effort:** 3 hours

**What to do:**
- Add assessment year dropdown to FormWizard (AY 2024-25, 2025-26, 2026-27)
- Store year-specific slab configurations
- Tax calculation engine selects slabs based on chosen year
- PDF report shows the assessment year

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/utils/taxSlabs.js` | NEW — Year-wise slab configurations |
| `server/Models/TaxCalculation.model.js` | Update pre-save hook to use year-based slabs |
| `client/src/pages/Main Form/FormWizard.jsx` | Add AY dropdown in Step 3 (Employer) |
| `client/src/utils/taxCalculator.js` | Update client-side calculator with year support |

**Slab config:**
```javascript
// server/utils/taxSlabs.js
const slabs = {
  '2025-26': {
    old: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 },
    ],
    new: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.20 },
      { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.30 },
    ],
    oldStandardDeduction: 75000,
    oldRebateLimit: 500000,
    newRebateLimit: 1200000,
    cess: 0.04,
  },
  '2024-25': {
    // Previous year slabs ...
  }
};
module.exports = slabs;
```

**Acceptance criteria:**
- [ ] Users can select assessment year from dropdown
- [ ] Tax calculated using correct year-specific slabs
- [ ] PDF report displays chosen assessment year
- [ ] Client-side calculator also supports year selection

---

### S-11: Form 16 Parser Accuracy

**Priority:** 🟠 High | **Effort:** 4 hours

**What to do:**
- Improve regex patterns for varied Form 16 formats
- Add fallback keyword-based extraction
- Add confidence score for each extracted field
- Show "Review" step highlighting uncertain fields
- Optionally integrate Tesseract.js for scanned PDFs

**Files to modify:**
| File | Changes |
|------|---------|
| `server/controllers/Form16Controller.js` | Improve regex patterns, add confidence scores |
| `client/src/components/TaxForm.js` | Show confidence indicators, highlight uncertain fields |

**Improved extraction patterns:**
```javascript
// Enhanced regex patterns with multiple format support
const patterns = {
  grossSalary: [
    /gross\s*salary[:\s]*₹?\s*([\d,]+)/i,
    /total\s*salary[:\s]*₹?\s*([\d,]+)/i,
    /income\s*under.*salary[:\s]*₹?\s*([\d,]+)/i,
  ],
  section80C: [
    /80C[:\s]*₹?\s*([\d,]+)/i,
    /deduction.*80C[:\s]*₹?\s*([\d,]+)/i,
    /chapter\s*VI-?A.*80C[:\s]*₹?\s*([\d,]+)/i,
  ],
  // ... more patterns with fallbacks
};

// Return confidence for each field
const extract = (text, fieldPatterns) => {
  for (let i = 0; i < fieldPatterns.length; i++) {
    const match = text.match(fieldPatterns[i]);
    if (match) {
      return { value: parseFloat(match[1].replace(/,/g, '')), confidence: 1 - (i * 0.15) };
    }
  }
  return { value: null, confidence: 0 };
};
```

**Acceptance criteria:**
- [ ] Parser handles at least 3 common Form 16 formats
- [ ] Confidence score shown for each auto-filled field
- [ ] Uncertain fields (confidence < 0.7) highlighted in yellow
- [ ] User can manually correct any auto-filled value

---

## 4. Sprint 3 — AI & Smart Features

### S-12: AI Tax Chatbot

**Priority:** 🟡 Medium | **Effort:** 6 hours

**What to do:**
- Integrate Google Gemini API (free tier) for tax Q&A
- Create chatbot UI component (floating button → chat window)
- System prompt with Indian tax context
- Chat history stored in session
- Pre-built quick questions for common queries

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/controllers/ChatController.js` | NEW — Gemini API integration |
| `server/routes/ChatRoutes.js` | NEW — `POST /api/chat` |
| `server/index.js` | Mount chat routes |
| `client/src/components/Chatbot/Chatbot.jsx` | NEW — Chat UI component |
| `client/src/components/Chatbot/Chatbot.css` | NEW — Chat styling |
| `client/src/App.js` | Add Chatbot component globally |

**Backend (Gemini integration):**
```javascript
// server/controllers/ChatController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are TaxSarthi AI — an expert Indian income tax advisor.
You help users understand:
- Old vs New tax regime comparison
- Section 80C, 80D, 80E deductions
- HRA exemption calculations
- ITR filing procedures
- Tax notices (Section 139(9), 142(1))
- Tax saving investment options (ELSS, PPF, NPS, etc.)
Always cite relevant sections of the Income Tax Act, 1961.
Keep answers concise and in simple language. Use ₹ for currency.
If unsure, recommend consulting a CA.`;

const chat = catchAsync(async (req, res) => {
  const { message, history = [] } = req.body;
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const chatSession = model.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood. I am TaxSarthi AI.' }] },
      ...history
    ],
  });
  const result = await chatSession.sendMessage(message);
  res.json({ reply: result.response.text() });
});
```

**Frontend (Chat UI):**
- Floating green button (bottom-right corner)
- Expandable chat window (400px × 500px)
- Pre-built quick questions: "Which regime saves more?", "How to claim HRA?", "80C investment options", "What is Section 87A rebate?"
- Markdown rendering for AI responses
- Typing indicator animation
- Dark themed matching app design

**Acceptance criteria:**
- [ ] Chat opens from floating button on all pages
- [ ] Quick question buttons trigger relevant queries
- [ ] AI responses accurate for basic tax queries
- [ ] Chat history persists during session
- [ ] Graceful error handling if API fails
- [ ] Rate limited to prevent API abuse

---

### S-18: ITR Form Pre-fill

**Priority:** 🟡 Medium | **Effort:** 5 hours

**What to do:**
- Generate ITR-1 (Sahaj) JSON format matching Income Tax Department schema
- Pre-fill with user's tax data
- Download as JSON for upload to incometax.gov.in
- Add "Download ITR-1 JSON" button on report page

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/utils/itrGenerator.js` | NEW — ITR-1 JSON generator |
| `server/controllers/TaxController.js` | Add `generateITR1()` function |
| `server/routes/TaxRoutes.js` | Add `POST /api/v1/tax/generate-itr1` |
| `client/src/pages/Pdf Docs/OutPutDoc.jsx` | Add "Download ITR-1 JSON" button |

**ITR-1 structure mapping:**
```javascript
// server/utils/itrGenerator.js
const generateITR1JSON = (taxData) => ({
  Form_ITR1: {
    AssessmentYear: taxData.Year,
    PersonalInfo: {
      Name: taxData.Name,
      PAN: taxData.PanCard,
      DOB: taxData.DateOfBirth,
      AadhaarCardNo: taxData.AadharNo,
      // ... mapped fields
    },
    IncomeDetails: {
      IncomeFromSalary: taxData.Salary,
      IncomeFromHouseProperty: taxData.OwnHouseIncome + taxData.RentedHouseIncome,
      IncomeFromOtherSources: taxData.OtherIncome,
      GrossTotalIncome: taxData.TotalIncome,
    },
    DeductionDetails: {
      Section80C: taxData.section80C,
      Section80D: taxData.section80D,
      // ... mapped deductions
    },
    TaxComputation: {
      TotalTaxPayable: taxData.PreferredSystem === 'OldRegime'
        ? taxData.OldFinalTax + taxData.OldFinalCess
        : taxData.NewFinalTax + taxData.NewFinalCess,
      TaxRegime: taxData.PreferredSystem,
    },
  },
});
```

**Acceptance criteria:**
- [ ] ITR-1 JSON matches income tax portal schema
- [ ] All user data correctly mapped
- [ ] Download triggers `.json` file save
- [ ] Works for both Old and New regime selections

---

## 5. Sprint 4 — UX & Visualization

### S-13: Dark/Light Theme Toggle

**Priority:** 🟡 Medium | **Effort:** 3 hours

**What to do:**
- Define CSS custom properties for both themes
- Complete ThemeToggle component with sun/moon icons
- Persist preference in localStorage
- Apply theme on app load before render (prevent flash)

**Files to create/modify:**
| File | Changes |
|------|---------|
| `client/src/variables.css` | Add `:root` and `[data-theme="light"]` CSS variables |
| `client/src/components/ThemeToggle/ThemeToggle.jsx` | Complete toggle component |
| `client/src/components/ThemeToggle/ThemeToggle.css` | Toggle styling |
| `client/src/App.js` | Initialize theme from localStorage on mount |
| All CSS files | Replace hardcoded colors with `var(--color-*)` variables |

**CSS Variables:**
```css
/* client/src/variables.css */
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-card: rgba(20, 20, 20, 0.95);
  --text-primary: #FFFFFF;
  --text-secondary: #888888;
  --accent: #4ADE80;
  --border: rgba(255, 255, 255, 0.08);
}

[data-theme="light"] {
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --bg-card: rgba(255, 255, 255, 0.95);
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --accent: #16A34A;
  --border: rgba(0, 0, 0, 0.1);
}
```

**Acceptance criteria:**
- [ ] Toggle switches between dark and light themes
- [ ] Preference persisted across page reloads
- [ ] No white flash on initial dark mode load
- [ ] All components respect theme variables
- [ ] Smooth transition animation between themes

---

### S-14: Progress Auto-Save

**Priority:** 🟡 Medium | **Effort:** 2 hours

**What to do:**
- Save FormWizard state to localStorage on every field change
- Restore saved progress on page load
- Show "Resume where you left off?" prompt if saved data exists
- Clear saved data after successful submission

**Files to modify:**
| File | Changes |
|------|---------|
| `client/src/pages/Main Form/FormWizard.jsx` | Add localStorage save/restore logic |

**Implementation:**
```javascript
// In FormWizard.jsx
const STORAGE_KEY = 'taxsarthi_form_progress';

// Save on change
useEffect(() => {
  const progress = { formData, currentStep, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}, [formData, currentStep]);

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const { formData: savedData, currentStep: savedStep, timestamp } = JSON.parse(saved);
    const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      // Show restore prompt
      setShowRestorePrompt(true);
      setSavedProgress({ formData: savedData, currentStep: savedStep });
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}, []);

// Clear on submit
const handleSubmit = async () => {
  // ... submit logic
  localStorage.removeItem(STORAGE_KEY);
};
```

**Acceptance criteria:**
- [ ] Form progress saved automatically
- [ ] "Resume" prompt shown with saved data preview
- [ ] User can choose to resume or start fresh
- [ ] Saved data expires after 24 hours
- [ ] Data cleared after successful submission

---

### S-19: Comparison Dashboard with Charts

**Priority:** 🟡 Medium | **Effort:** 4 hours

**What to do:**
- Install `recharts` library
- Create visual dashboard on the report page
- Charts: bar chart (regime comparison), pie chart (income breakdown), donut (deductions)
- Animated number counters for key metrics

**Files to create/modify:**
| File | Changes |
|------|---------|
| `client/src/components/TaxDashboard/TaxDashboard.jsx` | NEW — Charts component |
| `client/src/components/TaxDashboard/TaxDashboard.css` | NEW — Dashboard styling |
| `client/src/pages/Pdf Docs/OutPutDoc.jsx` | Import and render TaxDashboard |
| `client/package.json` | Add `recharts` dependency |

**Charts to include:**
1. **Bar Chart** — Old vs New Regime: Total Tax, Cess, Net Tax Payable
2. **Pie Chart** — Income Breakdown: Salary, Perquisites, Profit Income, Other Income, House Property
3. **Donut Chart** — Deduction Breakdown: 80C, 80D, 80E, 80G, HRA, LTA, Others
4. **Metric Cards** — Total Income, Taxable Income, Tax Saved, Preferred Regime (with animated counters)

**Acceptance criteria:**
- [ ] All 3 chart types render correctly with tax data
- [ ] Charts use app's green accent color scheme
- [ ] Responsive layout (stacks on mobile)
- [ ] Animated number counters on scroll
- [ ] Tooltips show exact values on chart hover

---

## 6. Sprint 5 — Communication & Notifications

### S-15: PDF Email Delivery

**Priority:** 🟡 Medium | **Effort:** 2 hours

**What to do:**
- Add "Email Report" button on PDF report page
- Generate PDF server-side using puppeteer/html template
- Send as email attachment via Nodemailer
- Show success toast after sending

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/controllers/TaxController.js` | Add `emailReport()` function |
| `server/routes/TaxRoutes.js` | Add `POST /api/v1/tax/email-report` |
| `client/src/pages/Pdf Docs/OutPutDoc.jsx` | Add "Email Report" button |

**Acceptance criteria:**
- [ ] PDF attached to email correctly
- [ ] Email delivered within 60 seconds
- [ ] Loading state shown while sending
- [ ] Success/error toast notification

---

### S-16: Notification System

**Priority:** 🟡 Medium | **Effort:** 3 hours

**What to do:**
- Create notification bell icon in header
- Store notifications in MongoDB (per user)
- Types: tax deadline reminders, filing confirmations, new feature announcements
- Mark as read functionality
- Unread count badge on bell icon

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/Models/Notification.js` | NEW — Notification schema |
| `server/controllers/NotificationController.js` | NEW — CRUD operations |
| `server/routes/NotificationRoutes.js` | NEW — Notification endpoints |
| `client/src/components/Notifications/NotificationBell.jsx` | NEW — Bell icon + dropdown |
| `client/src/components/Notifications/NotificationBell.css` | NEW — Styling |
| `client/src/components/header/Header.jsx` | Add NotificationBell component |

---

### S-17: Data Export

**Priority:** 🟡 Medium | **Effort:** 2 hours

**What to do:**
- Add "Export Data" button on profile/history page
- Export options: JSON (full data), CSV (tabular summary)
- Include all tax calculations and personal info
- Client-side file generation and download

**Files to create/modify:**
| File | Changes |
|------|---------|
| `client/src/utils/exportData.js` | NEW — JSON/CSV export utility |
| `client/src/pages/TaxHistory/TaxHistory.jsx` | Add export buttons |

**Implementation:**
```javascript
// client/src/utils/exportData.js
export const exportAsJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportAsCSV = (data, filename) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => Object.values(item).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

### S-20: Contact Form Backend

**Priority:** 🟡 Medium | **Effort:** 1 hour

**What to do:**
- Create contact message model
- Store submissions in MongoDB
- Send notification email to admin
- Return success response to client

**Files to create/modify:**
| File | Changes |
|------|---------|
| `server/Models/Contact.js` | NEW — Contact schema (email, subject, message, createdAt) |
| `server/controllers/ContactController.js` | NEW — Save contact + send email |
| `server/routes/ContactRoutes.js` | NEW — `POST /api/contact` |
| `server/index.js` | Mount contact routes |
| `client/src/pages/Home/Home.jsx` | Update contact form to POST to backend |

---

## 7. Sprint 6 — Polish & Growth

### S-21: SEO Optimization
- Add `react-helmet` for dynamic meta tags on each educational page
- Add Open Graph tags for social sharing
- Add structured data (JSON-LD) for tax-related pages
- Create `sitemap.xml` and `robots.txt`

### S-22: PWA Support
- Create `manifest.json` with app icons and theme colors
- Register service worker for offline caching
- Cache educational content pages for offline access
- Add "Install App" prompt

### S-23: Localization (i18n)
- Install `react-i18next`
- Create translation files: `en.json`, `hi.json`, `mr.json`
- Add language switcher in header
- Translate all UI strings (educational content can remain English initially)

### S-24: Unit & Integration Tests
- Set up Jest + React Testing Library
- Write tests for: tax calculation logic, form validation, API endpoints
- Set up Supertest for backend API testing
- Minimum 70% code coverage target

### S-25: CI/CD Pipeline
- Create `.github/workflows/ci.yml`
- Steps: install → lint → test → build
- Auto-deploy to Vercel on `main` branch push
- Run tests on PR creation

### S-26: Social Login (Google OAuth)
- Install `passport` and `passport-google-oauth20`
- Add Google login button on auth page
- Create/link account on first Google login
- Store Google profile ID in user model

### S-27: User Feedback System
- Add star-rating + comment form after PDF download
- Store in MongoDB feedback collection
- Display average rating on landing page
- Admin can view all feedback

### S-28: Accessibility (a11y)
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works for all forms
- Add skip-to-content link
- Test with screen reader (NVDA/VoiceOver)
- Color contrast ratio ≥ 4.5:1

### S-29: Performance Monitoring
- Integrate Sentry for error tracking (free tier)
- Add backend request logging (morgan)
- Monitor API response times
- Set up alerts for error rate spikes

### S-30: API Documentation (Swagger)
- Install `swagger-jsdoc` and `swagger-ui-express`
- Add JSDoc annotations to all routes
- Serve docs at `/api-docs`
- Include request/response examples

---

## 8. File Change Map

Summary of all new files and modifications across all sprints:

### New Files to Create

| File Path | Sprint | Purpose |
|-----------|--------|---------|
| `server/middleware/validate.js` | Sprint 1 | Input validation rules |
| `server/middleware/errorHandler.js` | Sprint 1 | Centralized error handler |
| `server/utils/AppError.js` | Sprint 1 | Custom error class |
| `server/utils/catchAsync.js` | Sprint 1 | Async error wrapper |
| `server/scripts/hashExistingPasswords.js` | Sprint 1 | One-time migration |
| `server/Models/OTP.js` | Sprint 2 | OTP schema |
| `server/Config/mailer.js` | Sprint 2 | Email transporter |
| `server/utils/taxSlabs.js` | Sprint 2 | Year-wise tax slabs |
| `client/src/pages/Auth/ForgotPassword.jsx` | Sprint 2 | Forgot password page |
| `client/src/pages/TaxHistory/TaxHistory.jsx` | Sprint 2 | Filing history page |
| `client/src/pages/TaxHistory/TaxHistory.css` | Sprint 2 | History styling |
| `server/controllers/ChatController.js` | Sprint 3 | AI chatbot backend |
| `server/routes/ChatRoutes.js` | Sprint 3 | Chat route |
| `client/src/components/Chatbot/Chatbot.jsx` | Sprint 3 | Chat UI |
| `client/src/components/Chatbot/Chatbot.css` | Sprint 3 | Chat styling |
| `server/utils/itrGenerator.js` | Sprint 3 | ITR-1 JSON generator |
| `client/src/components/TaxDashboard/TaxDashboard.jsx` | Sprint 4 | Charts component |
| `client/src/components/TaxDashboard/TaxDashboard.css` | Sprint 4 | Dashboard styling |
| `client/src/utils/exportData.js` | Sprint 5 | JSON/CSV export |
| `server/Models/Contact.js` | Sprint 5 | Contact form schema |
| `server/controllers/ContactController.js` | Sprint 5 | Contact handler |
| `server/routes/ContactRoutes.js` | Sprint 5 | Contact route |
| `server/Models/Notification.js` | Sprint 5 | Notification schema |
| `server/controllers/NotificationController.js` | Sprint 5 | Notification CRUD |
| `server/routes/NotificationRoutes.js` | Sprint 5 | Notification routes |
| `client/src/components/Notifications/NotificationBell.jsx` | Sprint 5 | Bell icon component |
| `client/src/components/Notifications/NotificationBell.css` | Sprint 5 | Bell styling |

### Files to Modify

| File Path | Sprints | Changes |
|-----------|---------|---------|
| `server/index.js` | 1, 3, 5 | Rate limiting, error handler, new routes |
| `server/controllers/UserController.js` | 1, 2 | bcrypt, OTP, forgot password |
| `server/controllers/TaxController.js` | 2, 3, 5 | History, ITR-1, email report |
| `server/controllers/Form16Controller.js` | 2 | Improved regex patterns |
| `server/routes/UserRoutes.js` | 1, 2 | Validation middleware, OTP routes |
| `server/routes/TaxRoutes.js` | 1, 2, 3, 5 | Validation, history, ITR-1, email |
| `server/Models/TaxCalculation.model.js` | 2 | Year-based slab computation |
| `client/src/App.js` | 2, 3, 4 | New routes, chatbot, theme init |
| `client/src/pages/Main Form/FormWizard.jsx` | 2, 4 | AY dropdown, auto-save |
| `client/src/pages/Pdf Docs/OutPutDoc.jsx` | 3, 4, 5 | ITR download, dashboard, email |
| `client/src/components/Auth/SignUp.jsx` | 2 | OTP verification step |
| `client/src/components/Auth/SignIn.jsx` | 2 | Forgot password link |
| `client/src/components/header/Header.jsx` | 2, 5 | History link, notification bell |
| `client/src/components/TaxForm.js` | 2 | Confidence indicators |
| `client/src/variables.css` | 4 | Theme CSS variables |
| `client/src/components/ThemeToggle/ThemeToggle.jsx` | 4 | Complete implementation |

---

## 9. Dependency Installation Plan

### Server Dependencies

```bash
# Sprint 1 — Security
npm install bcryptjs express-validator express-rate-limit

# Sprint 2 — Core Features
npm install nodemailer

# Sprint 3 — AI
npm install @google/generative-ai

# Sprint 5 — Notifications
# No new dependencies (uses existing nodemailer)

# Sprint 6 — Polish
npm install swagger-jsdoc swagger-ui-express morgan
```

### Client Dependencies

```bash
# Sprint 4 — Visualization
npm install recharts

# Sprint 6 — Polish
npm install react-helmet react-i18next i18next
```

### Environment Variables to Add

```env
# .env (server)
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@taxsarthi.com
SENTRY_DSN=your_sentry_dsn        # Sprint 6
GOOGLE_CLIENT_ID=your_google_id   # Sprint 6
GOOGLE_CLIENT_SECRET=your_secret  # Sprint 6
```

---

## 10. Testing Checklist

### Sprint 1 — Security
- [ ] Signup creates user with hashed password
- [ ] Login with wrong password returns 401
- [ ] Invalid email format rejected (400)
- [ ] XSS payload in name field is escaped
- [ ] Rate limit kicks in after 10 auth requests
- [ ] Error handler returns consistent JSON format

### Sprint 2 — Core Features
- [ ] OTP sent to valid email
- [ ] Wrong OTP rejected, correct OTP accepted
- [ ] Password reset flow works end-to-end
- [ ] Tax history returns all filings for a user
- [ ] Multi-year slab computation is accurate
- [ ] Form 16 parser extracts fields from at least 3 formats

### Sprint 3 — AI & Smart Features
- [ ] Chatbot returns relevant tax answers
- [ ] Chat handles API failures gracefully
- [ ] ITR-1 JSON matches expected schema
- [ ] Downloaded JSON opens in income tax portal

### Sprint 4 — UX & Visualization
- [ ] Theme toggles between dark and light
- [ ] Theme preference persists on reload
- [ ] Form progress restores after page close
- [ ] Charts render correctly with real tax data

### Sprint 5 — Communication
- [ ] PDF emailed as attachment
- [ ] Notifications appear in bell dropdown
- [ ] JSON/CSV export downloads correctly
- [ ] Contact form submissions stored in DB

### Sprint 6 — Polish
- [ ] Meta tags render for each page (SEO)
- [ ] App installable as PWA
- [ ] All tests pass with ≥ 70% coverage
- [ ] CI pipeline runs on every PR
- [ ] Swagger docs accessible at `/api-docs`

---

*This implementation plan is derived from [SRS.md](SRS.md) v1.0. Each sprint should be committed and pushed separately with descriptive commit messages.*
