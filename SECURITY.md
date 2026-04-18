# Security & Environment Configuration Guide

## 🔐 Critical: Environment Variables Management

**⚠️ NEVER commit `.env` files to Git. They are excluded via `.gitignore`.**

### File Structure

```
server/
  .env              ← NEVER commit (has real keys)
  .env.example      ← Safe to commit (template only)

client/
  .env.local        ← NEVER commit (has real keys)  
  .env.example      ← Safe to commit (template only)
```

---

## 📋 Sensitive Keys in This Project

| Key | Purpose | Risk Level | Rotation Frequency |
|-----|---------|-----------|-------------------|
| `BREVO_API_KEY` | Email delivery (OTP) | 🔴 **HIGH** | Every 6 months or after leak |
| `GEMINI_API_KEY` | AI Chatbot | 🔴 **HIGH** | Every 6 months or after leak |
| `JWT_SECRET` | Token signing | 🔴 **CRITICAL** | Every 3 months or after compromise |
| `MONGO_URI` | Database access | 🔴 **CRITICAL** | Every 6 months + change password |

---

## 🔄 Key Rotation Steps (DO THIS IMMEDIATELY)

### 1️⃣ **Brevo API Key Rotation**

**Old Key Status:** 🚨 **EXPOSED** (in chat history)  
**Action:** Revoke and regenerate

**Steps:**
1. Go to [Brevo Dashboard](https://app.brevo.com/) → **SMTP & API**
2. Under "API keys" → Find old key → **Delete**
3. Create new API key → Copy
4. Update `server/.env`:
   ```env
   BREVO_API_KEY=xkeysib-new-key-here
   ```
5. **Test email delivery:**
   ```bash
   cd server
   npm test  # or manual OTP signup test
   ```

---

### 2️⃣ **Gemini API Key Rotation**

**Old Key Status:** 🚨 **EXPOSED** (in chat history)  
**Action:** Revoke and regenerate

**Steps:**
1. Go to [Google AI Console](https://aistudio.google.com/app/apikey) 
2. Find old key → **Delete**
3. Create new API key → Copy
4. Update `server/.env`:
   ```env
   GEMINI_API_KEY=your-new-gemini-key
   ```
5. **Test chatbot:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Say hello in 3 words","history":[]}'
   ```

---

### 3️⃣ **JWT Secret Rotation**

**Status:** 🟡 **MEDIUM** (template shows placeholder)  
**Action:** Regenerate strong secret

**Steps:**
1. Generate secure random key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Output: `a1b2c3d4e5f6...` (copy this)
3. Update `server/.env`:
   ```env
   JWT_SECRET=a1b2c3d4e5f6...
   ```
4. **Note:** Old tokens will become invalid (users need re-login)

---

### 4️⃣ **MongoDB Password Rotation** (If using MongoDB Atlas)

**Steps:**
1. [MongoDB Atlas Dashboard](https://cloud.mongodb.com/) → **Database Access**
2. Edit existing username → **Edit Password** → Generate secure password
3. Copy new password
4. Update `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:NEW_PASSWORD@cluster.mongodb.net/taxsarthi
   ```
5. Test connection:
   ```bash
   npm start
   ```

---

## ✅ Security Checklist

### Before Each Deployment

- [ ] `.env` file **NOT** committed (check git status)
- [ ] `.env.example` has **NO** real secrets
- [ ] `VITE_API_URL` points to correct backend domain
- [ ] All API keys are recent (< 6 months old)
- [ ] `JWT_SECRET` is min 32 characters
- [ ] No `console.log()` statements with sensitive data
- [ ] CORS `ALLOWED_ORIGINS` updated for production domain

### Production Deployment

- [ ] Use environment variables via hosting platform (Vercel secrets, Render env vars)
- [ ] **Never hardcode** credentials in code
- [ ] Enable HTTPS for all API calls
- [ ] Set `NODE_ENV=production`
- [ ] Disable development logging (`import.meta.env.DEV` checks in place)
- [ ] Test email delivery with production credentials

---

## 🚨 If Keys Were Compromised

**Immediate Action Required:**

1. **Revoke compromised keys immediately** (don't wait for scheduled rotation)
2. **Generate new keys** with same process above
3. **Update .env file** with new credentials
4. **Restart all services**
5. **Monitor logs** for unauthorized access:
   ```bash
   # Server logs
   npm start
   
   # API calls to watch
   - Unexpected email sends
   - Chatbot API quota spikes
   - Failed auth attempts
   ```
6. **Force re-login** (optional but recommended):
   - Clear user sessions from database
   - Notify users

---

## 📝 Environment Configuration Templates

### Development (`server/.env`)

```env
MONGO_URI=mongodb://localhost:27017/taxsarthi
PORT=8000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-for-production-min-32-chars
JWT_EXPIRE=7d
BREVO_API_KEY=xkeysib-your-brevo-key
EMAIL_FROM=dev-email@yourdomain.com
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=debug
```

### Production (`server/.env`)

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taxsarthi
PORT=8000
NODE_ENV=production
JWT_SECRET=STRONG-RANDOM-SECRET-MIN-32-CHARS-CHANGE-ME
JWT_EXPIRE=7d
BREVO_API_KEY=xkeysib-production-key
EMAIL_FROM=noreply@taxsarthi.com
GEMINI_API_KEY=production-gemini-key
ALLOWED_ORIGINS=https://taxsarthi.com,https://www.taxsarthi.com
LOG_LEVEL=info
```

### Frontend (`client/.env.local`)

```env
# Development
VITE_API_URL=http://localhost:8000/api/v1
VITE_ENV=development

# Production (comment out dev, uncomment prod)
# VITE_API_URL=https://api.taxsarthi.com/api/v1
# VITE_ENV=production

VITE_ENABLE_CHATBOT=true
VITE_ENABLE_ITR_DOWNLOAD=true
```

---

## 🔗 Useful Links

- **Brevo Dashboard:** https://app.brevo.com/
- **Google AI Studio:** https://aistudio.google.com/app/apikey
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Vercel Secrets:** https://vercel.com/docs/projects/environment-variables
- **Render Environment Variables:** https://render.com/docs/environment-variables

---

## 📞 Quick Reference

**Rotate all keys immediately if:**
- Code is pushed to public repository with `.env` file
- Sharing session/screen capture includes sensitive data
- Unauthorized API usage detected
- Regular security audit due

**Keep safe:** Print this guide and keep offline backup of production keys in secure vault (1Password, LastPass, etc.)
