# 🚀 TaxSaarthi Migration: Quick Reference Card

## Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Database** | MongoDB (local/Atlas) | Supabase PostgreSQL |
| **ORM** | Mongoose | Supabase JS Client |
| **Deployment** | Self-hosted/Heroku | Vercel |
| **Environment** | .env (local only) | Vercel secrets + .env example |
| **API Endpoints** | Same | ✅ Same (no client changes needed) |
| **Authentication** | JWT in code | JWT in code (ready for Supabase Auth later) |

---

## Key Files Changed

### Modified (5 files)
```
✏️ package.json                           → Removed mongoose/mongodb, added @supabase/supabase-js
✏️ server/index.js                        → Supabase connection validation
✏️ server/controllers/UserController.js   → Supabase queries for signup/login
✏️ server/controllers/TaxController.js    → Supabase queries for tax calculations
✏️ server/controllers/PersonalInfoController.js → Supabase upsert logic
✏️ server/controllers/OTPController.js    → Supabase OTP management
✏️ server/controllers/OldReignController.js → Supabase old regime storage
✏️ server/.env                            → Supabase credentials placeholders
```

### Created (6 new files)
```
✨ server/Config/supabase.js                          → Supabase client initialization
✨ server/package.json                                → Server metadata for Vercel
✨ server/supabase/migrations/001_initial_schema.sql  → Complete database schema
✨ server/.env.example                                → Full env template
✨ vercel.json                                        → Vercel deployment config
✨ DEPLOYMENT.md                                      → Step-by-step deployment guide
✨ MIGRATION_SUMMARY.md                               → This guide
```

---

## Setup Checklist (Copy & Paste)

### ✅ Phase 1: Supabase (15 min)
```bash
# 1. Create Supabase project at supabase.com
# 2. Copy credentials from Settings → API:
#    - SUPABASE_URL
#    - SUPABASE_SERVICE_ROLE_KEY  
#    - SUPABASE_ANON_KEY

# 3. Paste SQL schema in SQL Editor:
#    File: server/supabase/migrations/001_initial_schema.sql

# 4. Verify tables created in Table Editor
```

### ✅ Phase 2: Local Test (10 min)
```bash
# Update .env with real credentials
cd e:\Tax_Sarthi

# Install dependencies
npm install

# Start server
cd server
node index.js

# Expected output:
# ✅ Supabase connection verified
# Server is running on 8000.
```

### ✅ Phase 3: Vercel Deployment (10 min)
```bash
# 1. Create account at vercel.com
# 2. Import GitHub repository
# 3. Add environment variables (Settings → Environment Variables):
#    SUPABASE_URL=...
#    SUPABASE_SERVICE_ROLE_KEY=...
#    SUPABASE_ANON_KEY=...
#    JWT_SECRET=...
#    (and others from .env.example)

# 4. Click Deploy
# 5. Get production URL: https://tax-sarthi-xyz.vercel.app
```

### ✅ Phase 4: Test Production
```bash
# Test health endpoint
curl https://tax-sarthi-xyz.vercel.app/

# Test signup
curl -X POST https://tax-sarthi-xyz.vercel.app/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@gmail.com","password":"Test@123"}'
```

### ✅ Phase 5: Update Frontend (5 min)
```bash
# In client/src/ where API calls are made:
# Change: const API_URL = 'http://localhost:8000'
# To:     const API_URL = 'https://tax-sarthi-xyz.vercel.app'

# Create client/.env.production:
# REACT_APP_API_URL=https://tax-sarthi-xyz.vercel.app

# Rebuild and deploy
cd client
npm run build
# Deploy to Netlify or Vercel
```

---

## Endpoint Testing Examples

### User Signup
```bash
curl -X POST http://localhost:8000/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Response:
# {
#   "status": "success",
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "name": "John Doe",
#     "email": "john@example.com"
#   }
# }
```

