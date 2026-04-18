const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const userModel = require('../Models/userModel');
const { sendOTPEmail } = require('../Config/mailer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const supabase = require('../Config/supabase');

// Generate a cryptographically secure 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// ─── Send OTP (for signup) ───────────────────────────────────────────
exports.sendSignupOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Check if user already exists
  const existingUser = await userModel.getUserByEmail(email.toLowerCase());
  if (existingUser) {
    throw new AppError('Email already registered. Please login instead.', 409);
  }

  // Rate limit: delete any existing OTP for this email+purpose
  await supabase
    .from('otp')
    .delete()
    .eq('email', email.toLowerCase())
    .eq('purpose', 'signup');

  // Generate OTP
  const otp = generateOTP();

  // Store OTP (plain text for now, with expiration)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
  const { error: insertError } = await supabase
    .from('otp')
    .insert([{
      email: email.toLowerCase(),
      otp_code: otp,
      purpose: 'signup',
      expires_at: expiresAt,
    }]);

  if (insertError) {
    throw new AppError('Failed to send OTP', 500);
  }

  // Send email
  await sendOTPEmail(email, otp, 'signup');

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email. Valid for 10 minutes.',
  });
});

// ─── Verify OTP (for signup) ─────────────────────────────────────────
exports.verifySignupOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError('Email and OTP are required', 400);
  }

  const { data: otpRecord, error: selectError } = await supabase
    .from('otp')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('purpose', 'signup')
    .limit(1)
    .single();

  if (!otpRecord || selectError) {
    throw new AppError('OTP expired or not found. Please request a new one.', 400);
  }

  // Check expiration
  if (new Date(otpRecord.expires_at) < new Date()) {
    await supabase
      .from('otp')
      .delete()
      .eq('id', otpRecord.id);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Verify OTP
  if (otp !== otpRecord.otp_code) {
    throw new AppError('Incorrect OTP. Please try again.', 400);
  }

  // OTP verified — delete it
  await supabase
    .from('otp')
    .delete()
    .eq('id', otpRecord.id);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully.',
    verified: true,
  });
});

// ─── Send OTP (for forgot password) ─────────────────────────────────
exports.sendForgotPasswordOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Check if user exists
  const user = await userModel.getUserByEmail(email.toLowerCase());
  if (!user) {
    throw new AppError('No account found with this email', 404);
  }

  // Rate limit: delete any existing OTP for this email+purpose
  await supabase
    .from('otp')
    .delete()
    .eq('email', email.toLowerCase())
    .eq('purpose', 'forgot-password');

  // Generate OTP
  const otp = generateOTP();

  // Store OTP with expiration
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
  const { error: insertError } = await supabase
    .from('otp')
    .insert([{
      email: email.toLowerCase(),
      otp_code: otp,
      purpose: 'forgot-password',
      expires_at: expiresAt,
    }]);

  if (insertError) {
    throw new AppError('Failed to send OTP', 500);
  }

  // Send email
  await sendOTPEmail(email, otp, 'forgot-password');

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email for password reset. Valid for 10 minutes.',
  });
});

// ─── Verify OTP (for forgot password) ───────────────────────────────
exports.verifyForgotPasswordOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError('Email and OTP are required', 400);
  }

  const { data: otpRecord, error: selectError } = await supabase
    .from('otp')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('purpose', 'forgot-password')
    .limit(1)
    .single();

  if (!otpRecord || selectError) {
    throw new AppError('OTP expired or not found. Please request a new one.', 400);
  }

  // Check expiration
  if (new Date(otpRecord.expires_at) < new Date()) {
    await supabase
      .from('otp')
      .delete()
      .eq('id', otpRecord.id);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Verify OTP
  if (otp !== otpRecord.otp_code) {
    throw new AppError('Incorrect OTP. Please try again.', 400);
  }

  // OTP verified — delete it
  await supabase
    .from('otp')
    .delete()
    .eq('id', otpRecord.id);

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully. You can now reset your password.',
    verified: true,
  });
});

// ─── Reset Password (with OTP verification) ─────────────────────────
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new AppError('Email, OTP, and new password are required', 400);
  }

  if (newPassword.length < 4) {
    throw new AppError('Password must be at least 4 characters', 400);
  }

  // Find and verify OTP record
  const { data: otpRecord, error: selectError } = await supabase
    .from('otp')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('purpose', 'forgot-password')
    .limit(1)
    .single();

  if (!otpRecord || selectError) {
    throw new AppError('OTP expired or not found. Please request a new one.', 400);
  }

  // Check expiration
  if (new Date(otpRecord.expires_at) < new Date()) {
    await supabase
      .from('otp')
      .delete()
      .eq('id', otpRecord.id);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Verify OTP
  if (otp !== otpRecord.otp_code) {
    throw new AppError('Incorrect OTP. Please try again.', 400);
  }

  // Get user first
  const user = await userModel.getUserByEmail(email.toLowerCase());
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // OTP valid — hash new password and update
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await userModel.updateUser(user.id, { password: hashedPassword });

  if (!updatedUser) {
    throw new AppError('Failed to reset password', 500);
  }

  // Clean up OTP
  await supabase
    .from('otp')
    .delete()
    .eq('id', otpRecord.id);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful. You can now login with your new password.',
    verified: true,
  });
});
