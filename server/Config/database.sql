/**
 * Supabase Database Schema
 * Copy these SQL queries into Supabase SQL Editor and run them
 * 
 * Go to: Supabase Dashboard → SQL Editor → New Query
 * Copy-paste each section and run
 */

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

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. OTP TABLE (for email verification)
-- ============================================
CREATE TABLE IF NOT EXISTS otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50), -- 'signup' or 'reset'
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster OTP lookups
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

-- Create indexes for faster queries
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

-- Create index
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
  status VARCHAR(50) DEFAULT 'unread', -- 'unread', 'read', 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
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
  type VARCHAR(50), -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- 8. DROP TABLE QUERIES (if you need to reset)
-- ============================================
-- Run only if you want to start fresh:
-- 
-- DROP TABLE IF EXISTS notifications;
-- DROP TABLE IF EXISTS feedback;
-- DROP TABLE IF EXISTS contact_messages;
-- DROP TABLE IF EXISTS personal_info;
-- DROP TABLE IF EXISTS tax_calculations;
-- DROP TABLE IF EXISTS otp;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check users table structure:
-- \d users;

-- Check all indexes:
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Count records in each table:
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'otp' as table_name, COUNT(*) as count FROM otp
-- UNION ALL
-- SELECT 'tax_calculations' as table_name, COUNT(*) as count FROM tax_calculations
-- UNION ALL
-- SELECT 'personal_info' as table_name, COUNT(*) as count FROM personal_info
-- UNION ALL
-- SELECT 'contact_messages' as table_name, COUNT(*) as count FROM contact_messages
-- UNION ALL
-- SELECT 'notifications' as table_name, COUNT(*) as count FROM notifications;
