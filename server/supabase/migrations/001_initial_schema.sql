-- Tax Saarthi Backend Migration
-- Run this in Supabase SQL Editor to set up the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable LTREE for hierarchical data if needed
CREATE EXTENSION IF NOT EXISTS "ltree";

-- ============================================
-- TABLE: users
-- Purpose: Store user authentication data
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- TABLE: personal_info
-- Purpose: Store detailed personal information
-- ============================================
CREATE TABLE IF NOT EXISTS personal_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  date_of_birth VARCHAR(20),
  father_name VARCHAR(255),
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  aadhaar_no BIGINT UNIQUE,
  pan_card VARCHAR(20),
  mobile_no VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pin_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX idx_personal_info_token ON personal_info(token);
CREATE INDEX idx_personal_info_aadhaar ON personal_info(aadhaar_no);

-- ============================================
-- TABLE: tax_calculations
-- Purpose: Store detailed tax calculation data
-- ============================================
CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  
  -- Personal Information
  aadhaar_no BIGINT,
  first_name VARCHAR(255),
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  name VARCHAR(255),
  date_of_birth VARCHAR(20),
  father_name VARCHAR(255),
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  pan_card VARCHAR(20),
  mobile_no BIGINT,
  email VARCHAR(255),
  address TEXT,
  permanent_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pin_code VARCHAR(10),
  
  -- Employer Information
  employer_name VARCHAR(255),
  employer_address TEXT,
  employer_pan_number VARCHAR(20),
  tan_number VARCHAR(20),
  employee_reference_no VARCHAR(255),
  year VARCHAR(20),
  tax_deducted NUMERIC(15, 2) DEFAULT 0,
  
  -- Income Details
  salary NUMERIC(15, 2) DEFAULT 0,
  prerequisite_income NUMERIC(15, 2) DEFAULT 0,
  profit_income NUMERIC(15, 2) DEFAULT 0,
  other_income NUMERIC(15, 2) DEFAULT 0,
  hra NUMERIC(15, 2) DEFAULT 0,
  lta NUMERIC(15, 2) DEFAULT 0,
  other_exempted_allowances NUMERIC(15, 2) DEFAULT 0,
  professional_tax NUMERIC(15, 2) DEFAULT 0,
  
  -- House Income
  own_house_income NUMERIC(15, 2) DEFAULT 0,
  rented_house_income NUMERIC(15, 2) DEFAULT 0,
  deemed_house_income NUMERIC(15, 2) DEFAULT 0,
  
  -- Section 80 Deductions
  section_80c NUMERIC(15, 2) DEFAULT 0,
  section_80ccc NUMERIC(15, 2) DEFAULT 0,
  section_80ccd1 NUMERIC(15, 2) DEFAULT 0,
  section_80ccd2 NUMERIC(15, 2) DEFAULT 0,
  section_80ccd1b NUMERIC(15, 2) DEFAULT 0,
  section_80ccf NUMERIC(15, 2) DEFAULT 0,
  section_80ccg NUMERIC(15, 2) DEFAULT 0,
  section_80d NUMERIC(15, 2) DEFAULT 0,
  section_80dd NUMERIC(15, 2) DEFAULT 0,
  section_80ddb NUMERIC(15, 2) DEFAULT 0,
  section_80e NUMERIC(15, 2) DEFAULT 0,
  section_80ee NUMERIC(15, 2) DEFAULT 0,
  section_80g NUMERIC(15, 2) DEFAULT 0,
  section_80gga NUMERIC(15, 2) DEFAULT 0,
  section_80ggc NUMERIC(15, 2) DEFAULT 0,
  section_80qqb NUMERIC(15, 2) DEFAULT 0,
  section_80rrb NUMERIC(15, 2) DEFAULT 0,
  section_80tta NUMERIC(15, 2) DEFAULT 0,
  section_80u NUMERIC(15, 2) DEFAULT 0,
  
  -- Tax Calculation Results
  old_final_tax NUMERIC(15, 2) DEFAULT 0,
  old_final_cess NUMERIC(15, 2) DEFAULT 0,
  new_final_tax NUMERIC(15, 2) DEFAULT 0,
  new_final_cess NUMERIC(15, 2) DEFAULT 0,
  preferred_system VARCHAR(50) DEFAULT 'NewRegime',
  
  -- Totals
  total_taxable_income NUMERIC(15, 2) DEFAULT 0,
  total_income NUMERIC(15, 2) DEFAULT 0,
  total_deductions NUMERIC(15, 2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_calc_user_id ON tax_calculations(user_id);
CREATE INDEX idx_tax_calc_token ON tax_calculations(token);
CREATE INDEX idx_tax_calc_email ON tax_calculations(email);
CREATE INDEX idx_tax_calc_year ON tax_calculations(year);

-- ============================================
-- TABLE: otps
-- Purpose: Store OTP requests for auth flows
-- ============================================
CREATE TABLE IF NOT EXISTS otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  purpose VARCHAR(50) DEFAULT 'signup',
  attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '10 minutes'
);

