# 🚀 Supabase Migration Guide - MongoDB to PostgreSQL

**Switching from MongoDB to Supabase (PostgreSQL)**

---

## 📋 Overview

**Old Stack:** Express + MongoDB + Mongoose  
**New Stack:** Express + Supabase (PostgreSQL) + @supabase/supabase-js

### Benefits of Supabase:
✅ PostgreSQL (more powerful than MongoDB)  
✅ Managed database (no setup)  
✅ Real-time subscriptions built-in  
✅ Authentication included (optional - you're using JWT)  
✅ File storage included  
✅ Free tier: 500MB storage + read-only realtime  
✅ No credit card needed for free tier  

---

## 🔧 Step 1: Set Up Supabase Project

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up (GitHub/Google/Email)
3. Create new project
4. Choose region (recommended: closest to your users)
5. Set database password (save it!)

### 1.2 Get API Keys
Once project is created:

1. Go to **Settings → API** 
2. Copy these credentials:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database**
4. Copy **Connection String** → `DATABASE_URL`

### 1.3 Update .env

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.your-project-id.supabase.co:5432/postgres
```

---

## 📦 Step 2: Install Dependencies

Remove MongoDB packages:
```bash
cd server
npm uninstall mongoose mongodb
```

Install Supabase packages:
```bash
npm install @supabase/supabase-js pg
```

---

## 🗄️ Step 3: Create Database Schema

### 3.1 Replace Models with SQL

**Before (MongoDB with Mongoose):**
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
});
```

**After (Supabase PostgreSQL):**

Go to Supabase Dashboard → **SQL Editor** → Create new query

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create OTP table
CREATE TABLE otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50), -- 'signup' or 'reset'
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_calculations table
CREATE TABLE tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  basic_salary DECIMAL(12, 2),
  hra DECIMAL(12, 2),
  lta DECIMAL(12, 2),
  other_allowances DECIMAL(12, 2),
  old_regime_tax JSONB,
  new_regime_tax JSONB,
  regime_suggested VARCHAR(50),
  assessment_year VARCHAR(10),
  token VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create personal_info table
CREATE TABLE personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pan VARCHAR(20) UNIQUE,
  name VARCHAR(255),
  dob DATE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  contact_number VARCHAR(15),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX idx_tax_calculations_token ON tax_calculations(token);
CREATE INDEX idx_otp_email ON otp(email);
```

Run these queries in Supabase SQL Editor.

### 3.2 Create Supabase Client

**New file:** `server/Config/supabase.js`

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
```

---

## 🔄 Step 4: Update Controllers

### Migration Pattern

**Before (MongoDB):**
```javascript
const User = require('../Models/User');

exports.signup = async (email, passwordHash, userData) => {
  const user = new User({
    email,
    password: passwordHash,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
  await user.save();
  return user;
};
```

**After (Supabase):**
```javascript
const supabase = require('../Config/supabase');

exports.signup = async (email, passwordHash, userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password: passwordHash,
      first_name: userData.firstName,
      last_name: userData.lastName,
    })
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};
```

---

## 📝 Step 5: Refactor Models

### New Model Structure

**Old:** `Models/User.js` (Mongoose)  
**New:** `Models/userModel.js` (Supabase queries)

```javascript
// server/Models/userModel.js
const supabase = require('../Config/supabase');

// CREATE
exports.createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// READ
exports.getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null; // User not found
  return data;
};

exports.getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// UPDATE
exports.updateUser = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// DELETE
exports.deleteUser = async (userId) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw new Error(error.message);
};
```

### Tax Calculation Model

```javascript
// server/Models/taxModel.js
const supabase = require('../Config/supabase');

exports.createTaxCalculation = async (taxData) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .insert({
      user_id: taxData.userId,
      basic_salary: taxData.basicSalary,
      hra: taxData.hra,
      lta: taxData.lta,
      other_allowances: taxData.otherAllowances,
      old_regime_tax: taxData.oldRegimeTax,
      new_regime_tax: taxData.newRegimeTax,
      regime_suggested: taxData.regimeSuggested,
      assessment_year: taxData.assessmentYear,
      token: taxData.token,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

exports.getTaxHistoryByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

exports.getTaxByToken = async (token) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('token', token)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
```

---

## 🔑 Step 6: Update Controllers

### UserController Example

**Before (MongoDB):**
```javascript
const User = require('../Models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**After (Supabase):**
```javascript
const userModel = require('../Models/userModel');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### OTP Controller

