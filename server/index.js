const express = require("express");
const dotenv = require("dotenv");
const supabase = require('./Config/supabase');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/UserRoutes');
const OldReignRoutes = require('./routes/OldReignRoutes')
const TaxRoutes = require('./routes/TaxRoutes')
const PersonalInfoRoutes = require('./routes/PersonalInfoRoute')
const Form16Routes = require('./routes/Form16Routes')
const ChatRoutes = require('./routes/ChatRoutes')
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Verify Supabase connection on startup
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('count(*)').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection verified');
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    process.exit(1);
  }
})();

const app = express();
app.use(express.json());
app.use(cors());

// --- Rate Limiting ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { status: 'error', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: 'error', message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// --- HTTPS Enforcement (Production) ---
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

app.get("/", (req, res) => {
  res.send("This is the backend server for the TaxSaarthi");
});

// Import and use the user routes (with auth rate limiter)
app.use('/user/signup', authLimiter);
app.use('/user/login', authLimiter);
app.use('/user', userRoutes);

app.use('/api/v1/tax',TaxRoutes);

app.use('/policy',OldReignRoutes);

app.use('/user',PersonalInfoRoutes);

app.use('/api/form16', Form16Routes);

app.use('/api/chat', ChatRoutes);

// --- Centralized Error Handler (must be LAST middleware) ---
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
});