CREATE INDEX idx_otps_email ON otps(email);
CREATE INDEX idx_otps_email_purpose ON otps(email, purpose);

-- ============================================
-- TABLE: user_tax_profiles
-- Purpose: Store multiple tax profiles per user
-- ============================================
CREATE TABLE IF NOT EXISTS user_tax_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_year VARCHAR(20) DEFAULT '2024-25',
  
  -- Basic Income
  basic_salary NUMERIC(15, 2) DEFAULT 0,
  hra NUMERIC(15, 2) DEFAULT 0,
  lta NUMERIC(15, 2) DEFAULT 0,
  other_allowances NUMERIC(15, 2) DEFAULT 0,
  
  -- Standard Deduction
  standard_deduction NUMERIC(15, 2) DEFAULT 50000,
  
  -- Old Regime Deductions
  section_80c NUMERIC(15, 2) DEFAULT 0,
  section_80d NUMERIC(15, 2) DEFAULT 0,
  section_80e NUMERIC(15, 2) DEFAULT 0,
  section_80eeea NUMERIC(15, 2) DEFAULT 0,
  section_80eeb NUMERIC(15, 2) DEFAULT 0,
  section_80g NUMERIC(15, 2) DEFAULT 0,
  section_80gg NUMERIC(15, 2) DEFAULT 0,
  section_80gga NUMERIC(15, 2) DEFAULT 0,
  section_80u NUMERIC(15, 2) DEFAULT 0,
  
  -- Tax Results
  old_regime_tax NUMERIC(15, 2) DEFAULT 0,
  new_regime_tax NUMERIC(15, 2) DEFAULT 0,
  opted_regime VARCHAR(50) DEFAULT 'new',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_tax_profiles_user_id ON user_tax_profiles(user_id);
CREATE INDEX idx_user_tax_profiles_year ON user_tax_profiles(assessment_year);