```javascript
const supabase = require('../Config/supabase');

exports.sendOTP = async (email, otp, purpose) => {
  // Store OTP in database (expires in 10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60000);

  const { error } = await supabase
    .from('otp')
    .insert({
      email,
      otp_code: otp,
      purpose,
      expires_at: expiresAt,
    });

  if (error) throw new Error(error.message);
};

exports.verifyOTP = async (email, otp) => {
  const { data, error } = await supabase
    .from('otp')
    .select('*')
    .eq('email', email)
    .eq('otp_code', otp)
    .gt('expires_at', new Date())
    .single();

  if (error || !data) {
    return { valid: false };
  }

  // Delete OTP after verification
  await supabase
    .from('otp')
    .delete()
    .eq('id', data.id);

  return { valid: true };
};
```

---

## 🔒 Step 7: Update Authentication Middleware

The JWT middleware stays the same! Your existing JWT logic works with Supabase.

```javascript
// middleware/auth.js (No changes needed!)
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
```

---

## 📧 Step 8: Update Email Service

Your Brevo email service stays the same! See `server/Config/mailer.js`

---

## 🤖 Step 9: Update Chatbot

Your Gemini chatbot stays the same! See `server/controllers/ChatController.js`

---

## 🧪 Step 10: Test Migration

### 1. Test User Creation
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

### 2. Check Supabase Dashboard
- Go to Supabase → **Table Editor**
- Verify new row in `users` table

### 3. Test OTP
- Call signup endpoint
- Check `otp` table for new entry

### 4. Test Tax Calculation
- Login → Calculate Tax
- Check `tax_calculations` table

---

## ✨ Advantages of Supabase

| Feature | MongoDB | Supabase |
|---------|---------|----------|
| Database Type | NoSQL | PostgreSQL (SQL) |
| Hosted | Atlas (paid) | Managed (free tier) |
| Authentication | Manual JWT | Built-in + JWT option |
| Real-time | Third-party | Built-in |
| File Storage | Third-party | Built-in |
| Migrations | Manual | Built-in SQL |
| Performance | Good | Excellent (SQL) |

---

## 🚀 Deployment with Supabase

### Production Environment Variables
```env
# Backend (.env on Render/Railway)
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_KEY=prod-key-here
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key
DATABASE_URL=postgresql://postgres:prod-password@db.prod-project.supabase.co:5432/postgres
JWT_SECRET=your-production-jwt-secret
BREVO_API_KEY=your-brevo-key
GEMINI_API_KEY=your-gemini-key
```

---

## 🔍 Common Issues & Fixes

### Issue: "SUPABASE_URL not found"
**Fix:** Ensure `.env` has correct values from Supabase dashboard

### Issue: "Service role key missing"
**Fix:** Use `SUPABASE_SERVICE_ROLE_KEY` not the public key

### Issue: "Connection timeout"
**Fix:** Verify firewall allows Supabase IP range

### Issue: "UUID error in insert"
**Fix:** Don't provide `id` field - Supabase auto-generates

---

## 📚 Quick Reference

### Supabase Query Pattern
```javascript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .single(); // For one row

if (error) throw new Error(error.message);
return data;
```

### Useful Supabase Queries
```javascript
// Select all
await supabase.from('users').select('*');

// Filter
await supabase.from('users').select('*').eq('email', 'user@example.com');

// Range
await supabase.from('tax_calculations').select('*').gte('created_at', startDate);

// Order
await supabase.from('users').select('*').order('created_at', { ascending: false });

// Limit
await supabase.from('users').select('*').limit(10);

// Insert
await supabase.from('users').insert({ email, password }).select();

// Update
await supabase.from('users').update({ name }).eq('id', userId).select();

// Delete
await supabase.from('users').delete().eq('id', userId);
```

---

## 🎯 Next Steps

1. Create Supabase account & project
2. Get API keys from dashboard
3. Update `.env` file
4. Install `@supabase/supabase-js` + `pg`
5. Create database schema (copy SQL from Step 3)
6. Refactor models (copy templates from Step 5-6)
7. Update controllers to use new models
8. Test all endpoints
9. Deploy!

---

## 💡 Pro Tips

✅ Supabase Auto-increments timestamps automatically  
✅ Use JSONB columns for complex data (like tax calculations)  
✅ Supabase has built-in Row Level Security (RLS) for auth  
✅ Use database migrations for schema changes  
✅ Test queries in Supabase SQL Editor first  

---

**Cost Comparison:**

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Supabase** | 500MB, unlimited API | $25/mo |
| **MongoDB Atlas** | 512MB | $9+/mo |

Supabase is **free** for your use case! 🎉

---

Made with ❤️ for modern database migrations
