# ⚡ SUPABASE SETUP - STEPS 3-6 (Follow This!)

**You're at Step 3!** Follow this guide to complete setup.

---

## 📋 STEP 3: Create Database Schema (5 minutes)

### 3.1: Open Supabase SQL Editor
1. Go to: **supabase.com → Dashboard**
2. Select your **TaxSarthi** project
3. Click: **SQL Editor** (left sidebar)
4. Click: **"New Query"** button

### 3.2: Copy SQL Schema
1. Open file: `e:\Tax_Sarthi\server\Config\database.sql`
2. **SELECT ALL** (Ctrl+A)
3. **COPY** (Ctrl+C)

### 3.3: Paste & Run in Supabase
1. In Supabase SQL Editor, **PASTE** the SQL
2. Click: **"Run"** button (or Ctrl+Enter)
3. **Wait** for execution

**Expected Result:**
```
✅ Success
Created tables: users, otp, tax_calculations, personal_info, ...
```

**If error:** Check Supabase dashboard → Health tab

---

## 📦 STEP 4: Install Node Packages (2 minutes)

### 4.1: Open Terminal
```bash
cd e:\Tax_Sarthi\server
```

### 4.2: Install Supabase Package
```bash
npm install @supabase/supabase-js pg
```

**Wait for installation.** You should see:
```
added XX packages in X.Xs
```

### 4.3: Verify Installation
```bash
npm list @supabase/supabase-js
```

**Should show version number (e.g., 2.38.0)** ✅

---

## 🔄 STEP 5: Update Controllers (30 minutes)

### 5.1: Update UserController

**File:** `e:\Tax_Sarthi\server\controllers\UserController.js`

**Find these lines and replace them:**

#### Find:
```javascript
const User = require('../Models/User');
```

#### Replace with:
```javascript
const userModel = require('../Models/userModel');
```

---

#### Find functions that do: `await User.findOne()` or `await User.findById()`

#### Replace pattern:

**OLD:**
```javascript
const user = await User.findById(userId);
```

**NEW:**
```javascript
const user = await userModel.getUserById(userId);
```

**OLD:**
```javascript
const user = await User.findOne({ email });
```

**NEW:**
```javascript
const user = await userModel.getUserByEmail(email);
```

---

### 5.2: Update TaxController

**File:** `e:\Tax_Sarthi\server\controllers\TaxController.js`

**Replace:**
```javascript
const TaxCalculation = require('../Models/TaxCalculation.model');
```

**With:**
```javascript
const taxModel = require('../Models/taxModel');
```

**Replace patterns:**

**OLD:**
```javascript
const tax = await TaxCalculation.findOne({ Token });
```

**NEW:**
```javascript
const tax = await taxModel.getTaxByToken(Token);
```

**OLD:**
```javascript
const history = await TaxCalculation.find({ userId });
```

**NEW:**
```javascript
const { data: history } = await taxModel.getTaxHistoryByUserId(userId);
```

---

### 5.3: Update Authentication Flow

**File:** `e:\Tax_Sarthi\server\controllers\UserController.js`

**Find the signup function and update OTP handling:**

**OLD:**
```javascript
const otp = new OTP({ email, otpCode, purpose });
await otp.save();
```

**NEW:**
```javascript
const otpModel = require('../Models/otpModel');
await otpModel.storeOTP(email, otpCode, purpose);
```

**OLD:**
```javascript
const validOtp = await OTP.findOne({ email, otpCode });
if (!validOtp) throw new Error('Invalid OTP');
```

**NEW:**
```javascript
const otpModel = require('../Models/otpModel');
const validOtp = await otpModel.verifyOTP(email, otpCode);
if (!validOtp.valid) throw new Error('Invalid OTP');
```

---

### 5.4: List of All Supabase Functions Ready to Use

**User Model Functions:**
```javascript
await userModel.createUser(userData)
await userModel.getUserByEmail(email)
await userModel.getUserById(userId)
await userModel.updateUser(userId, updates)
await userModel.deleteUser(userId)
```

