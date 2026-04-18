/**
 * Brevo REST API mailer — 300 emails/day free, no domain verification needed.
 * Requires BREVO_API_KEY and EMAIL_FROM in .env
 */

/**
 * Send OTP email via Brevo transactional API
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} purpose - 'signup' or 'forgot-password'
 */
const sendOTPEmail = async (toEmail, otp, purpose = 'signup') => {
  // ─── Dev fallback: if no API key, log OTP to console ───
  if (!process.env.BREVO_API_KEY) {
    console.log('────────────────────────────────────────');
    console.log(`📧 [DEV] OTP for ${toEmail} (${purpose}): ${otp}`);
    console.log('────────────────────────────────────────');
    return;
  }

  const subject =
    purpose === 'signup'
      ? 'TaxSarthi — Verify Your Email'
      : 'TaxSarthi — Reset Your Password';

  const heading =
    purpose === 'signup'
      ? 'Verify Your Email Address'
      : 'Reset Your Password';

  const subtext =
    purpose === 'signup'
      ? 'Thank you for signing up with TaxSarthi! Use the OTP below to complete your registration.'
      : 'We received a request to reset your password. Use the OTP below to proceed.';

  const htmlContent = `
    <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0e0e0e; border-radius: 16px; overflow: hidden; border: 1px solid #1e1e1e;">
      <div style="padding: 32px 28px 24px; text-align: center; background: linear-gradient(135deg, #111 0%, #0e0e0e 100%); border-bottom: 1px solid #1e1e1e;">
        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #f5f5f5; margin: 0;">TaxSarthi</h1>
        <p style="color: #555; font-size: 13px; margin: 6px 0 0;">Your Trusted Tax Companion</p>
      </div>
      <div style="padding: 32px 28px; text-align: center;">
        <h2 style="color: #f5f5f5; font-size: 20px; font-weight: 600; margin: 0 0 10px;">${heading}</h2>
        <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0 0 28px;">${subtext}</p>
        <div style="background: #141414; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; margin: 0 auto; display: inline-block;">
          <span style="font-family: 'SF Mono', 'Fira Code', monospace; font-size: 36px; font-weight: 700; color: #4ADE80; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 12px; margin: 24px 0 0;">This OTP is valid for <strong style="color: #aaa;">10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div style="padding: 16px 28px; background: #0c0c0c; border-top: 1px solid #1a1a1a; text-align: center;">
        <p style="color: #444; font-size: 11px; margin: 0;">If you did not request this, please ignore this email.</p>
        <p style="color: #333; font-size: 10px; margin: 6px 0 0;">&copy; ${new Date().getFullYear()} TaxSarthi. All rights reserved.</p>
      </div>
    </div>
  `;

  const payload = JSON.stringify({
    sender: { name: 'TaxSarthi', email: process.env.EMAIL_FROM },
    to: [{ email: toEmail }],
    subject,
    htmlContent,
  });

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: payload,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Brevo ${res.status}: ${errBody}`);
    }

    console.log(`✅ OTP email sent to ${toEmail}`);
  } catch (err) {
    console.error('⚠️  Email send failed:', err.message);
    console.log('────────────────────────────────────────');
    console.log(`📧 [FALLBACK] OTP for ${toEmail} (${purpose}): ${otp}`);
    console.log('────────────────────────────────────────');
  }
};

module.exports = { sendOTPEmail };
