# TaxSaarthi Backend Migration Guide: MongoDB → Supabase + Vercel Deployment

## Overview
This document walks you through migrating the TaxSaarthi backend from MongoDB to Supabase (PostgreSQL) and deploying it on Vercel.

**Timeline:** ~30 minutes for full setup
**Risk Level:** Low (can rollback anytime until cutover)
**Downtime:** ~5 minutes during DNS swap (production only)

---

## Phase 1: Supabase Setup (10 minutes)

### Step 1.1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New project"**
4. Fill in:
   - **Name:** `taxsarthi-backend`
   - **Database password:** Generate a strong one (save it!)
   - **Region:** Choose closest to your users (e.g., ap-south-1 for India)
5. Click **Create new project**
6. Wait 2-3 minutes for project to initialize

### Step 1.2: Get Supabase Credentials
1. Once project is live, go to your project dashboard
2. Navigate to **Settings → API**
3. Copy these three values:
   ```
   SUPABASE_URL              (under "Project URL")
   SUPABASE_ANON_KEY         (under "API keys" → public)
   SUPABASE_SERVICE_ROLE_KEY (under "API keys" → secret)
   ```
4. Keep these safe—treat them like secrets

### Step 1.3: Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy **entire contents** of:
   ```
   server/supabase/migrations/001_initial_schema.sql
   ```
4. Paste into the SQL editor
5. Click **"Run"** (⌘+Enter or Ctrl+Enter)
6. Wait for all tables and triggers to complete (should be quick)
7. Verify in **Table Editor** that you see:
   - `users`
   - `personal_info`
   - `tax_calculations`
   - `otps`
   - `user_tax_profiles`
   - `old_reign_calculations`

✅ **Checkpoint:** All 6 tables created with indexes and triggers

---

## Phase 2: Local Testing (10 minutes)

### Step 2.1: Update Local `.env` File
Edit `server/.env`:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Paste real key
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...           # Paste real key
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_EXPIRE=7d
BREVO_API_KEY=xkeysib-...                                              # Keep existing
EMAIL_FROM=sujal.sar05@gmail.com                                       # Keep existing
GEMINI_API_KEY=AIzaSyC...                                              # Keep existing
PIN_CODE=8000
NODE_ENV=development
```

### Step 2.2: Install Dependencies
```bash
cd e:\Tax_Sarthi
npm install

# Remove old MongoDB dependencies (optional but clean)
npm uninstall mongoose mongodb
```

### Step 2.3: Start Backend Server Locally
```bash
cd server
node index.js
```

**Expected output:**
```
✅ Supabase connection verified
Server is running on 8000.
```

If you see this, **the Supabase connection is working!**

### Step 2.4: Test Key Endpoints (use Postman/curl)

#### Test 1: User Signup
```bash
curl -X POST http://localhost:8000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123"}'
```

**Expected response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

#### Test 2: User Login
```bash
curl -X POST http://localhost:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

#### Test 3: Save Tax Calculation
```bash
curl -X POST http://localhost:8000/api/v1/tax \
  -H "Content-Type: application/json" \
  -d '{"Token":"TAX-001","FirstName":"John","LastName":"Doe","Email":"test@example.com","Salary":1000000}'
```

✅ **Checkpoint:** All endpoints return success responses with real data in Supabase

---

## Phase 3: Vercel Deployment (5-10 minutes)

### Step 3.1: Prepare Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (recommended) or create account
3. Click **"Add New..." → "Project"**
4. **Import GitHub repository** (or upload ZIP)
   - Select `Tax_Sarthi` repository
5. Configure settings:
   - **Framework Preset:** Node.js
   - **Root Directory:** (leave default or select `server/`)
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`

### Step 3.2: Add Environment Variables to Vercel
1. In Vercel project settings, go to **Settings → Environment Variables**
2. Add each variable:

| Variable | Value | Scope |
|----------|-------|-------|
| `SUPABASE_URL` | https://your-project-id.supabase.co | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGci... | Production |
| `SUPABASE_ANON_KEY` | eyJhbGci... | Production |
| `JWT_SECRET` | your_secret_here_32_chars | Production |
| `JWT_EXPIRE` | 7d | Production |
| `BREVO_API_KEY` | xkeysib-... | Production |
| `EMAIL_FROM` | sujal.sar05@gmail.com | Production |
| `GEMINI_API_KEY` | AIzaSy... | Production |
| `PORT` | 8000 | Production |
| `NODE_ENV` | production | Production |

3. Click **Save** for each
4. Re-deploy to apply: **Deployments → Latest → Redeploy**

### Step 3.3: Deploy
1. Click **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your project
   - Deploy to CDN
3. Wait for deployment to complete (2-5 minutes)
4. Once complete, you'll get a **Production URL** like:
   ```
   https://tax-sarthi.vercel.app
   ```

✅ **Checkpoint:** Backend is live on Vercel

---

## Phase 4: Production Validation (5 minutes)

### Step 4.1: Test Production Endpoint
Replace `http://localhost:8000` with your Vercel URL:

```bash
curl -X GET https://tax-sarthi.vercel.app/

# Expected response:
# "This is the backend server for the TaxSaarthi"
```

