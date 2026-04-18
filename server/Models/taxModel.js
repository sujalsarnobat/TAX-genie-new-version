/**
 * Tax Calculation Model - Supabase PostgreSQL
 * Handles all tax-related database operations
 * 
 * Database Table Schema:
 * CREATE TABLE tax_calculations (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   basic_salary DECIMAL(12, 2),
 *   hra DECIMAL(12, 2),
 *   lta DECIMAL(12, 2),
 *   other_allowances DECIMAL(12, 2),
 *   old_regime_tax JSONB,
 *   new_regime_tax JSONB,
 *   regime_suggested VARCHAR(50),
 *   assessment_year VARCHAR(10),
 *   token VARCHAR(100) UNIQUE,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

const supabase = require('../Config/supabase');

/**
 * Create new tax calculation
 */
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

  if (error) {
    throw new Error(`Failed to create tax calculation: ${error.message}`);
  }

  return data;
};

/**
 * Get tax calculation by token (unique identifier)
 */
exports.getTaxByToken = async (token) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch tax calculation: ${error.message}`);
  }

  return data;
};

/**
 * Get tax calculation by ID
 */
exports.getTaxById = async (taxId) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('id', taxId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch tax calculation: ${error.message}`);
  }

  return data;
};

/**
 * Get all tax calculations for a user
 */
exports.getTaxHistoryByUserId = async (userId, options = {}) => {
  const { limit = 50, offset = 0 } = options;

  const { data, error, count } = await supabase
    .from('tax_calculations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch tax history: ${error.message}`);
  }

  return {
    data,
    count,
    total: count,
  };
};

/**
 * Get tax calculations for a specific year
 */
exports.getTaxByYearAndUser = async (userId, assessmentYear) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('user_id', userId)
    .eq('assessment_year', assessmentYear)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tax calculations: ${error.message}`);
  }

  return data;
};

/**
 * Update tax calculation
 */
exports.updateTaxCalculation = async (taxId, updates) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .update(updates)
    .eq('id', taxId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tax calculation: ${error.message}`);
  }

  return data;
};

/**
 * Delete tax calculation
 */
exports.deleteTaxCalculation = async (taxId) => {
  const { error } = await supabase
    .from('tax_calculations')
    .delete()
    .eq('id', taxId);

  if (error) {
    throw new Error(`Failed to delete tax calculation: ${error.message}`);
  }

  return { success: true };
};

/**
 * Get multiple years comparison for a user
 */
exports.getYearsComparison = async (userId) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('assessment_year, old_regime_tax, new_regime_tax, created_at')
    .eq('user_id', userId)
    .order('assessment_year', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch years comparison: ${error.message}`);
  }

  return data;
};

/**
 * Get total tax for user (current year)
 */
exports.getTotalTaxCurrentYear = async (userId, currentYear) => {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('old_regime_tax, new_regime_tax')
    .eq('user_id', userId)
    .eq('assessment_year', currentYear)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No calculation found
    }
    throw new Error(`Failed to fetch current year tax: ${error.message}`);
  }

  return data;
};

/**
 * Get tax history by user email
 * First finds user by email, then fetches their tax calculations
 */
exports.getTaxHistoryByEmail = async (email, options = {}) => {
  const userModel = require('./userModel');
  
  // Get user by email first
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return { data: [], count: 0, total: 0 };
  }

  // Get tax history for that user
  return exports.getTaxHistoryByUserId(user.id, options);
};
