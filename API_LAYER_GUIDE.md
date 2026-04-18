# API Layer Implementation Guide

This guide shows how to use the new centralized API layer in your React components.

## 📁 Structure

```
client/src/api/
  ├── client.js       # Axios configuration + interceptors
  ├── auth.js         # Authentication endpoints
  ├── tax.js          # Tax calculation endpoints
  ├── chat.js         # Chatbot endpoints
  └── index.js        # Centralized exports
```

## 🚀 Usage Examples

### Before (❌ Old Way)

```javascript
// Hardcoded URLs, no error handling, duplicated code
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
  } catch (error) {
    console.error(error);
  }
};
```

### After (✅ New Way)

```javascript
import { loginUser } from '@/api'; // or import { loginUser } from '@/api/auth'

const handleLogin = async (email, password) => {
  try {
    const response = await loginUser(email, password);
    localStorage.setItem('authToken', response.data.token);
  } catch (error) {
    console.error(error.response?.data?.message || 'Login failed');
  }
};
```

---

## 🔐 Authentication Endpoints

### Send OTP

```javascript
import { sendOTP } from '@/api';

const handleSendOTP = async (email) => {
  try {
    const response = await sendOTP(email, 'signup'); // or 'reset'
    toast.success('OTP sent to your email');
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};
```

### Verify OTP & Signup

```javascript
import { verifyOTPSignup } from '@/api';

const handleVerifyOTP = async (email, otp, userData) => {
  try {
    const response = await verifyOTPSignup(email, otp, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
    });
    localStorage.setItem('authToken', response.data.token);
    router.push('/dashboard');
  } catch (error) {
    toast.error('OTP verification failed');
  }
};
```

### Login

```javascript
import { loginUser } from '@/api';

const handleSubmitLogin = async (formData) => {
  try {
    const response = await loginUser(formData.email, formData.password);
    localStorage.setItem('authToken', response.data.token);
    router.push('/dashboard');
  } catch (error) {
    setError(error.response?.data?.message || 'Login failed');
  }
};
```

### Get User Profile

```javascript
import { getUserProfile } from '@/api';

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };
  
  fetchProfile();
}, []);
```

---

## 💰 Tax Endpoints

### Calculate Tax

```javascript
import { calculateTax } from '@/api';

const handleTaxCalculation = async (formData) => {
  setLoading(true);
  try {
    const response = await calculateTax({
      basicSalary: formData.basicSalary,
      hra: formData.hra,
      lta: formData.lta,
      // ... other fields
    });
    setTaxResults(response.data);
  } catch (error) {
    toast.error('Tax calculation failed');
  } finally {
    setLoading(false);
  }
};
```

### Get Tax History

```javascript
import { getTaxHistory } from '@/api';

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await getTaxHistory(userId);
      setTaxHistory(response.data.history);
    } catch (error) {
      console.error('Failed to fetch tax history');
    }
  };
  
  fetchHistory();
}, [userId]);
```

### Download ITR-1 JSON

```javascript
import { generateITR1JSON } from '@/api';

const handleDownloadITR = async (taxToken) => {
  try {
    const response = await generateITR1JSON(taxToken);
    
    // Create downloadable JSON file
    const element = document.createElement('a');
    element.href = URL.createObjectURL(
      new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
    );
    element.download = `ITR-1-${taxToken}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (error) {
    toast.error('Failed to generate ITR-1 JSON');
  }
};
```

---

## 🤖 Chatbot Endpoints

### Send Chat Message

```javascript
import { sendChatMessage } from '@/api';

const handleSendMessage = async (userMessage) => {
  setLoading(true);
  
  try {
    const response = await sendChatMessage(userMessage, chatHistory);
    
    setMessages([
      ...messages,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: response.data.reply },
    ]);
  } catch (error) {
    toast.error('Failed to send message');
  } finally {
    setLoading(false);
  }
};
```

### Check Chatbot Health

```javascript
import { checkChatbotHealth } from '@/api';

useEffect(() => {
  const checkHealth = async () => {
    try {
      await checkChatbotHealth();
      setChatbotAvailable(true);
    } catch (error) {
      setChatbotAvailable(false);
    }
  };
  
  checkHealth();
}, []);
```

---

## 🛡️ Error Handling Pattern

All API functions return promises that can be caught with standard error handling:

```javascript
import { loginUser } from '@/api';

try {
  const response = await loginUser(email, password);
  // Success: response.data contains result
} catch (error) {
  // Error details available at:
  // - error.response?.status    (HTTP status code)
  // - error.response?.data      (Server error message)
  // - error.message             (Network error message)
  
  if (error.response?.status === 401) {
    // Unauthorized - token expired
    router.push('/login');
  } else if (error.response?.status === 400) {
    // Bad request - validation error
    console.error(error.response.data.message);
  } else {
    // Network or other error
    console.error('Something went wrong');
  }
}
```

---

## 📝 Adding New API Functions

To add a new endpoint:

1. **Create function in appropriate file** (`auth.js`, `tax.js`, or `chat.js`):

   ```javascript
   // In tax.js
   export const getAdvancedTaxReport = (taxId, year) => {
     return apiClient.get(`/tax/advanced-report/${taxId}`, {
       params: { year }
     });
   };
   ```

2. **Export from index.js**:

   ```javascript
   // In index.js
   export { 
     calculateTax, 
     getTaxHistory, 
     getTaxCalculation, 
     generateITR1JSON, 
     parseForm16, 
     saveTaxDraft, 
     getTaxDraft,
     getAdvancedTaxReport  // ← Add here
   } from './tax';
   ```

3. **Use in component**:

   ```javascript
   import { getAdvancedTaxReport } from '@/api';
   
   const report = await getAdvancedTaxReport(taxId, 2024);
   ```

---

## 🔄 JWT Token Management

The API layer automatically injects JWT tokens:

```javascript
// Token is automatically added to all requests via interceptor
const response = await loginUser(email, password);

// All subsequent requests include Authorization header:
// Authorization: Bearer <token>

// Token is stored in localStorage by your component:
localStorage.setItem('authToken', response.data.token);

// Logout clears token:
import { logoutUser } from '@/api';
logoutUser(); // Removes authToken from localStorage
```

---

## ⚡ Environment Configuration

Ensure `.env.local` is set:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

The API layer automatically uses this in `client.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
```

For production, update to:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 📊 Benefits of Centralized API Layer

✅ **Single source of truth** - API endpoints defined once  
✅ **DRY principle** - No duplicate fetch/axios code  
✅ **Consistent error handling** - All errors handled uniformly  
✅ **Token management** - JWT injected automatically  
✅ **Easy to test** - Mock API layer in tests  
✅ **Auto timeouts** - 30-second timeout on all requests  
✅ **Dev logging** - API calls logged in development only  
✅ **Easy migration** - Switch backends with one environment variable  

---

## 🚀 Migration Checklist

When refactoring existing components to use this API layer:

- [ ] Replace `fetch()` calls with API layer functions
- [ ] Replace inline axios calls with API layer functions
- [ ] Update localStorage token management to use `logoutUser()`
- [ ] Test all flows: login, signup, OTP, tax calculation, chatbot
- [ ] Verify `.env.local` has `VITE_API_URL` set
- [ ] Check browser console for network requests (should see API logs in dev mode)
- [ ] Test error scenarios (wrong credentials, network timeout, etc.)