### Tax Calculation
```bash
curl -X POST http://localhost:8000/api/v1/tax \
  -H "Content-Type: application/json" \
  -d '{
    "Token": "TAX-2024-001",
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john@example.com",
    "Salary": 1000000,
    "HRA": 300000,
    "Year": "2024"
  }'
```

### Get Tax History
```bash
curl -X POST http://localhost:8000/api/v1/tax/history \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

## Environment Variables Needed

### Supabase (Required)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT (Required)
```bash
JWT_SECRET=your_very_secure_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
```

### Email (Existing - Keep Same)
```bash
BREVO_API_KEY=xkeysib-bf110278620e76cb77c...
EMAIL_FROM=sujal.sar05@gmail.com
```

### AI (Existing - Keep Same)
```bash
GEMINI_API_KEY=AIzaSyCLX2RjX_Y8GrevDxI9_61WAZfJ8KF0-_o
```

### Server
```bash
PORT=8000
NODE_ENV=development  # or "production"
```

---

## File Structure After Migration

```
Tax_Sarthi/
├── package.json                    (updated)
├── vercel.json                     (new)
├── DEPLOYMENT.md                   (new)
├── MIGRATION_SUMMARY.md            (new)
├── server/
│   ├── package.json                (new)
│   ├── index.js                    (updated - Supabase)
│   ├── .env                        (update with creds)
│   ├── .env.example                (new template)
│   ├── Config/
│   │   ├── supabase.js             (new)
│   │   └── ... (other files)
│   ├── controllers/                (all updated for Supabase)
│   │   ├── UserController.js
│   │   ├── TaxController.js
│   │   ├── PersonalInfoController.js
│   │   ├── OTPController.js
│   │   ├── OldReignController.js
│   │   └── ... (others)
│   ├── supabase/
│   │   └── migrations/
│   │       └── 001_initial_schema.sql  (new)
│   └── ... (other directories)
└── client/
    └── ... (no changes needed yet)
```

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Client (React)              │
│    Deployed on Netlify/Vercel       │
└────────────┬────────────────────────┘
             │
             │ HTTPS Requests
             │
             ▼
┌─────────────────────────────────────┐
│   Backend (Node/Express)            │
│   Deployed on Vercel                │
│   server/index.js as entry point    │
└────────────┬────────────────────────┘
             │
             │ SQL Queries
             │
             ▼
┌─────────────────────────────────────┐
│   Supabase (PostgreSQL DB)          │
│   Database: taxsarthi_db            │
│   6 tables + indexes + triggers     │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### Problem: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run `npm install` in root directory

### Problem: "SUPABASE_URL is not defined"
**Solution:** 
- Check .env file has correct value
- Verify Vercel env vars are set
- Restart server

### Problem: Vercel deploy fails
**Solution:**
- Check build logs: Deployments → Failed → Logs
- Verify all env vars are set
- May need Node.js 18+ specified

### Problem: 404 errors
**Solution:**
- Verify vercel.json routes are correct
- Test with full URL: `https://yourdomain.com/user/login`
- Check CORS whitelist

---

## Important Notes

✅ **Good News:**
- No frontend code changes needed (endpoints are identical)
- All data is securely stored in PostgreSQL
- Automatic backups with Supabase
- Automatic scaling on Vercel
- Free tier covers dev/small prod workloads

⚠️ **Important:**
- Don't commit `.env` to GitHub
- Service role key only goes to Vercel (not client)
- Test thoroughly locally before production
- Keep old MongoDB as backup during transition

---

## Next: Full Deployment Steps

👉 **Read DEPLOYMENT.md for complete step-by-step guide**

It includes:
- Detailed Supabase setup
- Local testing procedures  
- Vercel deployment walkthrough
- Production validation
- Rollback procedures
- Monitoring setup

---

**Status: ✅ Code Ready | ⏳ Awaiting Supabase Setup**

Total time to production: **50 minutes**

Good luck! 🚀
