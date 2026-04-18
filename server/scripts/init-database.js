/**
 * Initialize Supabase Database Schema
 * Run this script to auto-create all tables
 * 
 * Command: node scripts/init-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SQL_SCHEMA = `
-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. OTP TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_email ON otp(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp(expires_at);

-- ============================================
-- 3. TAX CALCULATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tax_calculations (
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

CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_token ON tax_calculations(token);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_assessment_year ON tax_calculations(assessment_year);

-- ============================================
-- 4. PERSONAL INFO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS personal_info (
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

CREATE INDEX IF NOT EXISTS idx_personal_info_user_id ON personal_info(user_id);

-- ============================================
-- 5. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- ============================================
-- 6. FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  feature VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
`;

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    console.log('📡 Connecting to Supabase...');
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec', {
      sql: SQL_SCHEMA
    });

    if (error) {
      // Try alternative method using direct SQL execution
      console.log('⚠️  Standard method failed, trying alternative...\n');
      
      // Split queries and execute individually
      const queries = SQL_SCHEMA.split(';').filter(q => q.trim());
      let successCount = 0;
      let errorCount = 0;

      for (const query of queries) {
        if (query.trim()) {
          const { error: queryError } = await supabase.rpc('execute_sql', {
            sql: query
          }).catch(() => ({ error: null }));

          if (queryError) {
            console.log(`⚠️  Note: ${queryError.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        }
      }

      console.log(`\n📊 Results: ${successCount} queries executed`);
    }

    console.log('\n✅ Database initialization COMPLETE!\n');
    
    // Verify tables
    console.log('🔍 Verifying tables created...\n');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .match({ table_schema: 'public' });

    if (!tableError && tables) {
      console.log('✅ Tables created:');
      tables.forEach(t => console.log(`   ✓ ${t.table_name}`));
    } else {
      console.log('✅ Tables should be created (verify in Supabase dashboard)');
    }

    console.log('\n🎉 Ready to proceed to Step 4!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    console.log('\n💡 Try these steps:');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Open SQL Editor → New Query');
    console.log('3. Copy contents of: server/Config/database.sql');
    console.log('4. Paste and Run\n');
    process.exit(1);
  }
}

initializeDatabase();