**Tax Model Functions:**
```javascript
await taxModel.createTaxCalculation(taxData)
await taxModel.getTaxByToken(token)
await taxModel.getTaxById(taxId)
await taxModel.getTaxHistoryByUserId(userId)
await taxModel.getTaxByYearAndUser(userId, year)
await taxModel.updateTaxCalculation(taxId, updates)
```

**OTP Model Functions:**
```javascript
await otpModel.storeOTP(email, otpCode, purpose)
await otpModel.verifyOTP(email, otpCode)
await otpModel.validateAndCleanOTP(email, otpCode)
await otpModel.deleteOTP(otpId)
```

---

## 🧪 STEP 6: Test Everything (10 minutes)

### 6.1: Start Server

```bash
npm start
```

**Wait for:**
```
✅ Supabase connection verified
Server is running on 8000
```

If you see error, check:
- `.env` file has correct credentials
- Supabase project initialized
- Database schema created

---

### 6.2: Test Signup (Create User)

**Open new terminal or use Postman/curl:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "OTP sent to your email",
  "token": "unique-token-here"
}
```

**AND Check Supabase:**
1. Go to Supabase Dashboard
2. Click: **Table Editor**
3. Select: **users** table
4. You should see new row with email: `test@example.com` ✅

---

### 6.3: Test OTP Verification

**Get OTP from:**
- Email (if Brevo configured)
- OR Server console logs (fallback mode)

```bash
curl -X POST http://localhost:8000/api/v1/auth/verify-otp-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "User created successfully",
  "token": "jwt-token-here"
}
```

---

### 6.4: Test Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 6.5: Test Tax Calculation

```bash
curl -X POST http://localhost:8000/api/v1/tax/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "basicSalary": 500000,
    "hra": 100000,
    "lta": 50000,
    "otherAllowances": 20000,
    "deductions": {
      "section80C": 100000
    },
    "assessmentYear": "2024-25"
  }'
```

**Expected:** Calculation result with tax breakdown

---

### 6.6: Test Tax History

```bash
curl http://localhost:8000/api/v1/tax/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** List of all tax calculations

---

## ✅ VERIFICATION CHECKLIST

```
STEP 3: Database Schema
  [ ] Logged into Supabase
  [ ] Opened SQL Editor
  [ ] Pasted database.sql
  [ ] Clicked Run
  [ ] See ✅ Success message
  [ ] Tables visible in Table Editor

STEP 4: Install Packages
  [ ] Opened terminal in server folder
  [ ] Ran: npm install @supabase/supabase-js pg
  [ ] Installation completed
  [ ] npm list @supabase/supabase-js shows version

STEP 5: Update Controllers
  [ ] Updated UserController
  [ ] Updated TaxController
  [ ] Imported new models (userModel, taxModel, otpModel)
  [ ] Replaced all old MongoDB calls

STEP 6: Test Everything
  [ ] npm start successful
  [ ] See "✅ Supabase connection verified"
  [ ] Signup creates user in Supabase
  [ ] OTP verification works
  [ ] Login returns JWT token
  [ ] Tax calculation saves to database
  [ ] Tax history retrieves data
```

---

## 🚀 WHAT'S NEXT?

Once all tests pass:

1. **Update Frontend API URLs** (if needed)
2. **Deploy Backend** (Render/Railway)
3. **Deploy Frontend** (Vercel)
4. **Test in Production**

---

## 🆘 TROUBLESHOOTING

### Error: "Supabase connection failed"
**Fix:** Check `.env` has correct credentials

### Error: "Table does not exist"
**Fix:** Rerun database.sql in Supabase SQL Editor

### Error: "Invalid JWT token"
**Fix:** Use token from login response in Authorization header

### Error: "UNIQUE constraint failed on email"
**Fix:** Use different email for testing

### Signup works but no OTP email
**Fix:** Check Brevo configuration, or use server console fallback

---

## 📞 QUICK LINKS

- Supabase Dashboard: https://supabase.com/dashboard
- Table Editor: Dashboard → Table Editor
- SQL Editor: Dashboard → SQL Editor
- API Settings: Dashboard → Settings → API

---

**You're almost done! Just follow these 4 steps!** 🎉

Good luck! 🚀
