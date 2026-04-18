/**
 * OTP Model - Supabase PostgreSQL
 * Handles OTP generation, verification, and cleanup
 * 
 * Database Table Schema:
 * CREATE TABLE otp (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email VARCHAR(255) NOT NULL,
 *   otp_code VARCHAR(6) NOT NULL,
 *   purpose VARCHAR(50), -- 'signup' or 'reset'
 *   expires_at TIMESTAMPTZ NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

const supabase = require('../Config/supabase');

const OTP_VALIDITY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Store OTP in database
 */
exports.storeOTP = async (email, otpCode, purpose = 'signup') => {
  const expiresAt = new Date(Date.now() + OTP_VALIDITY_MS);

  const { data, error } = await supabase
    .from('otp')
    .insert({
      email: email.toLowerCase(),
      otp_code: otpCode,
      purpose,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store OTP: ${error.message}`);
  }

  return data;
};

/**
 * Verify OTP and check if it's valid
 */
exports.verifyOTP = async (email, otpCode) => {
  // Query for valid OTP
  const { data, error } = await supabase
    .from('otp')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('otp_code', otpCode)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { valid: false, reason: 'Invalid or expired OTP' };
    }
    throw new Error(`Failed to verify OTP: ${error.message}`);
  }

  return data;
};

/**
 * Delete OTP after successful verification
 */
exports.deleteOTP = async (otpId) => {
  const { error } = await supabase
    .from('otp')
    .delete()
    .eq('id', otpId);

  if (error) {
    throw new Error(`Failed to delete OTP: ${error.message}`);
  }

  return { success: true };
};

/**
 * Delete all expired OTPs for cleanup
 */
exports.deleteExpiredOTPs = async () => {
  const { data, error, count } = await supabase
    .from('otp')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select()
    .count('exact');

  if (error) {
    throw new Error(`Failed to delete expired OTPs: ${error.message}`);
  }

  console.log(`🧹 Cleaned up ${count} expired OTPs`);
  return { deletedCount: count };
};

/**
 * Delete latest OTP for an email (for resending new OTP)
 */
exports.deleteLatestOTPByEmail = async (email, purpose = 'signup') => {
  const { data, error } = await supabase
    .from('otp')
    .select('id')
    .eq('email', email.toLowerCase())
    .eq('purpose', purpose)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true }; // No OTP found, nothing to delete
    }
    throw new Error(`Failed to fetch latest OTP: ${error.message}`);
  }

  if (data) {
    const { error: deleteError } = await supabase
      .from('otp')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      throw new Error(`Failed to delete OTP: ${deleteError.message}`);
    }
  }

  return { success: true };
};

/**
 * Get all recent OTPs for an email (for rate limiting)
 */
exports.getRecentOTPCount = async (email, minutesBack = 5) => {
  const timeThreshold = new Date(Date.now() - minutesBack * 60 * 1000);

  const { data, count, error } = await supabase
    .from('otp')
    .select('id', { count: 'exact' })
    .eq('email', email.toLowerCase())
    .gte('created_at', timeThreshold.toISOString());

  if (error) {
    throw new Error(`Failed to count recent OTPs: ${error.message}`);
  }

  return count || 0;
};

/**
 * Complete OTP validation and cleanup
 * Returns true if OTP is valid, false otherwise
 */
exports.validateAndCleanOTP = async (email, otpCode) => {
  try {
    // Verify OTP
    const otpRecord = await exports.verifyOTP(email, otpCode);

    if (!otpRecord) {
      return { valid: false, reason: 'Invalid or expired OTP' };
    }

    // Delete the OTP after successful verification
    await exports.deleteOTP(otpRecord.id);

    return { valid: true, purpose: otpRecord.purpose };
  } catch (error) {
    console.error('❌ OTP validation error:', error);
    return { valid: false, reason: 'OTP validation failed' };
  }
};
