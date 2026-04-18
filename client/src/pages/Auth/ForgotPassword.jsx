import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import "../Auth/Login.css";
import "../../components/Auth/Main.css";
import "./ForgotPassword.css";

const API = "http://localhost:8000";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ─── Step 1: Send OTP ─────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/user/forgot-password`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
      setCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // ─── Step 2: Verify OTP → go to step 3 ───
  function handleOTPVerified() {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    setStep(3);
  }

  // ─── Step 3: Reset Password ───────────────
  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/user/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
      });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  // ─── Resend OTP ────────────────────────────
  async function handleResendOTP() {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${API}/user/forgot-password`, { email });
      toast.success("OTP resent!");
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  // ─── OTP input handlers ────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleOTPVerified();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  // ─── Step indicators ──────────────────────
  const steps = [
    { num: 1, label: "Email", icon: Mail },
    { num: 2, label: "Verify", icon: ShieldCheck },
    { num: 3, label: "Reset", icon: Lock },
  ];

  return (
    <section className="forgot-page">
      <div className="forgot-card">
        {/* Back button */}
        <button className="forgot-back" onClick={() => navigate("/login")}>
          <ArrowLeft size={18} /> Back to Login
        </button>

        <h1 className="forgot-title">Reset Password</h1>

        {/* Step indicator */}
        <div className="forgot-steps">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`forgot-step ${step >= s.num ? "active" : ""} ${
                step === s.num ? "current" : ""
              }`}
            >
              <div className="forgot-step-dot">
                <s.icon size={14} />
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="forgot-form">
            <p className="forgot-desc">
              Enter the email address associated with your account and we'll send
              you a verification code.
            </p>
            <input
              className="login-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="forgot-submit-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="forgot-form">
            <p className="forgot-desc">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <div className="otp-inputs" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>
            <button
              className="forgot-submit-btn"
              onClick={handleOTPVerified}
              disabled={loading || otp.join("").length !== 6}
            >
              Verify OTP
            </button>
            <div className="otp-actions">
              <button
                className="otp-resend-btn"
                onClick={handleResendOTP}
                disabled={cooldown > 0 || loading}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="forgot-form">
            <p className="forgot-desc">
              Create a new password for your account.
            </p>
            <input
              className="login-input"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
            <input
              className="login-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="forgot-submit-btn"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ForgotPassword;