### Step 4.2: Test Production Signup
```bash
curl -X POST https://tax-sarthi.vercel.app/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Prod User","email":"prod@example.com","password":"Prod@123"}'
```

### Step 4.3: Verify Data in Supabase
1. Go to Supabase dashboard → **Table Editor**
2. Click on `users` table
3. Verify the new user appears with correct data

✅ **Checkpoint:** Production backend is working, data syncing to Supabase

---

## Phase 5: Frontend Configuration (5 minutes)

### Step 5.1: Update Frontend API Base URL
Edit `client/src/` (find where API calls are made):

**Before (MongoDB):**
```javascript
const API_BASE = 'http://localhost:8000';
```

**After (Supabase + Vercel):**
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'https://tax-sarthi.vercel.app';
```

### Step 5.2: Add Frontend Env Variable
Create `client/.env.production`:
```bash
REACT_APP_API_URL=https://tax-sarthi.vercel.app
```

### Step 5.3: Rebuild and Deploy Frontend
```bash
cd client
npm run build
# Deploy static files to Netlify or Vercel
```

---

## Phase 6: CORS & Security Configuration

### Step 6.1: Update CORS whitelist in Server
Edit `server/index.js` CORS middleware:

```javascript
const whitelist = [
  'https://yourdomain.com',
  'https://tax-sarthi.vercel.app',  // Your frontend URL
  'http://localhost:3000',           // Local dev
];

app.use(cors({
  origin: whitelist,
  credentials: true,
  optionsSuccessStatus: 200,
}));
```

### Step 6.2: Set Supabase Row Level Security (RLS)
RLS is already enabled in the migration SQL. Verify in Supabase:

1. **SQL Editor** → **Create a new query**
2. Run:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('users', 'personal_info', 'tax_calculations');
```
3. Should see policies for all tables

---

## Troubleshooting

### Problem: "SUPABASE_URL is not defined"
**Solution:**
- Verify `.env` file has `SUPABASE_URL=...` (not empty)
- Check Vercel environment variables are set correctly
- Restart backend: `npm run start-backend`

### Problem: "Connection refused"
**Solution:**
- Check Supabase project status (Dashboard → Overview)
- Verify credentials are correct (copy-paste from API settings)
- Check firewall/network allows outbound to Supabase

### Problem: "Email already registered" on every signup
**Solution:**
- Check `otps` table TTL - delete old OTP records:
```sql
DELETE FROM otps WHERE created_at < NOW() - INTERVAL '10 minutes';
```

### Problem: Vercel deployment fails
**Solution:**
- Check build logs: **Deployments → Failed → Logs**
- Common causes:
  - Missing environment variables → Add all vars in Settings
  - Node.js version mismatch → Specify in `package.json`: `"engines": {"node": "18.x"}`
  - Missing dependencies → Run `npm install` locally first

### Problem: 404 Errors on Vercel
**Solution:**
- Check `vercel.json` rewrites are correct
- Backend must be in root directory or adjust paths
- Test with full URL: `https://tax-sarthi.vercel.app/user/login`

---

## Rollback Plan (If Something Goes Wrong)

### Quick Rollback to MongoDB (if needed)

1. **Keep MongoDB running locally/on server**
2. **Switch backend connection:**
   ```bash
   # In server/index.js, uncomment:
   // const connectDB = require('./Config/connect');
   // connectDB();
   
   # Comment out Supabase client
   ```
3. **Reinstall Mongoose:**
   ```bash
   npm install mongoose mongodb
   ```
4. **Redeploy:**
   ```bash
   npm run start-backend
   ```

**Note:** You'll lose any data created during the Supabase period. Data lives in **both** systems until you fully migrate.

---

## Post-Migration Checklist

- [ ] All Supabase credentials securely stored
- [ ] Database schema created and triggers working
- [ ] Local testing passed (signup, login, tax calc endpoints)
- [ ] Backend deployed to Vercel
- [ ] Production endpoints tested
- [ ] Data verified in Supabase
- [ ] Frontend updated with production API URL
- [ ] Frontend deployed (Netlify/Vercel)
- [ ] CORS whitelist configured
- [ ] RLS policies enabled
- [ ] Monitoring set up (Vercel Functions, Supabase metrics)

---

## Monitoring & Maintenance

### Daily Health Checks
```bash
# Health endpoint
curl https://tax-sarthi.vercel.app/

# Database connection
curl -X POST https://tax-sarthi.vercel.app/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test"}'
```

### View Logs
1. **Vercel:** Dashboard → Deployments → Runtime Logs
2. **Supabase:** Dashboard → Logs → API Usage

### Scale/Performance Tuning
- **Database:** Supabase › Project Settings › Database Auto-scaling
- **Compute:** Vercel › Settings › Function Configuration

---

## Next Steps (Optional Enhancements)

1. **Enable Supabase Auth** (replace custom JWT auth)
2. **Add Automated Backups** (Supabase › Backups)
3. **Set up CDN** (Supabase › Storage › CDN)
4. **Implement Caching** (Redis on Vercel Pro)
5. **Add Rate Limiting** (already in place, tune limits as needed)

---

## Support & Questions

If you encounter issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Check [Vercel Docs](https://vercel.com/docs)
3. Review error logs in both platforms
4. Test locally first before production deployment

**Good luck! 🚀**
