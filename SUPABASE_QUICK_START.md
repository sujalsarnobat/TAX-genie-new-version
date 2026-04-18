# ⚡ Supabase Quick Start - TaxSarthi Edition

**Switch from MongoDB to Supabase in 5 minutes!**

---

## 🎯 5-Minute Setup

### Step 1: Create Account (2 min)
```
1. Go to supabase.com
2. Sign up (GitHub/Google)
3. Create new project
4. Save password somewhere safe!
```

### Step 2: Get Credentials (1 min)
```
Dashboard → Settings → API
Copy:
- Project URL → SUPABASE_URL
- anon public key → SUPABASE_KEY
- service_role key → SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Update .env (1 min)
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJ...public-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role-key
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db...
```

### Step 4: Setup Database (1 min)
1. Copy all SQL from `server/Config/database.sql`
2. Go to Supabase → SQL Editor
3. Paste & Run

**Done! ✅**

---

## 📝 File Reference

### New Files Created:
- `server/Config/supabase.js` — Supabase client
- `server/Models/userModel.js` — User operations
- `server/Models/taxModel.js` — Tax operations
- `server/Models/otpModel.js` — OTP operations
- `server/Config/database.sql` — Database schema

### To Delete (Old MongoDB):
- `server/Models/User.js`
- `server/Models/TaxCalculation.model.js`
- `server/Models/OldReign.js`
- etc. (any Mongoose .js files in Models/)

---

## 🔄 Migration Checklist

- [ ] Create Supabase account
- [ ] Get API credentials
- [ ] Update `.env` file
- [ ] Run database SQL schema
- [ ] Update controllers to use new models
- [ ] Test signup → OTP → login
- [ ] Test tax calculation
- [ ] Deploy!

---

## 💾 Usage Example

### Before (MongoDB):
```javascript
const user = await User.findOne({ email });
```

### After (Supabase):
```javascript
const userModel = require('../Models/userModel');
const user = await userModel.getUserByEmail(email);
```

---

## 🚀 Deploy

### Environment Variables on Render/Railway:
```env
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=prod-service-key
DATABASE_URL=postgresql://...production-connection
```

---

## ✨ Why Supabase?

✅ Free tier: 500MB storage  
✅ PostgreSQL (powerful SQL)  
✅ Real-time built-in  
✅ Auth built-in (bonus!)  
✅ File storage built-in (bonus!)  
✅ No credit card needed  

---

## 📞 Support

**Supabase Docs:** https://supabase.com/docs  
**Full Migration Guide:** See `SUPABASE_MIGRATION.md`  

---

**Status:** Ready to replace MongoDB! 🎉