-- ============================================
-- TABLE: old_reign_calculations
-- Purpose: Archive for old regime tax calculations
-- ============================================
CREATE TABLE IF NOT EXISTS old_reign_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  
  -- All fields from OldReign model
  aadhaar_no BIGINT,
  first_name VARCHAR(255),
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  name VARCHAR(255),
  date_of_birth VARCHAR(20),
  father_name VARCHAR(255),
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  pan_card VARCHAR(20),
  mobile_no BIGINT,
  email VARCHAR(255),
  address TEXT,
  permanent_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pin_code VARCHAR(10),
  
  -- Employer
  employer_name VARCHAR(255),
  employer_address TEXT,
  employer_pan_number VARCHAR(20),
  tan_number VARCHAR(20),
  employee_reference_no VARCHAR(255),
  year VARCHAR(20),
  tax_deducted NUMERIC(15, 2) DEFAULT 0,
  
  -- Income
  salary NUMERIC(15, 2) DEFAULT 0,
  prerequisite_income NUMERIC(15, 2) DEFAULT 0,
  profit_income NUMERIC(15, 2) DEFAULT 0,
  other_income NUMERIC(15, 2) DEFAULT 0,
  hra NUMERIC(15, 2) DEFAULT 0,
  lta NUMERIC(15, 2) DEFAULT 0,
  other_exempted_allowances NUMERIC(15, 2) DEFAULT 0,
  professional_tax NUMERIC(15, 2) DEFAULT 0,
  
  own_house_income NUMERIC(15, 2) DEFAULT 0,
  rented_house_income NUMERIC(15, 2) DEFAULT 0,
  deemed_house_income NUMERIC(15, 2) DEFAULT 0,
  
  -- Deductions (Section 80)
  section_80c NUMERIC(15, 2) DEFAULT 0,
  section_80ccc NUMERIC(15, 2) DEFAULT 0,
  section_80ccd1 NUMERIC(15, 2) DEFAULT 0,
  section_80ccd2 NUMERIC(15, 2) DEFAULT 0,
  section_80ccd1b NUMERIC(15, 2) DEFAULT 0,
  section_80ccf NUMERIC(15, 2) DEFAULT 0,
  section_80ccg NUMERIC(15, 2) DEFAULT 0,
  section_80d NUMERIC(15, 2) DEFAULT 0,
  section_80dd NUMERIC(15, 2) DEFAULT 0,
  section_80ddb NUMERIC(15, 2) DEFAULT 0,
  section_80e NUMERIC(15, 2) DEFAULT 0,
  section_80ee NUMERIC(15, 2) DEFAULT 0,
  section_80g NUMERIC(15, 2) DEFAULT 0,
  section_80gga NUMERIC(15, 2) DEFAULT 0,
  section_80ggc NUMERIC(15, 2) DEFAULT 0,
  section_80qqb NUMERIC(15, 2) DEFAULT 0,
  section_80rrb NUMERIC(15, 2) DEFAULT 0,
  section_80tta NUMERIC(15, 2) DEFAULT 0,
  section_80u NUMERIC(15, 2) DEFAULT 0,
  
  old_final_tax NUMERIC(15, 2) DEFAULT 0,
  old_final_cess NUMERIC(15, 2) DEFAULT 0,
  new_final_tax NUMERIC(15, 2) DEFAULT 0,
  new_final_cess NUMERIC(15, 2) DEFAULT 0,
  preferred_system VARCHAR(50) DEFAULT 'OldRegime',
  
  total_taxable_income NUMERIC(15, 2) DEFAULT 0,
  total_income NUMERIC(15, 2) DEFAULT 0,
  total_deductions NUMERIC(15, 2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_old_reign_user_id ON old_reign_calculations(user_id);
CREATE INDEX idx_old_reign_token ON old_reign_calculations(token);

-- ============================================
-- TRIGGERS: Auto-update modified timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER personal_info_update_timestamp BEFORE UPDATE ON personal_info
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tax_calculations_update_timestamp BEFORE UPDATE ON tax_calculations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER user_tax_profiles_update_timestamp BEFORE UPDATE ON user_tax_profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER old_reign_update_timestamp BEFORE UPDATE ON old_reign_calculations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- Row-Level Security Policies (Optional but recommended)
-- ============================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE old_reign_calculations ENABLE ROW LEVEL SECURITY;

-- Policies for personal_info (users can only see their own)
CREATE POLICY "Users can view own personal_info"
ON personal_info FOR SELECT
USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY "Users can insert own personal_info"
ON personal_info FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_user));

-- Policies for tax_calculations
CREATE POLICY "Users can view own tax_calculations"
ON tax_calculations FOR SELECT
USING (user_id = (SELECT id FROM users WHERE email = current_user) OR user_id IS NULL);

CREATE POLICY "Users can insert own tax_calculations"
ON tax_calculations FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_user) OR user_id IS NULL);

-- Policies for user_tax_profiles
CREATE POLICY "Users can view own user_tax_profiles"
ON user_tax_profiles FOR SELECT
USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY "Users can insert own user_tax_profiles"
ON user_tax_profiles FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_user));

-- OTP table doesn't need RLS - it's public but time-limited
-- old_reign_calculations can be public for historical reference
